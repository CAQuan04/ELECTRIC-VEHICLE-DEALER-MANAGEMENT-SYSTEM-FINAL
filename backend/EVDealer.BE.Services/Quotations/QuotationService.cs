using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Quotations
{
    public class QuotationService : IQuotationService
    {
        private readonly IQuotationRepository _quotationRepository;
        private readonly ICustomerRepository _customerRepository; 

        public QuotationService(IQuotationRepository quotationRepository, ICustomerRepository customerRepository)
        {
            _quotationRepository = quotationRepository;
            _customerRepository = customerRepository;
        }

        public async Task<QuotationDto> CreateAsync(QuotationCreateDto createDto, int createdByUserId)
        {
            var customer = await _customerRepository.GetByIdAsync(createDto.CustomerId);
            if (customer == null)
            {
                throw new Exception("Customer not found.");
            }

            var totalAmount = createDto.Items.Sum(item => item.Quantity * item.UnitPrice);

            var quotation = new Quotation
            {
                CustomerId = createDto.CustomerId,
                CreatedByUserId = createdByUserId,
                ValidUntil = createDto.ValidUntil,
                TotalAmount = totalAmount,
                Status = "Draft", 
                QuotationItems = createDto.Items.Select(itemDto => new QuotationItem
                {
                    VehicleId = itemDto.VehicleId,
                    ConfigId = itemDto.ConfigId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice
                }).ToList()
            };

            var createdQuotation = await _quotationRepository.CreateAsync(quotation);
            return MapToQuotationDto(createdQuotation);
        }

        public async Task<QuotationDto?> GetByIdAsync(int quotationId)
        {
            var quotation = await _quotationRepository.GetByIdAsync(quotationId);
            return quotation != null ? MapToQuotationDto(quotation) : null;
        }

        public async Task<System.Collections.Generic.IEnumerable<QuotationDto>> GetDealerQuotationsAsync(int dealerId, string? status, string? search)
        {
            var quotations = await _quotationRepository.GetAllAsync();
            
            // Filter by dealer through CreatedByUser
            var dealerQuotations = quotations.Where(q => q.CreatedByUser?.DealerId == dealerId);

            if (!string.IsNullOrEmpty(status))
            {
                dealerQuotations = dealerQuotations.Where(q => q.Status == status);
            }

            if (!string.IsNullOrEmpty(search))
            {
                dealerQuotations = dealerQuotations.Where(q => 
                    q.Customer.FullName.Contains(search) ||
                    q.QuotationId.ToString().Contains(search));
            }

            return dealerQuotations.Select(MapToQuotationDto).ToList();
        }

        public async Task<QuotationDto> UpdateAsync(int quotationId, QuotationUpdateDto updateDto)
        {
            var quotation = await _quotationRepository.GetByIdAsync(quotationId);
            if (quotation == null)
            {
                throw new Exception("Quotation not found");
            }

            if (updateDto.ValidUntil.HasValue)
            {
                quotation.ValidUntil = updateDto.ValidUntil;
            }

            if (!string.IsNullOrEmpty(updateDto.Status))
            {
                quotation.Status = updateDto.Status;
            }

            if (updateDto.Items != null && updateDto.Items.Any())
            {
                // Clear existing items and add new ones
                quotation.QuotationItems.Clear();
                foreach (var itemDto in updateDto.Items)
                {
                    quotation.QuotationItems.Add(new QuotationItem
                    {
                        VehicleId = itemDto.VehicleId,
                        ConfigId = itemDto.ConfigId,
                        Quantity = itemDto.Quantity,
                        UnitPrice = itemDto.UnitPrice
                    });
                }
                quotation.TotalAmount = updateDto.Items.Sum(i => i.Quantity * i.UnitPrice);
            }

            var updated = await _quotationRepository.UpdateAsync(quotation);
            return MapToQuotationDto(updated);
        }

        public async Task SendQuotationAsync(int quotationId)
        {
            var quotation = await _quotationRepository.GetByIdAsync(quotationId);
            
            if (quotation == null)
            {
                throw new Exception("Quotation not found");
            }

            if (quotation.Status != "Draft")
            {
                throw new Exception("Only draft quotations can be sent");
            }

            quotation.Status = "Sent";
            await _quotationRepository.UpdateAsync(quotation);
            
            // TODO: Send email/notification to customer
        }

        private QuotationDto MapToQuotationDto(Quotation quotation)
        {
            return new QuotationDto
            {
                QuotationId = quotation.QuotationId,
                CustomerId = quotation.CustomerId,
                CreatedByUserId = quotation.CreatedByUserId,
                TotalAmount = quotation.TotalAmount,
                ValidUntil = quotation.ValidUntil,
                Status = quotation.Status,
                CreatedAt = DateTime.UtcNow, 
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