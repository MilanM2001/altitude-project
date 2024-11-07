namespace Backend.Models.DTOs.AuthDto
{
    public class GoogleRegisterRequest
    {
        public string Password { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Token { get; set; }
    }
}
