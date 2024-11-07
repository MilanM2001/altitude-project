using Backend.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.AuthDto
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MinLength(3)]
        [MaxLength(35)]
        public string Email { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(35)]
        public string Password { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(60)]
        public string Name { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(60)]
        public string Surname { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }
    }
}
