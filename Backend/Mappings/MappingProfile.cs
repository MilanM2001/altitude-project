using AutoMapper;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.UserDto;
using Backend.Models;

namespace Backend.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile() {

            //CreateMap<User, RegisterDto>();
            CreateMap<User, UserResponseDto>();
            CreateMap<RegisterDto, User>();
        }
    }
}
