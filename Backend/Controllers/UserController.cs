using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.UserDto;
using Backend.Services.AuthService;
using Backend.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Authentication;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPut("updateMyInfo")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> UpdateMyInfo(UpdateMyInfoDto updateMyInfoDto)
        {
            try
            {
                await _userService.UpdateMyInfo(updateMyInfoDto);

                return Ok("Info Updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("changePassword")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            try
            {
                await _userService.ChangePassword(changePasswordDto);
                return Ok("Password Changed Successfully");
            }
            catch (InvalidCredentialException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
