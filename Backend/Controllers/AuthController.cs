using Backend.Exceptions;
using Backend.Models;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.UserDto;
using Backend.Repositories.UserRepository;
using Backend.Services.AuthService;
using Google.Apis.Auth;
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
        private readonly IUserRepository _userRepository;

        public AuthController(IAuthService authService, IUserRepository userRepository)
        {
            _authService = authService;
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                await _authService.Register(registerDto);

                return Ok("User Registered");
            }
            catch (EntityExistsException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
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
            catch (InvalidDataException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UserDeletedException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest googleLoginRequest)
        {
            try
            {
                var result = await _authService.GoogleLogin(googleLoginRequest.Token);

                //If the user doesn't exist then return Accepted with the new user info
                if (result.NewUser != null)
                {
                    return Accepted(result);
                } else
                {
                //If the user already exists then return the access and refresh token
                    return Ok(result);
                }
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(ex.Message);
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
                return Ok(new { AccessToken = newAccessToken });
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(new { message = "Invalid refresh token", details = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong", details = ex.Message });
            }
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
