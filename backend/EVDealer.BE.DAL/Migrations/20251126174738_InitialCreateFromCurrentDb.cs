using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateFromCurrentDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateTable(
            //    name: "Customer",
            //    columns: table => new
            //    {
            //        customer_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        full_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
            //        phone = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false),
            //        address = table.Column<string>(type: "text", nullable: true),
            //        id_document_number = table.Column<string>(type: "character varying(50)", unicode: false, maxLength: 50, nullable: true),
            //        Email = table.Column<string>(type: "text", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Customer__CD65CB851DFCF011", x => x.customer_id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Permission",
            //    columns: table => new
            //    {
            //        PermissionId = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        PermissionName = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Permission", x => x.PermissionId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Promotion",
            //    columns: table => new
            //    {
            //        promo_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
            //        description = table.Column<string>(type: "text", nullable: true),
            //        discount_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        discount_value = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        start_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        end_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
            //        source = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true, defaultValue: "EVM"),
            //        scope = table.Column<string>(type: "jsonb", nullable: true),
            //        combinable = table.Column<bool>(type: "boolean", nullable: true, defaultValue: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Promotion", x => x.promo_id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Regions",
            //    columns: table => new
            //    {
            //        RegionId = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Regions", x => x.RegionId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Role",
            //    columns: table => new
            //    {
            //        role_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        role_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Role__760965CCA51E8EB9", x => x.role_id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Vehicle",
            //    columns: table => new
            //    {
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        model = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
            //        brand = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        year = table.Column<int>(type: "integer", nullable: true),
            //        base_price = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        ImageUrl = table.Column<string>(type: "nvarchar(MAX)", nullable: true),
            //        Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Active")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Vehicle__F2947BC1502DA419", x => x.vehicle_id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Dealer",
            //    columns: table => new
            //    {
            //        dealer_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
            //        address = table.Column<string>(type: "text", nullable: true),
            //        phone = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: true),
            //        RegionId = table.Column<int>(type: "integer", nullable: true),
            //        SafetyStockLevel = table.Column<int>(type: "integer", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Dealer__019990C0196E5CEB", x => x.dealer_id);
            //        table.ForeignKey(
            //            name: "FK_Dealer_Regions_RegionId",
            //            column: x => x.RegionId,
            //            principalTable: "Regions",
            //            principalColumn: "RegionId");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Role_Permission",
            //    columns: table => new
            //    {
            //        RoleId = table.Column<int>(type: "integer", nullable: false),
            //        PermissionId = table.Column<int>(type: "integer", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Role_Permission", x => new { x.RoleId, x.PermissionId });
            //        table.ForeignKey(
            //            name: "FK_Role_Permission_Permission_PermissionId",
            //            column: x => x.PermissionId,
            //            principalTable: "Permission",
            //            principalColumn: "PermissionId",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_Role_Permission_Role_RoleId",
            //            column: x => x.RoleId,
            //            principalTable: "Role",
            //            principalColumn: "role_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "VehicleConfig",
            //    columns: table => new
            //    {
            //        config_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        color = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
            //        battery_kwh = table.Column<int>(type: "integer", nullable: true),
            //        range_km = table.Column<int>(type: "integer", nullable: true),
            //        Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Active")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__VehicleC__4AD1BFF16B4B452D", x => x.config_id);
            //        table.ForeignKey(
            //            name: "FK_VehicleConfig_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "DealerContract",
            //    columns: table => new
            //    {
            //        contract_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        start_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        end_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        terms = table.Column<string>(type: "text", nullable: true),
            //        status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_DealerContract", x => x.contract_id);
            //        table.ForeignKey(
            //            name: "FK_DealerContract_Dealer_dealer_id",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "DealerTarget",
            //    columns: table => new
            //    {
            //        target_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        period_start = table.Column<DateOnly>(type: "date", nullable: false),
            //        period_end = table.Column<DateOnly>(type: "date", nullable: false),
            //        sales_target = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        actual_sales = table.Column<decimal>(type: "numeric(18,2)", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_DealerTarget", x => x.target_id);
            //        table.ForeignKey(
            //            name: "FK_DealerTarget_Dealer_dealer_id",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Debt",
            //    columns: table => new
            //    {
            //        debt_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        amount_due = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        due_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Debt", x => x.debt_id);
            //        table.ForeignKey(
            //            name: "FK_Debt_Dealer_dealer_id",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "DemandForecast",
            //    columns: table => new
            //    {
            //        forecast_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        dealer_id = table.Column<int>(type: "integer", nullable: true),
            //        forecast_period_start = table.Column<DateOnly>(type: "date", nullable: false),
            //        forecast_period_end = table.Column<DateOnly>(type: "date", nullable: false),
            //        predicted_quantity = table.Column<int>(type: "integer", nullable: false),
            //        created_at = table.Column<DateTime>(type: "datetime", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__DemandFo__9E57315448507800", x => x.forecast_id);
            //        table.ForeignKey(
            //            name: "FK_DemandForecast_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_DemandForecast_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "DistributionSuggestions",
            //    columns: table => new
            //    {
            //        SuggestionId = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        DealerId = table.Column<int>(type: "integer", nullable: false),
            //        VehicleId = table.Column<int>(type: "integer", nullable: false),
            //        SuggestedQuantity = table.Column<int>(type: "integer", nullable: false),
            //        ForecastedDemand = table.Column<int>(type: "integer", nullable: false),
            //        CurrentInventory = table.Column<int>(type: "integer", nullable: false),
            //        SafetyStock = table.Column<int>(type: "integer", nullable: false),
            //        Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_DistributionSuggestions", x => x.SuggestionId);
            //        table.ForeignKey(
            //            name: "FK_DistributionSuggestions_Dealer_DealerId",
            //            column: x => x.DealerId,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_DistributionSuggestions_Vehicle_VehicleId",
            //            column: x => x.VehicleId,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "PromotionPolicies",
            //    columns: table => new
            //    {
            //        policy_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        description = table.Column<string>(type: "text", nullable: false),
            //        discount_percent = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
            //        conditions = table.Column<string>(type: "text", nullable: true),
            //        start_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        end_date = table.Column<DateOnly>(type: "date", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_PromotionPolicies", x => x.policy_id);
            //        table.ForeignKey(
            //            name: "FK_PromotionPolicies_Dealer_dealer_id",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "TestDrive",
            //    columns: table => new
            //    {
            //        test_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        customer_id = table.Column<int>(type: "integer", nullable: false),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        schedule_datetime = table.Column<DateTime>(type: "datetime", nullable: false),
            //        status = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false),
            //        feedback = table.Column<string>(type: "text", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__TestDriv__F3FF1C027F59B627", x => x.test_id);
            //        table.ForeignKey(
            //            name: "FK_TestDrive_Customer",
            //            column: x => x.customer_id,
            //            principalTable: "Customer",
            //            principalColumn: "customer_id");
            //        table.ForeignKey(
            //            name: "FK_TestDrive_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_TestDrive_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "User",
            //    columns: table => new
            //    {
            //        user_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        username = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
            //        password_hash = table.Column<string>(type: "character varying(255)", unicode: false, maxLength: 255, nullable: false),
            //        role_id = table.Column<int>(type: "integer", nullable: false),
            //        dealer_id = table.Column<int>(type: "integer", nullable: true),
            //        status = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "active"),
            //        full_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
            //        email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
            //        phone_number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
            //        date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
            //        created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
            //        updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__User__B9BE370FEE195867", x => x.user_id);
            //        table.ForeignKey(
            //            name: "FK_User_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_User_Role",
            //            column: x => x.role_id,
            //            principalTable: "Role",
            //            principalColumn: "role_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "WholesalePrices",
            //    columns: table => new
            //    {
            //        price_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        product_id = table.Column<int>(type: "integer", nullable: false),
            //        dealer_id = table.Column<int>(type: "integer", nullable: true),
            //        price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        valid_from = table.Column<DateOnly>(type: "date", nullable: false),
            //        valid_to = table.Column<DateOnly>(type: "date", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_WholesalePrices", x => x.price_id);
            //        table.ForeignKey(
            //            name: "FK_WholesalePrices_Dealer_dealer_id",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_WholesalePrices_Vehicle_product_id",
            //            column: x => x.product_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "DealerInventory",
            //    columns: table => new
            //    {
            //        dealer_inventory_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        color = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        quantity = table.Column<int>(type: "integer", nullable: false),
            //        status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Available"),
            //        last_restock_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
            //        last_updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
            //        config_id = table.Column<int>(type: "integer", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_DealerInventory", x => x.dealer_inventory_id);
            //        table.ForeignKey(
            //            name: "FK_DealerInventory_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_DealerInventory_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_DealerInventory_VehicleConfig",
            //            column: x => x.config_id,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Distribution",
            //    columns: table => new
            //    {
            //        dist_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        from_location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
            //        to_dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        ConfigId = table.Column<int>(type: "integer", nullable: false),
            //        quantity = table.Column<int>(type: "integer", nullable: false),
            //        scheduled_date = table.Column<DateOnly>(type: "date", nullable: true),
            //        status = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "pending"),
            //        ActualDate = table.Column<DateOnly>(type: "date", nullable: true),
            //        scheduled_by = table.Column<int>(type: "integer", nullable: true),
            //        dispatcher = table.Column<int>(type: "integer", nullable: true),
            //        delivered_by = table.Column<int>(type: "integer", nullable: true),
            //        created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
            //        updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Distribu__FBDA893075D5E843", x => x.dist_id);
            //        table.ForeignKey(
            //            name: "FK_Distribution_Dealer",
            //            column: x => x.to_dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_Distribution_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //        table.ForeignKey(
            //            name: "FK_Distribution_VehicleConfig_ConfigId",
            //            column: x => x.ConfigId,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Inventory",
            //    columns: table => new
            //    {
            //        inventory_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        config_id = table.Column<int>(type: "integer", nullable: false),
            //        location_type = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false),
            //        location_id = table.Column<int>(type: "integer", nullable: false),
            //        quantity = table.Column<int>(type: "integer", nullable: false),
            //        UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        qty_on_hand = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
            //        qty_on_hold = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Inventor__B59ACC49D4996A94", x => x.inventory_id);
            //        table.ForeignKey(
            //            name: "FK_Inventory_Config",
            //            column: x => x.config_id,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id");
            //        table.ForeignKey(
            //            name: "FK_Inventory_Dealer_location_id",
            //            column: x => x.location_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_Inventory_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Quotation",
            //    columns: table => new
            //    {
            //        quotation_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        customer_id = table.Column<int>(type: "integer", nullable: false),
            //        created_by_user_id = table.Column<int>(type: "integer", nullable: false),
            //        total_amount = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        valid_until = table.Column<DateOnly>(type: "date", nullable: true),
            //        status = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "draft"),
            //        dealer_id = table.Column<int>(type: "integer", nullable: true),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: true),
            //        config_id = table.Column<int>(type: "integer", nullable: true),
            //        payment_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
            //        total_before = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        total_discount = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        total_after = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        onroad_price = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        down_payment_est = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
            //        updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
            //        notes = table.Column<string>(type: "TEXT", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Quotatio__7841D7DBFFBDCCAE", x => x.quotation_id);
            //        table.ForeignKey(
            //            name: "FK_Quotation_Config",
            //            column: x => x.config_id,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id");
            //        table.ForeignKey(
            //            name: "FK_Quotation_Customer",
            //            column: x => x.customer_id,
            //            principalTable: "Customer",
            //            principalColumn: "customer_id");
            //        table.ForeignKey(
            //            name: "FK_Quotation_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_Quotation_User",
            //            column: x => x.created_by_user_id,
            //            principalTable: "User",
            //            principalColumn: "user_id");
            //        table.ForeignKey(
            //            name: "FK_Quotation_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "StockRequest",
            //    columns: table => new
            //    {
            //        stock_request_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        config_id = table.Column<int>(type: "integer", nullable: true),
            //        quantity = table.Column<int>(type: "integer", nullable: false),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        requested_by_user_id = table.Column<int>(type: "integer", nullable: false),
            //        request_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
            //        priority = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Normal"),
            //        status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Pending"),
            //        reason = table.Column<string>(type: "nvarchar(500)", nullable: false),
            //        notes = table.Column<string>(type: "nvarchar(MAX)", nullable: true),
            //        rejection_reason = table.Column<string>(type: "nvarchar(500)", nullable: true),
            //        processed_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
            //        processed_by_user_id = table.Column<int>(type: "integer", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_StockRequest", x => x.stock_request_id);
            //        table.ForeignKey(
            //            name: "FK_StockRequest_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_StockRequest_ProcessedByUser",
            //            column: x => x.processed_by_user_id,
            //            principalTable: "User",
            //            principalColumn: "user_id",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_StockRequest_RequestedByUser",
            //            column: x => x.requested_by_user_id,
            //            principalTable: "User",
            //            principalColumn: "user_id",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_StockRequest_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_StockRequest_VehicleConfig",
            //            column: x => x.config_id,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "QuotationItem",
            //    columns: table => new
            //    {
            //        quotation_id = table.Column<int>(type: "integer", nullable: false),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        config_id = table.Column<int>(type: "integer", nullable: false),
            //        quantity = table.Column<int>(type: "integer", nullable: false),
            //        unit_price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        total_price = table.Column<decimal>(type: "numeric(18,2)", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_QuotationItem", x => new { x.quotation_id, x.vehicle_id, x.config_id });
            //        table.ForeignKey(
            //            name: "FK_QuotationItem_Config",
            //            column: x => x.config_id,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id");
            //        table.ForeignKey(
            //            name: "FK_QuotationItem_Quotation",
            //            column: x => x.quotation_id,
            //            principalTable: "Quotation",
            //            principalColumn: "quotation_id");
            //        table.ForeignKey(
            //            name: "FK_QuotationItem_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "QuotationPromotion",
            //    columns: table => new
            //    {
            //        quotation_id = table.Column<int>(type: "integer", nullable: false),
            //        promo_id = table.Column<int>(type: "integer", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_QuotationPromotion", x => new { x.quotation_id, x.promo_id });
            //        table.ForeignKey(
            //            name: "FK_QuotationPromotion_Promotion",
            //            column: x => x.promo_id,
            //            principalTable: "Promotion",
            //            principalColumn: "promo_id",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_QuotationPromotion_Quotation",
            //            column: x => x.quotation_id,
            //            principalTable: "Quotation",
            //            principalColumn: "quotation_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "SalesOrder",
            //    columns: table => new
            //    {
            //        order_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        quotation_id = table.Column<int>(type: "integer", nullable: true),
            //        customer_id = table.Column<int>(type: "integer", nullable: false),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        total_amount = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        order_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        status = table.Column<string>(type: "character varying(30)", unicode: false, maxLength: 30, nullable: false, defaultValue: "pending"),
            //        approved_by = table.Column<int>(type: "integer", nullable: true),
            //        approval_note = table.Column<string>(type: "TEXT", nullable: true),
            //        approved_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
            //        order_total_before = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        order_total_discount = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        order_total_after = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
            //        created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__SalesOrd__4659622959728F2E", x => x.order_id);
            //        table.ForeignKey(
            //            name: "FK_SalesOrder_Approver",
            //            column: x => x.approved_by,
            //            principalTable: "User",
            //            principalColumn: "user_id");
            //        table.ForeignKey(
            //            name: "FK_SalesOrder_Customer",
            //            column: x => x.customer_id,
            //            principalTable: "Customer",
            //            principalColumn: "customer_id");
            //        table.ForeignKey(
            //            name: "FK_SalesOrder_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_SalesOrder_Quotation",
            //            column: x => x.quotation_id,
            //            principalTable: "Quotation",
            //            principalColumn: "quotation_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Contract",
            //    columns: table => new
            //    {
            //        contract_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        order_id = table.Column<int>(type: "integer", nullable: false),
            //        contract_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        terms = table.Column<string>(type: "TEXT", nullable: false),
            //        status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Contract", x => x.contract_id);
            //        table.ForeignKey(
            //            name: "FK_Contract_SalesOrder",
            //            column: x => x.order_id,
            //            principalTable: "SalesOrder",
            //            principalColumn: "order_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Delivery",
            //    columns: table => new
            //    {
            //        delivery_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        order_id = table.Column<int>(type: "integer", nullable: false),
            //        status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        scheduled_date = table.Column<DateOnly>(type: "date", nullable: false),
            //        actual_date = table.Column<DateOnly>(type: "date", nullable: true),
            //        tracking_no = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
            //        carrier_info = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Delivery", x => x.delivery_id);
            //        table.ForeignKey(
            //            name: "FK_Delivery_SalesOrder",
            //            column: x => x.order_id,
            //            principalTable: "SalesOrder",
            //            principalColumn: "order_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "OrderItem",
            //    columns: table => new
            //    {
            //        order_id = table.Column<int>(type: "integer", nullable: false),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        config_id = table.Column<int>(type: "integer", nullable: false),
            //        quantity = table.Column<int>(type: "integer", nullable: false),
            //        unit_price = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__OrderIte__B93AF42AF183E452", x => new { x.order_id, x.vehicle_id, x.config_id });
            //        table.ForeignKey(
            //            name: "FK_OrderItem_Config",
            //            column: x => x.config_id,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id");
            //        table.ForeignKey(
            //            name: "FK_OrderItem_Order",
            //            column: x => x.order_id,
            //            principalTable: "SalesOrder",
            //            principalColumn: "order_id");
            //        table.ForeignKey(
            //            name: "FK_OrderItem_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "OrderPromotion",
            //    columns: table => new
            //    {
            //        OrderId = table.Column<int>(type: "integer", nullable: false),
            //        PromotionId = table.Column<int>(type: "integer", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_OrderPromotion", x => new { x.OrderId, x.PromotionId });
            //        table.ForeignKey(
            //            name: "FK_OrderPromotion_Order",
            //            column: x => x.OrderId,
            //            principalTable: "SalesOrder",
            //            principalColumn: "order_id",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_OrderPromotion_Promotion",
            //            column: x => x.PromotionId,
            //            principalTable: "Promotion",
            //            principalColumn: "promo_id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Payment",
            //    columns: table => new
            //    {
            //        payment_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        order_id = table.Column<int>(type: "integer", nullable: false),
            //        amount = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
            //        method = table.Column<string>(type: "character varying(50)", unicode: false, maxLength: 50, nullable: false),
            //        payment_date = table.Column<DateTime>(type: "datetime", nullable: false),
            //        status = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "completed")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Payment__ED1FC9EA068AA6C1", x => x.payment_id);
            //        table.ForeignKey(
            //            name: "FK_Payment_SalesOrder",
            //            column: x => x.order_id,
            //            principalTable: "SalesOrder",
            //            principalColumn: "order_id");
            //    });

            //migrationBuilder.CreateTable(
            //    name: "PurchaseRequest",
            //    columns: table => new
            //    {
            //        request_id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        dealer_id = table.Column<int>(type: "integer", nullable: false),
            //        vehicle_id = table.Column<int>(type: "integer", nullable: false),
            //        config_id = table.Column<int>(type: "integer", nullable: false),
            //        quantity = table.Column<int>(type: "integer", nullable: false),
            //        status = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "pending"),
            //        created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "GETDATE()"),
            //        notes = table.Column<string>(type: "nvarchar(MAX)", nullable: true),
            //        order_id = table.Column<int>(type: "integer", nullable: true),
            //        remaining_qty = table.Column<int>(type: "integer", nullable: true, defaultValue: 0)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK__Purchase__18D3B90F9530E59F", x => x.request_id);
            //        table.ForeignKey(
            //            name: "FK_PurchaseRequest_Config",
            //            column: x => x.config_id,
            //            principalTable: "VehicleConfig",
            //            principalColumn: "config_id");
            //        table.ForeignKey(
            //            name: "FK_PurchaseRequest_Dealer",
            //            column: x => x.dealer_id,
            //            principalTable: "Dealer",
            //            principalColumn: "dealer_id");
            //        table.ForeignKey(
            //            name: "FK_PurchaseRequest_Order",
            //            column: x => x.order_id,
            //            principalTable: "SalesOrder",
            //            principalColumn: "order_id");
            //        table.ForeignKey(
            //            name: "FK_PurchaseRequest_Vehicle",
            //            column: x => x.vehicle_id,
            //            principalTable: "Vehicle",
            //            principalColumn: "vehicle_id");
            //    });

            //migrationBuilder.CreateIndex(
            //    name: "IX_Contract_order_id",
            //    table: "Contract",
            //    column: "order_id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "UQ__Customer__8D0A37D79075E7B9",
            //    table: "Customer",
            //    column: "id_document_number",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "UQ__Customer__B43B145F955C8FF0",
            //    table: "Customer",
            //    column: "phone",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Dealer_RegionId",
            //    table: "Dealer",
            //    column: "RegionId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DealerContract_dealer_id",
            //    table: "DealerContract",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DealerInventory_config_id",
            //    table: "DealerInventory",
            //    column: "config_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DealerInventory_dealer_id",
            //    table: "DealerInventory",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DealerInventory_vehicle_id",
            //    table: "DealerInventory",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DealerTarget_dealer_id",
            //    table: "DealerTarget",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Debt_dealer_id",
            //    table: "Debt",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Delivery_order_id",
            //    table: "Delivery",
            //    column: "order_id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_DemandForecast_dealer_id",
            //    table: "DemandForecast",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DemandForecast_vehicle_id",
            //    table: "DemandForecast",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Distribution_ConfigId",
            //    table: "Distribution",
            //    column: "ConfigId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Distribution_to_dealer_id",
            //    table: "Distribution",
            //    column: "to_dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Distribution_vehicle_id",
            //    table: "Distribution",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DistributionSuggestions_DealerId",
            //    table: "DistributionSuggestions",
            //    column: "DealerId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DistributionSuggestions_VehicleId",
            //    table: "DistributionSuggestions",
            //    column: "VehicleId");

            //migrationBuilder.CreateIndex(
            //    name: "idx_inventory_location_vehicle_config",
            //    table: "Inventory",
            //    columns: new[] { "location_type", "location_id", "vehicle_id", "config_id" },
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Inventory_config_id",
            //    table: "Inventory",
            //    column: "config_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Inventory_location_id",
            //    table: "Inventory",
            //    column: "location_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Inventory_vehicle_id",
            //    table: "Inventory",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_OrderItem_config_id",
            //    table: "OrderItem",
            //    column: "config_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_OrderItem_vehicle_id",
            //    table: "OrderItem",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_OrderPromotion_PromotionId",
            //    table: "OrderPromotion",
            //    column: "PromotionId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Payment_order_id",
            //    table: "Payment",
            //    column: "order_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Permission_PermissionName",
            //    table: "Permission",
            //    column: "PermissionName",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_PromotionPolicies_dealer_id",
            //    table: "PromotionPolicies",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_PurchaseRequest_config_id",
            //    table: "PurchaseRequest",
            //    column: "config_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_PurchaseRequest_dealer_id",
            //    table: "PurchaseRequest",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_PurchaseRequest_order_id",
            //    table: "PurchaseRequest",
            //    column: "order_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_PurchaseRequest_vehicle_id",
            //    table: "PurchaseRequest",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Quotation_config_id",
            //    table: "Quotation",
            //    column: "config_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Quotation_created_by_user_id",
            //    table: "Quotation",
            //    column: "created_by_user_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Quotation_customer_id",
            //    table: "Quotation",
            //    column: "customer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Quotation_dealer_id",
            //    table: "Quotation",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Quotation_vehicle_id",
            //    table: "Quotation",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_QuotationItem_config_id",
            //    table: "QuotationItem",
            //    column: "config_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_QuotationItem_vehicle_id",
            //    table: "QuotationItem",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_QuotationPromotion_promo_id",
            //    table: "QuotationPromotion",
            //    column: "promo_id");

            //migrationBuilder.CreateIndex(
            //    name: "UQ__Role__783254B1C9D2BF80",
            //    table: "Role",
            //    column: "role_name",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Role_Permission_PermissionId",
            //    table: "Role_Permission",
            //    column: "PermissionId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_SalesOrder_approved_by",
            //    table: "SalesOrder",
            //    column: "approved_by");

            //migrationBuilder.CreateIndex(
            //    name: "IX_SalesOrder_customer_id",
            //    table: "SalesOrder",
            //    column: "customer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_SalesOrder_dealer_id",
            //    table: "SalesOrder",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "UQ__SalesOrd__7841D7DAF7943B60",
            //    table: "SalesOrder",
            //    column: "quotation_id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_StockRequest_config_id",
            //    table: "StockRequest",
            //    column: "config_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_StockRequest_dealer_id",
            //    table: "StockRequest",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_StockRequest_processed_by_user_id",
            //    table: "StockRequest",
            //    column: "processed_by_user_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_StockRequest_requested_by_user_id",
            //    table: "StockRequest",
            //    column: "requested_by_user_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_StockRequest_vehicle_id",
            //    table: "StockRequest",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_TestDrive_customer_id",
            //    table: "TestDrive",
            //    column: "customer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_TestDrive_dealer_id",
            //    table: "TestDrive",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_TestDrive_vehicle_id",
            //    table: "TestDrive",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_User_dealer_id",
            //    table: "User",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_User_role_id",
            //    table: "User",
            //    column: "role_id");

            //migrationBuilder.CreateIndex(
            //    name: "UQ__User__F3DBC57225A4DD70",
            //    table: "User",
            //    column: "username",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "UQ_User_Email",
            //    table: "User",
            //    column: "email",
            //    unique: true,
            //    filter: "[email] IS NOT NULL");

            //migrationBuilder.CreateIndex(
            //    name: "IX_VehicleConfig_vehicle_id",
            //    table: "VehicleConfig",
            //    column: "vehicle_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_WholesalePrices_dealer_id",
            //    table: "WholesalePrices",
            //    column: "dealer_id");

            //migrationBuilder.CreateIndex(
            //    name: "IX_WholesalePrices_product_id",
            //    table: "WholesalePrices",
            //    column: "product_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "Contract");

            //migrationBuilder.DropTable(
            //    name: "DealerContract");

            //migrationBuilder.DropTable(
            //    name: "DealerInventory");

            //migrationBuilder.DropTable(
            //    name: "DealerTarget");

            //migrationBuilder.DropTable(
            //    name: "Debt");

            //migrationBuilder.DropTable(
            //    name: "Delivery");

            //migrationBuilder.DropTable(
            //    name: "DemandForecast");

            //migrationBuilder.DropTable(
            //    name: "Distribution");

            //migrationBuilder.DropTable(
            //    name: "DistributionSuggestions");

            //migrationBuilder.DropTable(
            //    name: "Inventory");

            //migrationBuilder.DropTable(
            //    name: "OrderItem");

            //migrationBuilder.DropTable(
            //    name: "OrderPromotion");

            //migrationBuilder.DropTable(
            //    name: "Payment");

            //migrationBuilder.DropTable(
            //    name: "PromotionPolicies");

            //migrationBuilder.DropTable(
            //    name: "PurchaseRequest");

            //migrationBuilder.DropTable(
            //    name: "QuotationItem");

            //migrationBuilder.DropTable(
            //    name: "QuotationPromotion");

            //migrationBuilder.DropTable(
            //    name: "Role_Permission");

            //migrationBuilder.DropTable(
            //    name: "StockRequest");

            //migrationBuilder.DropTable(
            //    name: "TestDrive");

            //migrationBuilder.DropTable(
            //    name: "WholesalePrices");

            //migrationBuilder.DropTable(
            //    name: "SalesOrder");

            //migrationBuilder.DropTable(
            //    name: "Promotion");

            //migrationBuilder.DropTable(
            //    name: "Permission");

            //migrationBuilder.DropTable(
            //    name: "Quotation");

            //migrationBuilder.DropTable(
            //    name: "VehicleConfig");

            //migrationBuilder.DropTable(
            //    name: "Customer");

            //migrationBuilder.DropTable(
            //    name: "User");

            //migrationBuilder.DropTable(
            //    name: "Vehicle");

            //migrationBuilder.DropTable(
            //    name: "Dealer");

            //migrationBuilder.DropTable(
            //    name: "Role");

            //migrationBuilder.DropTable(
            //    name: "Regions");
        }
    }
}
