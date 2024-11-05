using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.UserDto
{
    public class ChangePasswordDto
    {
        [Required]
        [MinLength(8)]
        [MaxLength(30)]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(8)]
        [MaxLength(30)]
        public string NewPassword { get; set; }
    }
}
