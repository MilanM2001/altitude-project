using Backend.Exceptions;
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

        [HttpGet("allPageable")]
        public async Task<IActionResult> GetAllPageable(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 6,
        [FromQuery] string? email = null,
        [FromQuery] DateOnly? dateOfBirth = null)
        {
            try
            {
                var (users, totalRecords) = await _userService.GetAllPageable(pageNumber, pageSize, email, dateOfBirth);

                var response = new
                {
                    TotalRecords = totalRecords,
                    Users = users
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetById([FromRoute] string email)
        {
            try
            {
                UserResponseDto userDto = await _userService.GetByEmail(email);

                return Ok(userDto);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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

        [HttpPut("changeProfilePicture")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> ChangeProfilePicture([FromForm] ChangeProfilePictureDto changeProfilePictureDto)
        {
            try
            {
                await _userService.ChangeProfilePicture(changeProfilePictureDto);

                return Ok("");
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

        [HttpPut("changeTwoFactorStatus")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> ChangeTwoFactorStatus()
        {
            try
            {
                await _userService.ChangeTwoFactorStatus();
                return Ok("Two Factor status changed");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("deleteUser/{email}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser([FromRoute] string email)
        {
            try
            {
                await _userService.DeleteUser(email);

                return Ok("User deleted");
            } catch (EntityNotFoundException ex)
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
