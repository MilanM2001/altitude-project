using Backend.Models;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.UserDto;

namespace Backend.Services.AuthService
{
    public interface IAuthService
    {
        Task Register(RegisterDto registerDto);
        Task<AuthenticationResponseDto> Login(LoginDto loginDto);
        string GenerateAccessToken(User user);
        string GenerateRefreshToken(User user);
        Task<string> RefreshAccessToken(string refreshToken);
        Task<UserResponseDto> GetMe();
    }
}
