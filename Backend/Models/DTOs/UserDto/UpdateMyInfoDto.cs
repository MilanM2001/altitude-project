using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs.UserDto
{
    public class UpdateMyInfoDto
    {
        [Required]
        [MinLength(2)]
        [MaxLength(30)]
        public string Name { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(30)]
        public string Surname { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }
    }
}
