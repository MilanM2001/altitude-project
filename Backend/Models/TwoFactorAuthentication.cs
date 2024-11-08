using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class TwoFactorAuthentication
    {
        [Key]
        [Required]
        public string UserEmail { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public DateTime ExpirationTime { get; set; }
    }
}
