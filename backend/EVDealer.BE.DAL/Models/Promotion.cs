using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Promotion
{
    public int PromotionId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = null!; 
    public decimal DiscountValue { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Status { get; set; } = "Inactive"; 
    public virtual ICollection<OrderPromotion> OrderPromotions { get; set; } = new List<OrderPromotion>();
}