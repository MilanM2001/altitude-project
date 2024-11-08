using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.EmailDto;

namespace Backend.Services.EmailService
{
    public interface IEmailService
    {
        Task SendVerificationEmail(string email, string verificationCode);
        Task SendTwoFactorCodeEmail(string email, string code);
        Task VerifyEmail(VerifyEmailDto verifyEmailDto);
        Task<AuthenticationResponseDto> VerifyTwoFactorAuthentication(VerifyTwoFactorDto verifyTwoFactorDto);
    }
}
