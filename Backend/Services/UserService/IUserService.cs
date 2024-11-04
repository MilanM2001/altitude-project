using Backend.Models.DTOs.UserDto;

namespace Backend.Services.UserService
{
    public interface IUserService
    {
        Task<UserResponseDto> GetByEmailAsync(string email);
    }
}
