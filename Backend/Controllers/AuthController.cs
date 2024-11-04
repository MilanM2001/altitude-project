using Backend.Exceptions;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.UserDto;
using Backend.Services.AuthService;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                await _authService.Register(registerDto);

                return Ok("User Registered");
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                var result = await _authService.Login(loginDto);

                return Ok(result);
            }
            catch (InvalidDataException)
            {
                return NotFound("Invalid credentials");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            try
            {
                var newAccessToken = await _authService.RefreshAccessToken(refreshTokenDto.RefreshToken);
                return Ok(newAccessToken);
            }
            catch (SecurityTokenException ex)
            {
                Console.WriteLine(ex);
                return Unauthorized(new { message = "Invalid refresh token", details = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(new { message = "Something went wrong", details = ex.Message });
            }
        }

        [HttpGet("test")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> Test()
        {
            return Ok("Works");
        }

        [HttpGet("getMe")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> GetMe()
        {
            try
            {
                UserResponseDto userResponse = await _authService.GetMe();

                return Ok(userResponse);
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(ex.Message);
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
    }
}
