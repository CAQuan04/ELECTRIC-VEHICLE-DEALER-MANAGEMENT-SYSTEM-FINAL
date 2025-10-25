using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int RoleId { get; set; }

    public int? DealerId { get; set; }

    public string Status { get; set; } = null!;

    public virtual Dealer? Dealer { get; set; }

    public virtual ICollection<Quotation> Quotations { get; set; } = new List<Quotation>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();

    [StringLength(150)]
    [Column("full_name")] // Đặt tên cột trong CSDL
    public string? FullName { get; set; } // Dùng string? để cho phép giá trị NULL

    [StringLength(150)]
    [Column("email")]
    public string? Email { get; set; }

    [StringLength(20)]
    [Column("phone_number")]
    public string? PhoneNumber { get; set; }

    [Column("date_of_birth", TypeName = "date")] // Chỉ định rõ kiểu dữ liệu là DATE
    public DateOnly? DateOfBirth { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}
