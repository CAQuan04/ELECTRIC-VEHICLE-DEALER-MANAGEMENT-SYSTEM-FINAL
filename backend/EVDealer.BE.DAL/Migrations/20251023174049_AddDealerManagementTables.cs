using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddDealerManagementTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DealerContract",
                columns: table => new
                {
                    contract_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    dealer_id = table.Column<int>(type: "int", nullable: false),
                    start_date = table.Column<DateOnly>(type: "date", nullable: false),
                    end_date = table.Column<DateOnly>(type: "date", nullable: false),
                    terms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DealerContract", x => x.contract_id);
                    table.ForeignKey(
                        name: "FK_DealerContract_Dealer_dealer_id",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DealerTarget",
                columns: table => new
                {
                    target_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    dealer_id = table.Column<int>(type: "int", nullable: false),
                    period_start = table.Column<DateOnly>(type: "date", nullable: false),
                    period_end = table.Column<DateOnly>(type: "date", nullable: false),
                    sales_target = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    actual_sales = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DealerTarget", x => x.target_id);
                    table.ForeignKey(
                        name: "FK_DealerTarget_Dealer_dealer_id",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Debt",
                columns: table => new
                {
                    debt_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    dealer_id = table.Column<int>(type: "int", nullable: false),
                    amount_due = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    due_date = table.Column<DateOnly>(type: "date", nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Debt", x => x.debt_id);
                    table.ForeignKey(
                        name: "FK_Debt_Dealer_dealer_id",
                        column: x => x.dealer_id,
                        principalTable: "Dealer",
                        principalColumn: "dealer_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DealerContract_dealer_id",
                table: "DealerContract",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_DealerTarget_dealer_id",
                table: "DealerTarget",
                column: "dealer_id");

            migrationBuilder.CreateIndex(
                name: "IX_Debt_dealer_id",
                table: "Debt",
                column: "dealer_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DealerContract");

            migrationBuilder.DropTable(
                name: "DealerTarget");

            migrationBuilder.DropTable(
                name: "Debt");
        }
    }
}
