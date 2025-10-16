// Ghi chú: File này là "bản ghi lịch sử thay đổi", được tạo bởi lệnh Add-Migration.
// Nó chứa hai phương thức chính: Up() để áp dụng thay đổi, và Down() để hoàn tác thay đổi đó.
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVDealer.BE.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddPermissionAndRolePermissionTables : Migration
    {
        /// <summary>
        /// Ghi chú: Phương thức Up() định nghĩa các hành động sẽ được thực thi trên CSDL
        /// khi bạn chạy lệnh 'Update-Database'.
        /// Mục tiêu của nó là tạo ra 2 bảng mới: Permission và Role_Permission.
        /// </summary>
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ghi chú: Tạo bảng 'Permission' để lưu danh sách các quyền hạn.
            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    // Định nghĩa cột PermissionId là INT, không null, và tự động tăng (IDENTITY).
                    PermissionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),

                    // Định nghĩa cột PermissionName là VARCHAR(100), không null.
                    PermissionName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    // Định nghĩa cột PermissionId là khóa chính (PRIMARY KEY).
                    table.PrimaryKey("PK_Permission", x => x.PermissionId);
                });

            // Ghi chú: Tạo bảng trung gian 'Role_Permission' để tạo mối quan hệ nhiều-nhiều.
            migrationBuilder.CreateTable(
                name: "Role_Permission",
                columns: table => new
                {
                    // Định nghĩa cột RoleId là INT, không null.
                    RoleId = table.Column<int>(type: "int", nullable: false),

                    // Định nghĩa cột PermissionId là INT, không null.
                    PermissionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    // Định nghĩa khóa chính kết hợp từ 2 cột (Composite Primary Key).
                    table.PrimaryKey("PK_Role_Permission", x => new { x.RoleId, x.PermissionId });

                    // Định nghĩa khóa ngoại (FOREIGN KEY) từ PermissionId đến bảng Permission.
                    table.ForeignKey(
                        name: "FK_Role_Permission_Permission_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permission",
                        principalColumn: "PermissionId",
                        onDelete: ReferentialAction.Cascade); // Nếu một Permission bị xóa, các dòng liên quan trong đây cũng bị xóa.

                    // Định nghĩa khóa ngoại (FOREIGN KEY) từ RoleId đến bảng Role.
                    table.ForeignKey(
                        name: "FK_Role_Permission_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "role_id", // Tên cột khóa chính trong bảng Role.
                        onDelete: ReferentialAction.Cascade); // Nếu một Role bị xóa, các dòng liên quan cũng bị xóa.
                });
        }

        /// <summary>
        /// Ghi chú: Phương thức Down() định nghĩa các hành động ngược lại hoàn toàn với Up().
        /// Nó sẽ được thực thi nếu bạn muốn "hoàn tác" migration này.
        /// Nhiệm vụ của nó là xóa 2 bảng mà Up() đã tạo.
        /// </summary>
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Ghi chú: Luôn phải xóa bảng có chứa khóa ngoại trước (bảng trung gian)
            // để tránh lỗi vi phạm ràng buộc (constraint violation).
            migrationBuilder.DropTable(
                name: "Role_Permission");

            // Ghi chú: Sau khi bảng trung gian đã bị xóa, chúng ta có thể xóa bảng chính an toàn.
            migrationBuilder.DropTable(
                name: "Permission");
        }
    }
}