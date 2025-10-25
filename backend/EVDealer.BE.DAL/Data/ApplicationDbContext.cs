using System;
using System.Collections.Generic;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace EVDealer.BE.DAL.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Dealer> Dealers { get; set; }

    public virtual DbSet<DemandForecast> DemandForecasts { get; set; }

    public virtual DbSet<Distribution> Distributions { get; set; }

    public virtual DbSet<Inventory> Inventories { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PurchaseRequest> PurchaseRequests { get; set; }

    public virtual DbSet<Quotation> Quotations { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SalesOrder> SalesOrders { get; set; }

    public virtual DbSet<TestDrive> TestDrives { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VehicleConfig> VehicleConfigs { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }
    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<DealerContract> DealerContracts { get; set; }
    public virtual DbSet<DealerTarget> DealerTargets { get; set; }
    public virtual DbSet<Debt> Debts { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__CD65CB851DFCF011");

            entity.ToTable("Customer");

            entity.HasIndex(e => e.IdDocumentNumber, "UQ__Customer__8D0A37D79075E7B9").IsUnique();

            entity.HasIndex(e => e.Phone, "UQ__Customer__B43B145F955C8FF0").IsUnique();

            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.IdDocumentNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("id_document_number");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
        });

        modelBuilder.Entity<Dealer>(entity =>
        {
            entity.HasKey(e => e.DealerId).HasName("PK__Dealer__019990C0196E5CEB");

            entity.ToTable("Dealer");

            entity.Property(e => e.DealerId).HasColumnName("dealer_id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
        });

        modelBuilder.Entity<DemandForecast>(entity =>
        {
            entity.HasKey(e => e.ForecastId).HasName("PK__DemandFo__9E57315448507800");

            entity.ToTable("DemandForecast");

            entity.Property(e => e.ForecastId).HasColumnName("forecast_id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DealerId).HasColumnName("dealer_id");
            entity.Property(e => e.ForecastPeriodEnd).HasColumnName("forecast_period_end");
            entity.Property(e => e.ForecastPeriodStart).HasColumnName("forecast_period_start");
            entity.Property(e => e.PredictedQuantity).HasColumnName("predicted_quantity");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");

            entity.HasOne(d => d.Dealer).WithMany(p => p.DemandForecasts)
                .HasForeignKey(d => d.DealerId)
                .HasConstraintName("FK_DemandForecast_Dealer");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.DemandForecasts)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DemandForecast_Vehicle");
        });

        modelBuilder.Entity<Distribution>(entity =>
        {
            entity.HasKey(e => e.DistId).HasName("PK__Distribu__FBDA893075D5E843");

            entity.ToTable("Distribution");

            entity.Property(e => e.DistId).HasColumnName("dist_id");
            entity.Property(e => e.FromLocation)
                .HasMaxLength(100)
                .HasColumnName("from_location");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.ScheduledDate).HasColumnName("scheduled_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("status");
            entity.Property(e => e.ToDealerId).HasColumnName("to_dealer_id");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");

            entity.HasOne(d => d.ToDealer).WithMany(p => p.Distributions)
                .HasForeignKey(d => d.ToDealerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Distribution_Dealer");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.Distributions)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Distribution_Vehicle");
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.HasKey(e => e.InventoryId).HasName("PK__Inventor__B59ACC49D4996A94");

            entity.ToTable("Inventory");

            entity.Property(e => e.InventoryId).HasColumnName("inventory_id");
            entity.Property(e => e.ConfigId).HasColumnName("config_id");
            entity.Property(e => e.LocationId).HasColumnName("location_id");
            entity.Property(e => e.LocationType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("location_type");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");

            entity.HasOne(d => d.Config).WithMany(p => p.Inventories)
                .HasForeignKey(d => d.ConfigId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inventory_Config");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.Inventories)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inventory_Vehicle");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.VehicleId, e.ConfigId }).HasName("PK__OrderIte__B93AF42AF183E452");

            entity.ToTable("OrderItem");

            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");
            entity.Property(e => e.ConfigId).HasColumnName("config_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.UnitPrice)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("unit_price");

            entity.HasOne(d => d.Config).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ConfigId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItem_Config");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItem_Order");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItem_Vehicle");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__ED1FC9EA068AA6C1");

            entity.ToTable("Payment");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.Method)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("method");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.PaymentDate)
                .HasColumnType("datetime")
                .HasColumnName("payment_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("completed")
                .HasColumnName("status");

            entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Payment_SalesOrder");
        });

        modelBuilder.Entity<PurchaseRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Purchase__18D3B90F9530E59F");

            entity.ToTable("PurchaseRequest");

            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.DealerId).HasColumnName("dealer_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("status");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");

            entity.HasOne(d => d.Dealer).WithMany(p => p.PurchaseRequests)
                .HasForeignKey(d => d.DealerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseRequest_Dealer");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.PurchaseRequests)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseRequest_Vehicle");
        });

        modelBuilder.Entity<Quotation>(entity =>
        {
            entity.HasKey(e => e.QuotationId).HasName("PK__Quotatio__7841D7DBFFBDCCAE");

            entity.ToTable("Quotation");

            entity.Property(e => e.QuotationId).HasColumnName("quotation_id");
            entity.Property(e => e.CreatedByUserId).HasColumnName("created_by_user_id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("draft")
                .HasColumnName("status");
            entity.Property(e => e.TotalAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("total_amount");
            entity.Property(e => e.ValidUntil).HasColumnName("valid_until");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.Quotations)
                .HasForeignKey(d => d.CreatedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Quotation_User");

            entity.HasOne(d => d.Customer).WithMany(p => p.Quotations)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Quotation_Customer");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__760965CCA51E8EB9");

            entity.ToTable("Role");

            entity.HasIndex(e => e.RoleName, "UQ__Role__783254B1C9D2BF80").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<SalesOrder>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__SalesOrd__4659622959728F2E");

            entity.ToTable("SalesOrder");

            entity.HasIndex(e => e.QuotationId, "UQ__SalesOrd__7841D7DAF7943B60").IsUnique();

            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.DealerId).HasColumnName("dealer_id");
            entity.Property(e => e.OrderDate).HasColumnName("order_date");
            entity.Property(e => e.QuotationId).HasColumnName("quotation_id");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("status");
            entity.Property(e => e.TotalAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("total_amount");

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.SalesOrders)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_SalesOrder_Approver");

            entity.HasOne(d => d.Customer).WithMany(p => p.SalesOrders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrder_Customer");

            entity.HasOne(d => d.Dealer).WithMany(p => p.SalesOrders)
                .HasForeignKey(d => d.DealerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrder_Dealer");

            entity.HasOne(d => d.Quotation).WithOne(p => p.SalesOrder)
                .HasForeignKey<SalesOrder>(d => d.QuotationId)
                .HasConstraintName("FK_SalesOrder_Quotation");
        });

        modelBuilder.Entity<TestDrive>(entity =>
        {
            entity.HasKey(e => e.TestId).HasName("PK__TestDriv__F3FF1C027F59B627");

            entity.ToTable("TestDrive");

            entity.Property(e => e.TestId).HasColumnName("test_id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.DealerId).HasColumnName("dealer_id");
            entity.Property(e => e.Feedback).HasColumnName("feedback");
            entity.Property(e => e.ScheduleDatetime)
                .HasColumnType("datetime")
                .HasColumnName("schedule_datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");

            entity.HasOne(d => d.Customer).WithMany(p => p.TestDrives)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TestDrive_Customer");

            entity.HasOne(d => d.Dealer).WithMany(p => p.TestDrives)
                .HasForeignKey(d => d.DealerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TestDrive_Dealer");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.TestDrives)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TestDrive_Vehicle");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__B9BE370FEE195867");

            entity.ToTable("User");

            entity.HasIndex(e => e.Username, "UQ__User__F3DBC57225A4DD70").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.DealerId).HasColumnName("dealer_id");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("active")
                .HasColumnName("status");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("username");

            entity.HasOne(d => d.Dealer).WithMany(p => p.Users)
                .HasForeignKey(d => d.DealerId)
                .HasConstraintName("FK_User_Dealer");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_User_Role");

            entity.HasIndex(e => e.Email, "UQ_User_Email").IsUnique()
                    .HasFilter("[email] IS NOT NULL");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.VehicleId).HasName("PK__Vehicle__F2947BC1502DA419");

            entity.ToTable("Vehicle");

            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");
            entity.Property(e => e.BasePrice)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("base_price");
            entity.Property(e => e.Brand)
                .HasMaxLength(50)
                .HasColumnName("brand");
            entity.Property(e => e.Model)
                .HasMaxLength(100)
                .HasColumnName("model");
            entity.Property(e => e.Year).HasColumnName("year");
            entity.Property(e => e.Status)
           .IsRequired()
           .HasMaxLength(20)
           .IsUnicode(false)
           .HasDefaultValue("Active");
        });

        modelBuilder.Entity<VehicleConfig>(entity =>
        {
            entity.HasKey(e => e.ConfigId).HasName("PK__VehicleC__4AD1BFF16B4B452D");

            entity.ToTable("VehicleConfig");

            entity.Property(e => e.ConfigId).HasColumnName("config_id");
            entity.Property(e => e.BatteryKwh).HasColumnName("battery_kwh");
            entity.Property(e => e.Color)
                .HasMaxLength(50)
                .HasColumnName("color");
            entity.Property(e => e.RangeKm).HasColumnName("range_km");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.VehicleConfigs)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VehicleConfig_Vehicle");
            entity.Property(e => e.Status)
            .IsRequired()
            .HasMaxLength(20)
            .IsUnicode(false)
            .HasDefaultValue("Active");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            // Ghi chú: Dòng này ra lệnh: "Lớp C# 'Permission' phải được ánh xạ vào bảng
            // có tên chính xác là 'Permission' (số ít) trong CSDL."
            // Đây chính là câu lệnh sửa lỗi của bạn.
            entity.ToTable("Permission");

            // Ghi chú: Tool scaffold thường tự nhận diện khóa chính và các thuộc tính,
            // nhưng chúng ta có thể định nghĩa lại cho rõ ràng.
            entity.HasKey(e => e.PermissionId);

            entity.Property(e => e.PermissionId).HasColumnName("PermissionId");
            entity.Property(e => e.PermissionName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PermissionName");

            // Ghi chú: Đảm bảo rằng cột PermissionName là duy nhất (unique),
            // điều này khớp với ràng buộc UNIQUE trong CSDL của bạn.
            entity.HasIndex(e => e.PermissionName).IsUnique();
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            // Ghi chú: Ra lệnh cho EF ánh xạ lớp 'RolePermission' vào bảng 'Role_Permission'.
            // Tên này phải khớp chính xác với tên bảng trong script SQL của bạn.
            entity.ToTable("Role_Permission");

            // Ghi chú: Định nghĩa khóa chính kết hợp (composite primary key) cho bảng trung gian.
            // Điều này khớp với `PRIMARY KEY (RoleId, PermissionId)` trong SQL.
            entity.HasKey(e => new { e.RoleId, e.PermissionId });

            // Ghi chú: Cấu hình các mối quan hệ (relationship).
            // Mặc dù EF có thể tự suy ra, việc định nghĩa rõ ràng sẽ tránh được các lỗi ngầm.

            // Ghi chú: Mối quan hệ "Một Role có nhiều RolePermission".
            entity.HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions) // 'RolePermissions' là thuộc tính collection trong lớp Role.
                .HasForeignKey(rp => rp.RoleId);  // Khóa ngoại là cột RoleId.

            // Ghi chú: Mối quan hệ "Một Permission có nhiều RolePermission".
            entity.HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions) // 'RolePermissions' là thuộc tính collection trong lớp Permission.
                .HasForeignKey(rp => rp.PermissionId); // Khóa ngoại là cột PermissionId.
        });

        // Ghi chú: Dòng này được tool tự sinh ra, giữ lại nó.
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
