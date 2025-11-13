// File: API/Controllers/RolesController.cs
using EVDealer.BE.DAL.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Yêu cầu người dùng phải đăng nhập
    public class RolesController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;

        // Ghi chú: Yêu cầu DI cung cấp RoleRepository
        public RolesController(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        // GET: /api/Roles
        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleRepository.GetAllAsync();
            return Ok(roles);
        }
    }
}