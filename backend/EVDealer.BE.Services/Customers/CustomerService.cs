using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.Customers;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerService(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<CustomerDto> CreateAsync(CustomerCreateDto createDto)
    {
        var existingCustomer = await _customerRepository.GetByPhoneAsync(createDto.Phone);
        if (existingCustomer != null)
            throw new Exception("Customer with this phone number already exists");

        var customer = new Customer
        {
            FullName = createDto.FullName,
            Phone = createDto.Phone,
            Address = createDto.Address,
            IdDocumentNumber = createDto.IdDocumentNumber
        };

        var createdCustomer = await _customerRepository.CreateAsync(customer);
        return MapToCustomerDto(createdCustomer);
    }

    public async Task<CustomerDto> UpdateAsync(int customerId, CustomerUpdateDto updateDto)
    {
        var customer = await _customerRepository.GetByIdAsync(customerId);
        if (customer == null)
            throw new Exception("Customer not found");

        var existingCustomerWithPhone = await _customerRepository.GetByPhoneAsync(updateDto.Phone);
        if (existingCustomerWithPhone != null && existingCustomerWithPhone.CustomerId != customerId)
            throw new Exception("Another customer with this phone number already exists");

        customer.FullName = updateDto.FullName;
        customer.Phone = updateDto.Phone;
        customer.Address = updateDto.Address;
        customer.IdDocumentNumber = updateDto.IdDocumentNumber;

        var updatedCustomer = await _customerRepository.UpdateAsync(customer);
        return MapToCustomerDto(updatedCustomer);
    }

    public async Task<CustomerDto?> GetByIdAsync(int customerId)
    {
        var customer = await _customerRepository.GetByIdAsync(customerId);
        return customer != null ? MapToCustomerDto(customer) : null;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllAsync()
    {
        var customers = await _customerRepository.GetAllAsync();
        return customers.Select(MapToCustomerDto);
    }

    public async Task<PagedResult<CustomerDto>> GetWithPagingAsync(CustomerQueryDto query)
    {
        var customers = await _customerRepository.GetWithPagingAsync(query);
        var total = await _customerRepository.GetTotalCountAsync(query);

        var customerDtos = customers.Select(MapToCustomerDto).ToList();

        return new PagedResult<CustomerDto>
        {
            Items = customerDtos,
            Pagination = new Pagination
            {
                Page = query.Page,
                Size = query.Size,
                Total = total
            }
        };
    }

    public async Task<bool> DeleteAsync(int customerId)
    {
        if (!await _customerRepository.ExistsAsync(customerId))
            return false;

        return await _customerRepository.DeleteAsync(customerId);
    }

    public async Task<CustomerDto?> GetByPhoneAsync(string phone)
    {
        var customer = await _customerRepository.GetByPhoneAsync(phone);
        return customer != null ? MapToCustomerDto(customer) : null;
    }

    private CustomerDto MapToCustomerDto(Customer customer)
    {
        return new CustomerDto
        {
            CustomerId = customer.CustomerId,
            FullName = customer.FullName,
            Phone = customer.Phone,
            Address = customer.Address,
            IdDocumentNumber = customer.IdDocumentNumber,
            TotalOrders = customer.SalesOrders?.Count ?? 0,
            TotalTestDrives = customer.TestDrives?.Count ?? 0,
            TotalQuotations = customer.Quotations?.Count ?? 0
        };
    }
}