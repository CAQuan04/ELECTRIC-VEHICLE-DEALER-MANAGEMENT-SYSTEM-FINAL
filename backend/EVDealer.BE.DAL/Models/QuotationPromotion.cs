using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models;

[Table("QuotationPromotion")]
public class QuotationPromotion
{
    [Key, Column(Order = 0)]
    public int QuotationId { get; set; }

    [Key, Column(Order = 1)]
    public int PromotionId { get; set; }

    public virtual Quotation Quotation { get; set; } = null!;
    public virtual Promotion Promotion { get; set; } = null!;
}