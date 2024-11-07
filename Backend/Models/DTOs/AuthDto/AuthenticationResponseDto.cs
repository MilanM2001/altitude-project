namespace Backend.Models.DTOs.AuthDto
{
    public class AuthenticationResponseDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public User? NewUser { get; set; } = null;
    }
}
