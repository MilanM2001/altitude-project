using AutoMapper;
using Backend.Exceptions;
using Backend.Models;
using Backend.Models.DTOs.UserDto;
using Backend.Repositories.UserRepository;
using Microsoft.IdentityModel.Tokens;
using System.Security.Authentication;
using System.Security.Claims;

namespace Backend.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IUserRepository userRepository, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<(List<UserResponseDto>, int)> GetAllPageable(int pageNumber, int pageSize, string? email = null, DateOnly? dateOfBirth = null)
        {
            var (users, totalRecords) = await _userRepository.GetAllPageable(pageNumber, pageSize, email, dateOfBirth);

            var usersDto = _mapper.Map<List<UserResponseDto>>(users);
            for (int i = 0; i < usersDto.Count; i++)
            {
                if (users[i].Image != null)
                {
                    usersDto[i].Image = Convert.ToBase64String(users[i].Image);
                }
            }

            return (usersDto, totalRecords);
        }

        public async Task<UserResponseDto> GetByEmail(string email)
        {
            User user = await _userRepository.GetByEmail(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            UserResponseDto userDto = _mapper.Map<UserResponseDto>(user);

            userDto.Image = Convert.ToBase64String(user.Image);

            return userDto;
        }

        public async Task UpdateMyInfo(UpdateMyInfoDto updateMyInfoDto)
        {
            var email = "";
            if (_httpContextAccessor.HttpContext != null)
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(email))
                throw new SecurityTokenException("Token invalid");

            var user = await _userRepository.GetByEmail(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            var updatedInfo = _mapper.Map(updateMyInfoDto, user);

            await _userRepository.UpdateUser(updatedInfo);
        }

        public async Task ChangeProfilePicture(ChangeProfilePictureDto changeProfilePictureDto)
        {
            var email = "";
            if (_httpContextAccessor.HttpContext != null)
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(email))
                throw new SecurityTokenException("Token invalid");

            var user = await _userRepository.GetByEmail(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            if (changeProfilePictureDto.ImageFile != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await changeProfilePictureDto.ImageFile.CopyToAsync(memoryStream);
                    user.Image = memoryStream.ToArray();
                }
            }

            await _userRepository.UpdateUser(user);
        }

        public async Task ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var email = "";
            if (_httpContextAccessor.HttpContext != null)
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(email))
                throw new SecurityTokenException("Token invalid");

            var user = await _userRepository.GetByEmail(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.Password))
                throw new InvalidCredentialException("Current password is incorrect.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

            await _userRepository.UpdateUser(user);
        }

        public async Task ChangeTwoFactorStatus()
        {
            var email = "";
            if (_httpContextAccessor.HttpContext != null)
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(email))
                throw new SecurityTokenException("Token invalid");

            var user = await _userRepository.GetByEmail(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            if (user.TwoFactorEnabled == false)
                user.TwoFactorEnabled = true;
            else user.TwoFactorEnabled = false;

            await _userRepository.UpdateUser(user);
        }

        public async Task DeleteUser(string email)
        {
            var user = await _userRepository.GetByEmail(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            user.IsDeleted = true;

            await _userRepository.UpdateUser(user);
        }
    }
}
