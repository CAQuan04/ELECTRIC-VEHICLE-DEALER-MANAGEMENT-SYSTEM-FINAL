using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Add_ForeignKeys_To_Distribution : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConfigId",
                table: "Distribution",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Distribution_ConfigId",
                table: "Distribution",
                column: "ConfigId");

            migrationBuilder.AddForeignKey(
                name: "FK_Distribution_VehicleConfig_ConfigId",
                table: "Distribution",
                column: "ConfigId",
                principalTable: "VehicleConfig",
                principalColumn: "config_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Distribution_VehicleConfig_ConfigId",
                table: "Distribution");

            migrationBuilder.DropIndex(
                name: "IX_Distribution_ConfigId",
                table: "Distribution");

            migrationBuilder.DropColumn(
                name: "ConfigId",
                table: "Distribution");
        }
    }
}
