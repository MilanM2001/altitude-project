using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class EmailVerification
    {
        [Key]
        [Required]
        public string UserEmail { get; set; }

        [Required]
        public string Code { get; set; }
    }
}
