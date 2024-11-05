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

        public async Task<UserResponseDto> GetByEmailAsync(string email)
        {
            User user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            UserResponseDto responseDto = _mapper.Map<UserResponseDto>(user);

            return responseDto;
        }

        public async Task UpdateMyInfo(UpdateMyInfoDto updateMyInfoDto)
        {
            var email = "";
            if (_httpContextAccessor.HttpContext != null)
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(email))
                throw new SecurityTokenException("Token invalid");

            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            var updatedInfo = _mapper.Map(updateMyInfoDto, user);

            await _userRepository.UpdateUser(updatedInfo);
        }

        public async Task ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var email = "";
            if (_httpContextAccessor.HttpContext != null)
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(email))
                throw new SecurityTokenException("Token invalid");

            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.Password))
                throw new InvalidCredentialException("Current password is incorrect.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

            await _userRepository.UpdateUser(user);
        }
    }
}
