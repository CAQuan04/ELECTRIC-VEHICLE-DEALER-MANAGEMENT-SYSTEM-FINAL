using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace EVDealer.BE.DAL.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly ApplicationDbContext _context;

    public CustomerRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Customer> CreateAsync(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return customer;
    }

    public async Task<Customer> UpdateAsync(Customer customer)
    {
        _context.Customers.Update(customer);
        await _context.SaveChangesAsync();
        return customer;
    }

    public async Task<Customer?> GetByIdAsync(int customerId)
    {
        return await _context.Customers
            .Include(c => c.SalesOrders)
            .Include(c => c.TestDrives)
            .Include(c => c.Quotations)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);
    }

    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await _context.Customers
            .Include(c => c.SalesOrders)
            .Include(c => c.TestDrives)
            .Include(c => c.Quotations)
            .OrderBy(c => c.FullName)
            .ToListAsync();
    }

    public async Task<IEnumerable<Customer>> GetWithPagingAsync(CustomerQueryDto query)
    {
        var customersQuery = BuildCustomersBaseQuery(query);

        return await customersQuery
            .OrderBy(c => c.FullName)
            .Skip((query.Page - 1) * query.Size)
            .Take(query.Size)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync(CustomerQueryDto query)
    {
        var customersQuery = BuildCustomersBaseQuery(query);
        return await customersQuery.CountAsync();
    }

    public async Task<bool> DeleteAsync(int customerId)
    {
        var customer = await _context.Customers.FindAsync(customerId);
        if (customer == null)
            return false;

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int customerId)
    {
        return await _context.Customers.AnyAsync(c => c.CustomerId == customerId);
    }

    public async Task<Customer?> GetByPhoneAsync(string phone)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Phone == phone);
    }

    private IQueryable<Customer> BuildCustomersBaseQuery(CustomerQueryDto query)
    {
        var customersQuery = _context.Customers.AsQueryable();

        if (!string.IsNullOrEmpty(query.Search))
        {
            customersQuery = customersQuery.Where(c =>
                c.FullName.Contains(query.Search) || 
                c.Phone.Contains(query.Search) ||
                (c.Address != null && c.Address.Contains(query.Search)) ||
                (c.IdDocumentNumber != null && c.IdDocumentNumber.Contains(query.Search)));
        }

        if (!string.IsNullOrEmpty(query.Phone))
        {
            customersQuery = customersQuery.Where(c => c.Phone.Contains(query.Phone));
        }

        return customersQuery;
    }
}