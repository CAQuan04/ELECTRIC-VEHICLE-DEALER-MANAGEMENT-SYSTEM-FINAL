using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.DAL.Repositories;

public interface IVehicleRepository
{
    Task<IEnumerable<Vehicle>> GetVehiclesWithPagingAsync(VehicleQueryDto query);
    Task<int> GetVehiclesTotalCountAsync(VehicleQueryDto query);
    Task<Vehicle> GetVehicleWithDetailsAsync(int vehicleId);
    Task<IEnumerable<Vehicle>> GetVehiclesForComparisonAsync(IEnumerable<int> vehicleIds);
    Task<IEnumerable<VehicleConfig>> GetAvailableConfigsAsync(int vehicleId);
    Task<IEnumerable<Inventory>> GetInventoriesByVehicleAsync(int vehicleId);

    // Ghi chú: Giữ nguyên phương thức cũ.
    Task<IEnumerable<Vehicle>> GetAllAsync();

    // ===================================================================================
    // === PHẦN BỔ SUNG: THÊM HỢP ĐỒNG CHO PHƯƠNG THỨC LẤY DỮ LIỆU CƠ BẢN ===
    Task<IEnumerable<Vehicle>> GetAllBasicAsync();
    // ===================================================================================
}

#region Query DTO
public class VehicleQueryDto
{
    public string? Search { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
}
#endregion