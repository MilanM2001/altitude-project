namespace Backend.Models.DTOs.EmailDto
{
    public class VerifyTwoFactorDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }
}
