using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace EVDealer.BE.DAL.Repositories;

public class VehicleRepository : IVehicleRepository
{
    private readonly ApplicationDbContext _context;

    public VehicleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Vehicle>> GetVehiclesWithPagingAsync(VehicleQueryDto query)
    {
        var vehiclesQuery = BuildVehiclesBaseQuery(query);

        return await vehiclesQuery
            .OrderBy(v => v.Brand)
            .ThenBy(v => v.Model)
            .Skip((query.Page - 1) * query.Size)
            .Take(query.Size)
            .ToListAsync();
    }

    public async Task<int> GetVehiclesTotalCountAsync(VehicleQueryDto query)
    {
        var vehiclesQuery = BuildVehiclesBaseQuery(query);
        return await vehiclesQuery.CountAsync();
    }

    public async Task<Vehicle> GetVehicleWithDetailsAsync(int vehicleId)
    {
        return await _context.Vehicles
            .Include(v => v.VehicleConfigs)
            .Include(v => v.Inventories)
                .ThenInclude(i => i.Config)
            .FirstOrDefaultAsync(v => v.VehicleId == vehicleId) ?? throw new Exception("Vehicle not found");
    }

    public async Task<IEnumerable<Vehicle>> GetVehiclesForComparisonAsync(IEnumerable<int> vehicleIds)
    {
        return await _context.Vehicles
            .Include(v => v.VehicleConfigs)
            .Where(v => vehicleIds.Contains(v.VehicleId))
            .ToListAsync();
    }

    public async Task<IEnumerable<VehicleConfig>> GetAvailableConfigsAsync(int vehicleId)
    {
        return await _context.VehicleConfigs
            .Include(vc => vc.Vehicle)
            .Include(vc => vc.Inventories)
            .Where(vc => vc.VehicleId == vehicleId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Inventory>> GetInventoriesByVehicleAsync(int vehicleId)
    {
        return await _context.Inventories
            .Include(i => i.Vehicle)
            .Include(i => i.Config)
            .Where(i => i.VehicleId == vehicleId)
            .ToListAsync();
    }

    private IQueryable<Vehicle> BuildVehiclesBaseQuery(VehicleQueryDto query)
    {
        var vehiclesQuery = _context.Vehicles
            .Include(v => v.VehicleConfigs)
            .Include(v => v.Inventories)
                .ThenInclude(i => i.Config)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Search))
            vehiclesQuery = vehiclesQuery.Where(v =>
                v.Model.Contains(query.Search) || v.Brand.Contains(query.Search));

        if (!string.IsNullOrEmpty(query.Brand))
            vehiclesQuery = vehiclesQuery.Where(v => v.Brand == query.Brand);

        if (!string.IsNullOrEmpty(query.Model))
            vehiclesQuery = vehiclesQuery.Where(v => v.Model.Contains(query.Model));

        if (query.MinPrice.HasValue)
            vehiclesQuery = vehiclesQuery.Where(v => v.BasePrice >= query.MinPrice.Value);

        if (query.MaxPrice.HasValue)
            vehiclesQuery = vehiclesQuery.Where(v => v.BasePrice <= query.MaxPrice.Value);

        return vehiclesQuery;
    }
    public async Task<IEnumerable<Vehicle>> GetAllAsync()
    {
        return await _context.Vehicles.AsNoTracking().ToListAsync();
    }


    // === PHẦN BỔ SUNG: TRIỂN KHAI PHƯƠNG THỨC MỚI, TỐI ƯU HƠN ===
    // Ghi chú: Phương thức này chỉ lấy dữ liệu từ bảng Vehicle, không JOIN, rất nhanh.
    public async Task<IEnumerable<Vehicle>> GetAllBasicAsync()
    {
        return await _context.Vehicles.AsNoTracking().ToListAsync();
    }
}