using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Backend.Models.Enums;

namespace Backend.Models
{
    public class User
    {
        [Key]
        [Required]
        [EmailAddress]
        [MinLength(5)]
        [MaxLength(70)]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string Name { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string Surname { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public Role Role { get; set; }

        public byte[] Image { get; set; }

        [Required]
        public bool IsDeleted { get; set; }
    }
}
