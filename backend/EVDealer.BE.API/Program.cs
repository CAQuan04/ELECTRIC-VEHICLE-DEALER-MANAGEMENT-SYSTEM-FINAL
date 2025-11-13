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
// Ghi chú: Đổi tên namespace 'IInventory' thành 'Inventory' cho nhất quán nếu bạn đã đổi.
using EVDealer.BE.Services.IInventory;
using EVDealer.BE.Services.Planning;
using EVDealer.BE.Services.Pricing;
using EVDealer.BE.Services.TestDrives;
using EVDealer.BE.Services.Users;
using EVDealer.BE.Services.Vehicles;
using FluentValidation.AspNetCore;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;



var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// === 1. CẤU HÌNH CÁC DỊCH VỤ (SERVICE CONFIGURATION) ===

// Ghi chú: Kết nối với CSDL SQL Server sử dụng chuỗi kết nối từ appsettings.json.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

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
// === PHẦN SỬA ĐỔI: ĐĂNG KÝ REPOSITORY VÀ UNIT OF WORK ===

// Ghi chú: Đăng ký tất cả các Repository riêng lẻ.
// Đây là bước quan trọng để giải quyết lỗi. Hệ thống DI cần biết cách tạo ra các
// Repository này khi các Service yêu cầu chúng.
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
// Thêm bất kỳ repository nào khác bạn có ở đây...
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IDealerRepository, DealerRepository>();

// Ghi chú: Đăng ký Unit of Work, quản lý tất cả Repository.
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
// Đăng ký Service AI
builder.Services.AddScoped<IDemandForecastService, DemandForecastService>();
builder.Services.AddScoped<IVehicleAdminRepository, VehicleAdminRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Logging.ClearProviders();
builder.Services.AddScoped<IDistributionSuggestionRepository, DistributionSuggestionRepository>();
builder.Logging.AddConsole();
// Ghi chú: Đăng ký AutoMapper, tự động tìm tất cả các Profile trong project API.
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IDealerRepository, DealerRepository>();

builder.Services.AddScoped<ISupplyPlanningService, SupplyPlanningService>();
// Ghi chú: Thiết lập "hệ thống an ninh" JWT (Xác thực - Authentication).
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

// Ghi chú: Định nghĩa các chính sách phân quyền (Policy-Based Authorization).
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

// Ghi chú: Đăng ký các Controller, cấu hình JSON và kích hoạt FluentValidation.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Thêm "người phiên dịch" để API hiểu được kiểu dữ liệu DateOnly.
        options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
    })
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<UserCreateDtoValidator>());


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Cấu hình Swagger để hiển thị nút Authorize.
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

// Ghi chú: Cấu hình dịch vụ Hangfire để chạy các công việc trong nền (background jobs).
builder.Services.AddHangfire(config => config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();


// === 2. XÂY DỰNG ỨNG DỤNG (BUILD THE APP) ===
var app = builder.Build();


// === 3. CẤU HÌNH PIPELINE XỬ LÝ HTTP REQUEST (CONFIGURE THE PIPELINE) ===
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard();

// Lên lịch cho công việc dự báo AI chạy vào lúc 18:00 (6 giờ tối) Chủ Nhật hàng tuần.
RecurringJob.AddOrUpdate<IDemandForecastService>(
    "weekly-demand-forecast",
    service => service.RunDemandForecastProcessAsync(),
    // Ghi chú: "0 18 * * SUN" là biểu thức Cron có nghĩa là:
    // Phút 0, Giờ 18, mỗi Ngày, mỗi Tháng, vào ngày Chủ Nhật (Sunday).
    "0 18 * * SUN",
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
    }
);

// Lên lịch cho công việc tạo đề xuất chạy vào lúc 19:00 (7 giờ tối) Chủ Nhật hàng tuần.
RecurringJob.AddOrUpdate<ISupplyPlanningService>(
    "weekly-suggestion-generator",
    service => service.GenerateDistributionSuggestionsAsync(),
    // Ghi chú: Tương tự, "0 19 * * SUN" nghĩa là Phút 0, Giờ 19 vào ngày Chủ Nhật.
    "0 19 * * SUN",
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
    }
);

app.MapControllers();
app.Run();