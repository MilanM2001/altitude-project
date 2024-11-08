using Backend.Models.DTOs.UserDto;

namespace Backend.Services.UserService
{
    public interface IUserService
    {
        Task<(List<UserResponseDto>, int)> GetAllPageable(int pageNumber, int pageSize, string? email, DateOnly? dateOfBirth);
        Task<UserResponseDto> GetByEmail(string email);
        Task UpdateMyInfo(UpdateMyInfoDto updateInfoDto);
        Task ChangeProfilePicture(ChangeProfilePictureDto changeProfilePictureDto);
        Task ChangePassword(ChangePasswordDto changePasswordDto);
        Task ChangeTwoFactorStatus();
        Task DeleteUser(string email);
    }
}
