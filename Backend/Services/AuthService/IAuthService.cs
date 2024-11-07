using Backend.Models;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.UserDto;
using Google.Apis.Auth;

namespace Backend.Services.AuthService
{
    public interface IAuthService
    {
        Task Register(RegisterDto registerDto);
        Task<AuthenticationResponseDto> Login(LoginDto loginDto);
        Task<string> RefreshAccessToken(string refreshToken);
        Task<UserResponseDto> GetMe();
        Task<AuthenticationResponseDto> GoogleLogin(string googleToken);
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token);
        string GenerateAccessToken(User newUser);
        string GenerateRefreshToken(User newUser);
    }
}
