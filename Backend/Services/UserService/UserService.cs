using AutoMapper;
using Backend.Exceptions;
using Backend.Models;
using Backend.Models.DTOs.UserDto;
using Backend.Repositories.UserRepository;

namespace Backend.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<UserResponseDto> GetByEmailAsync(string email)
        {
            User user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            UserResponseDto responseDto = _mapper.Map<UserResponseDto>(user);

            return responseDto;
        }
    }
}
