using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusForSoftDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    customer_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    full_name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    phone = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    id_document_number = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__CD65CB851DFCF011", x => x.customer_id);
                });

            migrationBuilder.CreateTable(
                name: "Dealer",
                columns: table => new
                {
                    dealer_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phone = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Dealer__019990C0196E5CEB", x => x.dealer_id);
                });

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    PermissionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PermissionName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.PermissionId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    role_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    role_name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Role__760965CCA51E8EB9", x => x.role_id);
                });

            migrationBuilder.CreateTable(
                name: "Vehicle",
                columns: table => new
                {
                    vehicle_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    model = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    brand = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    year = table.Column<int>(type: "int", nullable: true),
                    base_price = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Vehicle__F2947BC1502DA419", x => x.vehicle_id);
                });

            migrationBuilder.CreateTable(
                name: "Role_Permission",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    PermissionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role_Permission", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_Role_Permission_Permission_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permission",
                        principalColumn: "PermissionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Role_Permission_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "role_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    username = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    password_hash = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    role_id = table.Column<int>(type: "int", nullable: false),
                    dealer_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "active")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User__B9BE370FEE195867", x => x.user_id);
                    table.ForeignKey(
                        name: "FK_User_Dealer",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id");
                    table.ForeignKey(
                        name: "FK_User_Role",
                        column: x => x.role_id,
                        principalTable: "Role",
                        principalColumn: "role_id");
                });

            migrationBuilder.CreateTable(
                name: "DemandForecast",
                columns: table => new
                {
                    forecast_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    vehicle_id = table.Column<int>(type: "int", nullable: false),
                    dealer_id = table.Column<int>(type: "int", nullable: true),
                    forecast_period_start = table.Column<DateOnly>(type: "date", nullable: false),
                    forecast_period_end = table.Column<DateOnly>(type: "date", nullable: false),
                    predicted_quantity = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DemandFo__9E57315448507800", x => x.forecast_id);
                    table.ForeignKey(
                        name: "FK_DemandForecast_Dealer",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id");
                    table.ForeignKey(
                        name: "FK_DemandForecast_Vehicle",
                        column: x => x.vehicle_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id");
                });

            migrationBuilder.CreateTable(
                name: "Distribution",
                columns: table => new
                {
                    dist_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    from_location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    to_dealer_id = table.Column<int>(type: "int", nullable: false),
                    vehicle_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    scheduled_date = table.Column<DateOnly>(type: "date", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "pending")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Distribu__FBDA893075D5E843", x => x.dist_id);
                    table.ForeignKey(
                        name: "FK_Distribution_Dealer",
                        column: x => x.to_dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id");
                    table.ForeignKey(
                        name: "FK_Distribution_Vehicle",
                        column: x => x.vehicle_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id");
                });

            migrationBuilder.CreateTable(
                name: "PurchaseRequest",
                columns: table => new
                {
                    request_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    dealer_id = table.Column<int>(type: "int", nullable: false),
                    vehicle_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "pending")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Purchase__18D3B90F9530E59F", x => x.request_id);
                    table.ForeignKey(
                        name: "FK_PurchaseRequest_Dealer",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id");
                    table.ForeignKey(
                        name: "FK_PurchaseRequest_Vehicle",
                        column: x => x.vehicle_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id");
                });

            migrationBuilder.CreateTable(
                name: "TestDrive",
                columns: table => new
                {
                    test_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customer_id = table.Column<int>(type: "int", nullable: false),
                    vehicle_id = table.Column<int>(type: "int", nullable: false),
                    dealer_id = table.Column<int>(type: "int", nullable: false),
                    schedule_datetime = table.Column<DateTime>(type: "datetime", nullable: false),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    feedback = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestDriv__F3FF1C027F59B627", x => x.test_id);
                    table.ForeignKey(
                        name: "FK_TestDrive_Customer",
                        column: x => x.customer_id,
                        principalTable: "Customer",
                        principalColumn: "customer_id");
                    table.ForeignKey(
                        name: "FK_TestDrive_Dealer",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id");
                    table.ForeignKey(
                        name: "FK_TestDrive_Vehicle",
                        column: x => x.vehicle_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id");
                });

            migrationBuilder.CreateTable(
                name: "VehicleConfig",
                columns: table => new
                {
                    config_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    vehicle_id = table.Column<int>(type: "int", nullable: false),
                    color = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    battery_kwh = table.Column<int>(type: "int", nullable: true),
                    range_km = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__VehicleC__4AD1BFF16B4B452D", x => x.config_id);
                    table.ForeignKey(
                        name: "FK_VehicleConfig_Vehicle",
                        column: x => x.vehicle_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id");
                });

            migrationBuilder.CreateTable(
                name: "Quotation",
                columns: table => new
                {
                    quotation_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customer_id = table.Column<int>(type: "int", nullable: false),
                    created_by_user_id = table.Column<int>(type: "int", nullable: false),
                    total_amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    valid_until = table.Column<DateOnly>(type: "date", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "draft")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Quotatio__7841D7DBFFBDCCAE", x => x.quotation_id);
                    table.ForeignKey(
                        name: "FK_Quotation_Customer",
                        column: x => x.customer_id,
                        principalTable: "Customer",
                        principalColumn: "customer_id");
                    table.ForeignKey(
                        name: "FK_Quotation_User",
                        column: x => x.created_by_user_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "Inventory",
                columns: table => new
                {
                    inventory_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    vehicle_id = table.Column<int>(type: "int", nullable: false),
                    config_id = table.Column<int>(type: "int", nullable: false),
                    location_type = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    location_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Inventor__B59ACC49D4996A94", x => x.inventory_id);
                    table.ForeignKey(
                        name: "FK_Inventory_Config",
                        column: x => x.config_id,
                        principalTable: "VehicleConfig",
                        principalColumn: "config_id");
                    table.ForeignKey(
                        name: "FK_Inventory_Vehicle",
                        column: x => x.vehicle_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id");
                });

            migrationBuilder.CreateTable(
                name: "SalesOrder",
                columns: table => new
                {
                    order_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    quotation_id = table.Column<int>(type: "int", nullable: true),
                    customer_id = table.Column<int>(type: "int", nullable: false),
                    dealer_id = table.Column<int>(type: "int", nullable: false),
                    total_amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    order_date = table.Column<DateOnly>(type: "date", nullable: false),
                    status = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false, defaultValue: "pending"),
                    approved_by = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SalesOrd__4659622959728F2E", x => x.order_id);
                    table.ForeignKey(
                        name: "FK_SalesOrder_Approver",
                        column: x => x.approved_by,
                        principalTable: "User",
                        principalColumn: "user_id");
                    table.ForeignKey(
                        name: "FK_SalesOrder_Customer",
                        column: x => x.customer_id,
                        principalTable: "Customer",
                        principalColumn: "customer_id");
                    table.ForeignKey(
                        name: "FK_SalesOrder_Dealer",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id");
                    table.ForeignKey(
                        name: "FK_SalesOrder_Quotation",
                        column: x => x.quotation_id,
                        principalTable: "Quotation",
                        principalColumn: "quotation_id");
                });

            migrationBuilder.CreateTable(
                name: "OrderItem",
                columns: table => new
                {
                    order_id = table.Column<int>(type: "int", nullable: false),
                    vehicle_id = table.Column<int>(type: "int", nullable: false),
                    config_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    unit_price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderIte__B93AF42AF183E452", x => new { x.order_id, x.vehicle_id, x.config_id });
                    table.ForeignKey(
                        name: "FK_OrderItem_Config",
                        column: x => x.config_id,
                        principalTable: "VehicleConfig",
                        principalColumn: "config_id");
                    table.ForeignKey(
                        name: "FK_OrderItem_Order",
                        column: x => x.order_id,
                        principalTable: "SalesOrder",
                        principalColumn: "order_id");
                    table.ForeignKey(
                        name: "FK_OrderItem_Vehicle",
                        column: x => x.vehicle_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id");
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    payment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    order_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    method = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    payment_date = table.Column<DateTime>(type: "datetime", nullable: false),
                    status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "completed")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payment__ED1FC9EA068AA6C1", x => x.payment_id);
                    table.ForeignKey(
                        name: "FK_Payment_SalesOrder",
                        column: x => x.order_id,
                        principalTable: "SalesOrder",
                        principalColumn: "order_id");
                });

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__8D0A37D79075E7B9",
                table: "Customer",
                column: "id_document_number",
                unique: true,
                filter: "[id_document_number] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__B43B145F955C8FF0",
                table: "Customer",
                column: "phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DemandForecast_dealer_id",
                table: "DemandForecast",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_DemandForecast_vehicle_id",
                table: "DemandForecast",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_Distribution_to_dealer_id",
                table: "Distribution",
                column: "to_dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_Distribution_vehicle_id",
                table: "Distribution",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_config_id",
                table: "Inventory",
                column: "config_id");

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_vehicle_id",
                table: "Inventory",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_config_id",
                table: "OrderItem",
                column: "config_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_vehicle_id",
                table: "OrderItem",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_order_id",
                table: "Payment",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_Permission_PermissionName",
                table: "Permission",
                column: "PermissionName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseRequest_dealer_id",
                table: "PurchaseRequest",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseRequest_vehicle_id",
                table: "PurchaseRequest",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_Quotation_created_by_user_id",
                table: "Quotation",
                column: "created_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Quotation_customer_id",
                table: "Quotation",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "UQ__Role__783254B1C9D2BF80",
                table: "Role",
                column: "role_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Role_Permission_PermissionId",
                table: "Role_Permission",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrder_approved_by",
                table: "SalesOrder",
                column: "approved_by");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrder_customer_id",
                table: "SalesOrder",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrder_dealer_id",
                table: "SalesOrder",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "UQ__SalesOrd__7841D7DAF7943B60",
                table: "SalesOrder",
                column: "quotation_id",
                unique: true,
                filter: "[quotation_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TestDrive_customer_id",
                table: "TestDrive",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "IX_TestDrive_dealer_id",
                table: "TestDrive",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_TestDrive_vehicle_id",
                table: "TestDrive",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_User_dealer_id",
                table: "User",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_User_role_id",
                table: "User",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "UQ__User__F3DBC57225A4DD70",
                table: "User",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VehicleConfig_vehicle_id",
                table: "VehicleConfig",
                column: "vehicle_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DemandForecast");

            migrationBuilder.DropTable(
                name: "Distribution");

            migrationBuilder.DropTable(
                name: "Inventory");

            migrationBuilder.DropTable(
                name: "OrderItem");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "PurchaseRequest");

            migrationBuilder.DropTable(
                name: "Role_Permission");

            migrationBuilder.DropTable(
                name: "TestDrive");

            migrationBuilder.DropTable(
                name: "VehicleConfig");

            migrationBuilder.DropTable(
                name: "SalesOrder");

            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "Vehicle");

            migrationBuilder.DropTable(
                name: "Quotation");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Dealer");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
