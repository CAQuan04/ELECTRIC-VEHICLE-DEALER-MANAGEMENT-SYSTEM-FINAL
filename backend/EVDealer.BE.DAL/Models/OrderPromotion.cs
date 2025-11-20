namespace EVDealer.BE.DAL.Models
{
    public class OrderPromotion
    {
        public int OrderId { get; set; }
        public int PromotionId { get; set; }

        public virtual SalesOrder Order { get; set; } = null!;
        public virtual Promotion Promotion { get; set; } = null!;
    }
}