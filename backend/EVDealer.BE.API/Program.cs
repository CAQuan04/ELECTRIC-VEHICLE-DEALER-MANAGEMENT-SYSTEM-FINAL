
using EVDealer.BE.API.Helpers;
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.Admin;
using EVDealer.BE.Services.Auth;
using EVDealer.BE.Services.IInventory;
using EVDealer.BE.Services.Users;
using EVDealer.BE.Services.Vehicles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EVDealer.BE.Services.DealerManagement;
using EVDealer.BE.API.Validators;
using FluentValidation.AspNetCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// 1. Kết nối CSDL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

// 2. Đăng ký các "phòng ban" (Dependency Injection)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
// Ghi chú: "Khai báo" cho hệ thống biết rằng mỗi khi có ai đó cần IUserService,
// hãy tạo một đối tượng UserService để cung cấp.
builder.Services.AddScoped<IUserService, UserService>();


builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IVehicleService, VehicleService>();

builder.Services.AddScoped<IVehicleAdminRepository, VehicleAdminRepository>();
builder.Services.AddScoped<IVehicleAdminService, VehicleAdminService>();

builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IInventoryService, InventoryService>();

builder.Services.AddScoped<IDealerManagementRepository, DealerManagementRepository>();
builder.Services.AddScoped<IDealerManagementService, DealerManagementService>();

// Ghi chú: Đăng ký AutoMapper ở đây.
builder.Services.AddAutoMapper(typeof(Program));

// Ghi chú: Dòng này sẽ tự động tìm tất cả các lớp kế thừa từ 'Profile'
// trong Assembly hiện tại (tức là project API) và đăng ký chúng.
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

// 3. Thiết lập "hệ thống an ninh" JWT (Xác thực - Authentication)
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

// ===================================================================================
// === PHẦN ĐÃ HOÀN CHỈNH: ĐỊNH NGHĨA CÁC CHÍNH SÁCH PHÂN QUYỀN (POLICY-BASED) ===
// ===================================================================================
// Ghi chú: Đây là nơi chúng ta "dạy" cho hệ thống biết các quy tắc phân quyền.
builder.Services.AddAuthorization(options =>
{
    // Ghi chú: Định nghĩa một chính sách tên là "CanViewDashboardStats".
    // Yêu cầu: Người dùng phải có một claim với type là "permission" và value là "ViewDashboardStats".
    options.AddPolicy("CanViewDashboardStats", policy =>
        policy.RequireClaim("permission", "ViewDashboardStats"));

    // Ghi chú: Định nghĩa chính sách cho việc quản lý người dùng.
    options.AddPolicy("CanManageUsers", policy =>
        policy.RequireClaim("permission", "ManageUsers"));

    // Ghi chú: "Dạy" cho hệ thống biết Policy "CanManageDealerAccounts" có nghĩa là gì.
    options.AddPolicy("CanManageDealerAccounts", policy =>
        policy.RequireClaim("permission", "ManageDealerAccounts"));

    // Ghi chú: Thêm chính sách mới 'CanManageVehicles' để bảo vệ Controller của bạn.
    options.AddPolicy("CanManageVehicles", policy =>
        policy.RequireClaim("permission", "ManageVehicles"));

    options.AddPolicy("ManageInventory", policy => policy.RequireClaim("permission", "ManageInventory"));
    options.AddPolicy("ManageDistributions", policy => policy.RequireClaim("permission", "ManageDistributions"));
    options.AddPolicy("ConfirmDistributions", policy => policy.RequireClaim("permission", "ConfirmDistributions"));

    options.AddPolicy("ManageDealers", policy =>
        policy.RequireClaim("permission", "ManageDealers"));

});

builder.Services.AddControllers()
.AddJsonOptions(options =>
 {
     options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
 })
.AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<UserCreateDtoValidator>());


builder.Services.AddEndpointsApiExplorer();

// Cấu hình Swagger để hiển thị nút Authorize (giữ nguyên, phần này bạn đã làm đúng)
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Vui lòng nhập token",
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
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

// Kích hoạt các "chốt bảo vệ" theo đúng thứ tự
app.UseAuthentication(); // Chốt 1: Xác thực xem "thẻ bài" (Token) có hợp lệ không.
app.UseAuthorization();  // Chốt 2: Kiểm tra xem người mang thẻ có đủ quyền vào khu vực này không.

app.MapControllers();
app.Run();