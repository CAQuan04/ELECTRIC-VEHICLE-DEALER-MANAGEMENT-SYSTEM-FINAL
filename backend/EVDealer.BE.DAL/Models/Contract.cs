using System;

namespace EVDealer.BE.DAL.Models;

public partial class Contract
{
    public int ContractId { get; set; }
    public int OrderId { get; set; }
    public DateTime ContractDate { get; set; }
    public string Terms { get; set; } = null!;
    public string Status { get; set; } = null!;
    public virtual SalesOrder Order { get; set; } = null!;
}