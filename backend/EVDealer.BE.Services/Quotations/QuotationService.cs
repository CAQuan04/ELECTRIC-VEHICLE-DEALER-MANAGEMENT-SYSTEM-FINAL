using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Quotations
{
    public class QuotationService : IQuotationService
    {
        private readonly IQuotationRepository _quotationRepository;
        private readonly ICustomerRepository _customerRepository;
        // Cần thêm PromotionRepo để validate nếu muốn chặt chẽ hơn
        // private readonly IPromotionRepository _promotionRepository;

        public QuotationService(IQuotationRepository quotationRepository, ICustomerRepository customerRepository)
        {
            _quotationRepository = quotationRepository;
            _customerRepository = customerRepository;
        }

        public async Task<QuotationDto> CreateAsync(QuotationCreateDto createDto, int createdByUserId)
        {
            // 1. Kiểm tra khách hàng
            var customer = await _customerRepository.GetByIdAsync(createDto.CustomerId);
            if (customer == null)
            {
                throw new Exception("Customer not found.");
            }

            // 2. Tính toán tổng tiền cơ bản từ Items (Xe)
            decimal itemsTotal = 0;
            var quotationItems = new List<QuotationItem>();

            foreach (var itemDto in createDto.Items)
            {
                decimal lineTotal = itemDto.Quantity * itemDto.UnitPrice;
                itemsTotal += lineTotal;

                quotationItems.Add(new QuotationItem
                {
                    VehicleId = itemDto.VehicleId,
                    ConfigId = itemDto.ConfigId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice
                });
            }

            // 3. Xử lý Options & Services (Map vào Notes vì chưa có bảng riêng)
            var noteDetails = new List<string>();
            
            if (!string.IsNullOrEmpty(createDto.Notes)) 
                noteDetails.Add($"Ghi chú: {createDto.Notes}");
                
            if (!string.IsNullOrEmpty(createDto.BatteryPolicy)) 
                noteDetails.Add($"Chính sách pin: {createDto.BatteryPolicy}");

            if (createDto.Options != null && createDto.Options.Any())
            {
                noteDetails.Add($"Tùy chọn (IDs): {string.Join(", ", createDto.Options)}");
            }

            if (createDto.Services != null && createDto.Services.Any())
            {
                foreach (var kvp in createDto.Services)
                {
                    noteDetails.Add($"Dịch vụ {kvp.Key}: {kvp.Value}");
                }
            }

            string combinedNotes = string.Join("\n", noteDetails);

            // 4. Tính TotalAmount cuối cùng (Items - Discount)
            // Lưu ý: Tạm thời chưa cộng giá Options/Services vào đây vì BE không biết giá
            decimal finalTotal = itemsTotal - createDto.Discount;
            if (finalTotal < 0) finalTotal = 0;

            // 5. Tạo Entity Quotation
            var quotation = new Quotation
            {
                CustomerId = createDto.CustomerId,
                CreatedByUserId = createdByUserId,
                DealerId = createDto.DealerId != 0 ? createDto.DealerId : (int?)null,
                
                // Map các trường mới
                PaymentType = createDto.PaymentMethod,
                TotalBefore = itemsTotal,
                TotalDiscount = createDto.Discount,
                TotalAmount = finalTotal,
                
                ValidUntil = createDto.ValidUntil,
                Status = "Draft", // Mặc định là bản nháp
                CreatedAt = DateTime.UtcNow,
                Notes = combinedNotes,
                
                QuotationItems = quotationItems
            };

            // 6. Shortcut: Lưu thông tin xe chính vào bảng Quotation để dễ query
            if (quotationItems.Any())
            {
                quotation.VehicleId = quotationItems.First().VehicleId;
                quotation.ConfigId = quotationItems.First().ConfigId;
            }

            // 7. Xử lý Promotion (Nếu có)
            if (createDto.PromotionId.HasValue)
            {
                quotation.QuotationPromotions.Add(new QuotationPromotion 
                { 
                    PromotionId = createDto.PromotionId.Value 
                });
            }

            // 8. Lưu xuống DB
            var createdQuotation = await _quotationRepository.CreateAsync(quotation);
            return MapToQuotationDto(createdQuotation);
        }

        public async Task<QuotationDto?> GetByIdAsync(int quotationId)
        {
            var quotation = await _quotationRepository.GetByIdAsync(quotationId);
            return quotation != null ? MapToQuotationDto(quotation) : null;
        }

        public async Task<IEnumerable<QuotationDto>> GetDealerQuotationsAsync(int dealerId, string? status, string? search)
        {
            // Lưu ý: Nên tối ưu bằng cách lọc ngay từ Repository thay vì lấy hết rồi lọc
            // Nhưng ở đây giữ logic cũ của bạn và bổ sung điều kiện
            var quotations = await _quotationRepository.GetAllAsync();
            
            // Filter by DealerId directly (nếu có cột DealerId) hoặc qua CreatedByUser
            var dealerQuotations = quotations.Where(q => q.DealerId == dealerId || q.CreatedByUser?.DealerId == dealerId);

            if (!string.IsNullOrEmpty(status))
            {
                dealerQuotations = dealerQuotations.Where(q => q.Status == status);
            }

            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                dealerQuotations = dealerQuotations.Where(q => 
                    (q.Customer.FullName != null && q.Customer.FullName.ToLower().Contains(search)) ||
                    q.QuotationId.ToString().Contains(search)
                );
            }

            return dealerQuotations.Select(MapToQuotationDto).ToList();
        }

        public async Task<QuotationDto> UpdateAsync(int quotationId, QuotationUpdateDto updateDto)
        {
            var quotation = await _quotationRepository.GetByIdAsync(quotationId);
            if (quotation == null) throw new Exception("Quotation not found");

            if (updateDto.ValidUntil.HasValue)
                quotation.ValidUntil = updateDto.ValidUntil;

            if (!string.IsNullOrEmpty(updateDto.Status))
                quotation.Status = updateDto.Status;

            if (updateDto.Items != null && updateDto.Items.Any())
            {
                quotation.QuotationItems.Clear();
                decimal newTotal = 0;
                
                foreach (var itemDto in updateDto.Items)
                {
                    newTotal += itemDto.Quantity * itemDto.UnitPrice;
                    quotation.QuotationItems.Add(new QuotationItem
                    {
                        VehicleId = itemDto.VehicleId,
                        ConfigId = itemDto.ConfigId,
                        Quantity = itemDto.Quantity,
                        UnitPrice = itemDto.UnitPrice
                    });
                }
                
                // Cập nhật lại tổng tiền (giữ nguyên Discount cũ nếu không update discount)
                // Logic update này có thể cần mở rộng thêm field Discount trong UpdateDto sau này
                quotation.TotalAmount = newTotal - (quotation.TotalDiscount ?? 0);
                if (quotation.TotalAmount < 0) quotation.TotalAmount = 0;
            }

            quotation.UpdatedAt = DateTime.UtcNow;
            var updated = await _quotationRepository.UpdateAsync(quotation);
            return MapToQuotationDto(updated);
        }

        public async Task SendQuotationAsync(int quotationId)
        {
            var quotation = await _quotationRepository.GetByIdAsync(quotationId);
            
            if (quotation == null) throw new Exception("Quotation not found");

            if (quotation.Status != "Draft") throw new Exception("Only draft quotations can be sent");

            quotation.Status = "Sent";
            quotation.UpdatedAt = DateTime.UtcNow;
            
            await _quotationRepository.UpdateAsync(quotation);
            
            // TODO: Send email/notification logic here
        }

        private QuotationDto MapToQuotationDto(Quotation quotation)
        {
            return new QuotationDto
            {
                QuotationId = quotation.QuotationId,
                CustomerId = quotation.CustomerId,
                DealerId = quotation.DealerId,
                CreatedByUserId = quotation.CreatedByUserId,
                
                TotalAmount = quotation.TotalAmount,
                TotalDiscount = quotation.TotalDiscount,
                PaymentType = quotation.PaymentType,
                
                ValidUntil = quotation.ValidUntil,
                Status = quotation.Status,
                CreatedAt = quotation.CreatedAt ?? DateTime.MinValue,
                Notes = quotation.Notes,
                
                Items = quotation.QuotationItems.Select(item => new QuotationItemDto
                {
                    VehicleId = item.VehicleId,
                    ConfigId = item.ConfigId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                }).ToList()
            };
        }
    }
}