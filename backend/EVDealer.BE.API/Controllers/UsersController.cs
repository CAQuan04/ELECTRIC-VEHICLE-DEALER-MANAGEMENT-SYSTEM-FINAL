using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "CanManageDealerAccounts")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService) => _userService = userService;

        [HttpGet] // GET: api/Users
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}", Name = "GetUserById")] // GET: api/Users/5
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost] // POST: api/Users
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userCreateDto)
        {
            var createdUser = await _userService.CreateUserAsync(userCreateDto);
            if (createdUser == null) return BadRequest(new { message = "Tên đăng nhập đã tồn tại." });
            return CreatedAtRoute("GetUserById", new { id = createdUser.UserId }, createdUser);
        }

        [HttpPut("{id}")] // PUT: api/Users/5
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userUpdateDto)
        {
            var result = await _userService.UpdateUserAsync(id, userUpdateDto);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id}/status")] // PATCH: api/Users/5/status
        public async Task<IActionResult> ChangeUserStatus(int id, [FromBody] UserStatusUpdateDto statusUpdateDto)
        {
            var result = await _userService.ChangeUserStatusAsync(id, statusUpdateDto);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
