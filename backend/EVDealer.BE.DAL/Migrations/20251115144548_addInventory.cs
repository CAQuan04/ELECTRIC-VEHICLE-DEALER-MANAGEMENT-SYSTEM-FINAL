using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class addInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Inventory",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateOnly>(
                name: "ActualDate",
                table: "Distribution",
                type: "date",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_location_id",
                table: "Inventory",
                column: "location_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventory_Dealer_location_id",
                table: "Inventory",
                column: "location_id",
                principalTable: "Dealer",
                principalColumn: "dealer_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inventory_Dealer_location_id",
                table: "Inventory");

            migrationBuilder.DropIndex(
                name: "IX_Inventory_location_id",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "ActualDate",
                table: "Distribution");
        }
    }
}
