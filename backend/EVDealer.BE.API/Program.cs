// Ghi chú: File khởi động, là "tổng đài" kết nối tất cả các dịch vụ của ứng dụng.

// --- Import các namespace cần thiết ---
using EVDealer.BE.API.Helpers;
using EVDealer.BE.API.Validators;
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.Admin;
using EVDealer.BE.Services.AI;
using EVDealer.BE.Services.Analytics;
using EVDealer.BE.Services.Auth;
using EVDealer.BE.Services.Customers;
using EVDealer.BE.Services.DealerManagement;
using EVDealer.BE.Services.Dealers;
using EVDealer.BE.Services.Deliveries;
using EVDealer.BE.Services.IInventory;
using EVDealer.BE.Services.Orders;
using EVDealer.BE.Services.Planning;
using EVDealer.BE.Services.Pricing;
using EVDealer.BE.Services.Procurement;
using EVDealer.BE.Services.Promotions;
using EVDealer.BE.Services.Quotations;
using EVDealer.BE.Services.TestDrives;
using EVDealer.BE.Services.Users;
using EVDealer.BE.Services.Vehicles;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.PostgreSql; // <--- THAY ĐỔI: Thêm namespace này
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// === 1. CẤU HÌNH CÁC DỊCH VỤ (SERVICE CONFIGURATION) ===

// <--- THAY ĐỔI: Fix lỗi ngày tháng cho PostgreSQL (BẮT BUỘC)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// <--- THAY ĐỔI: Dùng UseNpgsql thay vì UseSqlServer
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

// Ghi chú: Cấu hình CORS.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
    });
});

// ===================================================================================
// === PHẦN GIỮ NGUYÊN: ĐĂNG KÝ REPOSITORY VÀ UNIT OF WORK ===
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IDealerRepository, DealerRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ITestDriveRepository, TestDriveRepository>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IDealerManagementRepository, DealerManagementRepository>();
builder.Services.AddScoped<IPricingRepository, PricingRepository>();
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IDemandForecastRepository, DemandForecastRepository>();
builder.Services.AddScoped<IQuotationRepository, QuotationRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IDealerRepository, DealerRepository>();
builder.Services.AddScoped<IDeliveryRepository, DeliveryRepository>();
builder.Services.AddScoped<IPurchaseRequestRepository, PurchaseRequestRepository>();
builder.Services.AddScoped<IDistributionRepository, DistributionRepository>();
builder.Services.AddScoped<IDistributionSuggestionRepository, DistributionSuggestionRepository>();
builder.Services.AddScoped<IVehicleAdminRepository, VehicleAdminRepository>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
// ===================================================================================

// Ghi chú: Đăng ký các "phòng ban" nghiệp vụ (Services).
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IDealerService, DealerService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ITestDriveService, TestDriveService>();
builder.Services.AddScoped<IVehicleAdminService, VehicleAdminService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IDealerManagementService, DealerManagementService>();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddScoped<IQuotationService, QuotationService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDeliveryService, DeliveryService>();
builder.Services.AddScoped<IPurchaseRequestService, PurchaseRequestService>();
builder.Services.AddScoped<IDistributionService, DistributionService>();
builder.Services.AddScoped<IDemandForecastService, DemandForecastService>();
builder.Services.AddScoped<ISupplyPlanningService, SupplyPlanningService>();

// Ghi chú: Đăng ký AutoMapper.
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Ghi chú: Thiết lập "hệ thống an ninh" JWT.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!))
        };
    });

// Ghi chú: Định nghĩa các chính sách phân quyền.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanViewDashboardStats", policy => policy.RequireClaim("permission", "ViewDashboardStats"));
    options.AddPolicy("CanManageUsers", policy => policy.RequireClaim("permission", "ManageUsers"));
    options.AddPolicy("CanManageDealerAccounts", policy => policy.RequireClaim("permission", "ManageDealerAccounts"));
    options.AddPolicy("CanManageVehicles", policy => policy.RequireClaim("permission", "ManageVehicles"));
    options.AddPolicy("ManageInventory", policy => policy.RequireClaim("permission", "ManageInventory"));
    options.AddPolicy("ManageDistributions", policy => policy.RequireClaim("permission", "ManageDistributions"));
    options.AddPolicy("ConfirmDistributions", policy => policy.RequireClaim("permission", "ConfirmDistributions"));
    options.AddPolicy("ManageDealers", policy => policy.RequireClaim("permission", "ManageDealers"));
    options.AddPolicy("ManagePricing", policy => policy.RequireClaim("permission", "ManagePricing"));
    options.AddPolicy("CanViewAnalytics", policy => policy.RequireClaim("permission", "CanViewAnalytics"));
});

// Ghi chú: Đăng ký Controller và JSON Converter.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
    })
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<UserCreateDtoValidator>());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Vui lòng nhập token (ví dụ: Bearer your_token)",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[]{}
        }
    });
});

// <--- THAY ĐỔI: Cấu hình Hangfire sử dụng PostgreSQL
builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(options =>
        options.UseNpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"))));

builder.Services.AddHangfireServer();

// === 2. XÂY DỰNG ỨNG DỤNG ===
var app = builder.Build();

// === 3. CẤU HÌNH PIPELINE ===
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// === PHẦN BỔ SUNG: CHO PHÉP TRUY CẬP CÁC FILE ĐÃ UPLOAD ===
app.UseStaticFiles(); // Dòng này sẽ phục vụ các file từ thư mục wwwroot
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard();

// Các Cron Job
RecurringJob.AddOrUpdate<IDemandForecastService>(
    "weekly-demand-forecast",
    service => service.RunDemandForecastProcessAsync(),
    "0 18 * * SUN",
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
    }
);

RecurringJob.AddOrUpdate<ISupplyPlanningService>(
    "weekly-suggestion-generator",
    service => service.GenerateDistributionSuggestionsAsync(),
    "0 19 * * SUN",
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
    }
);

app.MapControllers();
app.Run();