using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddContractFileUrlToDealerContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Customer");

            migrationBuilder.AddColumn<string>(
                name: "contract_file_url",
                table: "DealerContract",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "contract_file_url",
                table: "DealerContract");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Customer",
                type: "text",
                nullable: true);
        }
    }
}
