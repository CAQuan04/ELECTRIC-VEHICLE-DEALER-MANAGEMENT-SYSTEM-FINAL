namespace EVDealer.BE.DAL.Models
{
    public class QuotationItem
    {
        public int QuotationId { get; set; }
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public virtual Quotation Quotation { get; set; } = null!;
        public virtual Vehicle Vehicle { get; set; } = null!;
        public virtual VehicleConfig Config { get; set; } = null!;
    }
}