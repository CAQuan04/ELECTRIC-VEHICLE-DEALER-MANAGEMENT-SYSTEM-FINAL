using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddRegionTableAndRelationToDealer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RegionId",
                table: "Dealer",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Regions",
                columns: table => new
                {
                    RegionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.RegionId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dealer_RegionId",
                table: "Dealer",
                column: "RegionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dealer_Regions_RegionId",
                table: "Dealer",
                column: "RegionId",
                principalTable: "Regions",
                principalColumn: "RegionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dealer_Regions_RegionId",
                table: "Dealer");

            migrationBuilder.DropTable(
                name: "Regions");

            migrationBuilder.DropIndex(
                name: "IX_Dealer_RegionId",
                table: "Dealer");

            migrationBuilder.DropColumn(
                name: "RegionId",
                table: "Dealer");
        }
    }
}
