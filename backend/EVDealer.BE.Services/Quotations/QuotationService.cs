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