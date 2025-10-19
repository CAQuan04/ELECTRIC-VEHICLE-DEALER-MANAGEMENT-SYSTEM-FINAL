namespace EVDealer.BE.DAL.Models;

public partial class Inventory
{
    public int InventoryId { get; set; }

    public int VehicleId { get; set; }

    public int ConfigId { get; set; }

    public string LocationType { get; set; } = null!;

    public int LocationId { get; set; }

    public int Quantity { get; set; }

    public virtual VehicleConfig Config { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
}

#region Seed Query
//INSERT INTO[Inventory] (vehicle_id, config_id, location_type, location_id, quantity)
//VALUES
//(1, 1, 'Dealer', 1, 3),
//(1, 2, 'Dealer', 1, 2),
//(2, 3, 'Dealer', 2, 5),
//(2, 4, 'Dealer', 2, 3),
//(3, 5, 'Dealer', 3, 4),
//(4, 6, 'Dealer', 4, 2),
//(5, 7, 'Dealer', 4, 3),
//(6, 8, 'Dealer', 5, 1),
//(7, 9, 'Dealer', 6, 6),
//(8, 10, 'Dealer', 7, 2),
//(9, 11, 'Dealer', 8, 7),
//(9, 12, 'Dealer', 8, 5),
//(10, 13, 'Dealer', 9, 1),
//(10, 14, 'Dealer', 9, 2),
//(5, 15, 'Dealer', 10, 4);

#endregion