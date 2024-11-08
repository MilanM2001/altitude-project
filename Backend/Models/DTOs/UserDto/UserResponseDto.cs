namespace Backend.Models.DTOs.UserDto
{
    public class UserResponseDto
    {
        public string Email { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string Role { get; set; }

        public string Image { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsVerified { get; set; }

        public bool TwoFactorEnabled { get; set; }
    }
}
