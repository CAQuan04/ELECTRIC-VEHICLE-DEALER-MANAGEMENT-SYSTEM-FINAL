using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToVehicle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Vehicle",
                type: "nvarchar(MAX)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Vehicle");
        }
    }
}
