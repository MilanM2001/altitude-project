using Backend.Exceptions;
using Backend.Models;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.EmailDto;
using Backend.Models.DTOs.UserDto;
using Backend.Repositories.UserRepository;
using Backend.Services.AuthService;
using Backend.Services.EmailService;
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
        private readonly IEmailService _emailService;

        public AuthController(IAuthService authService, IEmailService emailService)
        {
            _authService = authService;
            _emailService = emailService;
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
            catch (UserNotVerifiedException)
            {
                return Forbid();
            }
            catch (TwoFactorEnabledException) {
                return StatusCode(405);
            }
            catch (EntityExistsException)
            {
                return StatusCode(408);
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

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailDto verifyEmailDto)
        {
            try
            {
                await _emailService.VerifyEmail(verifyEmailDto);

                return Ok("Email Verified");
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidCodeException ex)
            {
                return Conflict(ex.Message);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("verify-two-factor")]
        public async Task<IActionResult> VerifyTwoFactor(VerifyTwoFactorDto verifyTwoFactorDto)
        {
            try
            {
                var result = await _emailService.VerifyTwoFactorAuthentication(verifyTwoFactorDto);

                return Ok(result);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidCodeException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
