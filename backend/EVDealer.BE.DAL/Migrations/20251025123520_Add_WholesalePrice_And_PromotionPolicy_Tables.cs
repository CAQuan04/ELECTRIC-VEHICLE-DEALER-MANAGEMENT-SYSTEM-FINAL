using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Add_WholesalePrice_And_PromotionPolicy_Tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PromotionPolicies",
                columns: table => new
                {
                    policy_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    dealer_id = table.Column<int>(type: "int", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    discount_percent = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    conditions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    start_date = table.Column<DateOnly>(type: "date", nullable: false),
                    end_date = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionPolicies", x => x.policy_id);
                    table.ForeignKey(
                        name: "FK_PromotionPolicies_Dealer_dealer_id",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WholesalePrices",
                columns: table => new
                {
                    price_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    dealer_id = table.Column<int>(type: "int", nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    valid_from = table.Column<DateOnly>(type: "date", nullable: false),
                    valid_to = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WholesalePrices", x => x.price_id);
                    table.ForeignKey(
                        name: "FK_WholesalePrices_Dealer_dealer_id",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id");
                    table.ForeignKey(
                        name: "FK_WholesalePrices_Vehicle_product_id",
                        column: x => x.product_id,
                        principalTable: "Vehicle",
                        principalColumn: "vehicle_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionPolicies_dealer_id",
                table: "PromotionPolicies",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_WholesalePrices_dealer_id",
                table: "WholesalePrices",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_WholesalePrices_product_id",
                table: "WholesalePrices",
                column: "product_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PromotionPolicies");

            migrationBuilder.DropTable(
                name: "WholesalePrices");
        }
    }
}
