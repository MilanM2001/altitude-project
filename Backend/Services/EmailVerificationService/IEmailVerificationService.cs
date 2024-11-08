using Backend.Models;

namespace Backend.Services.EmailVerificationService
{
    public interface IEmailVerificationService
    {
        Task<EmailVerification?> GetVerificationCodeAsync(string email);
        Task SaveVerificationCodeAsync(EmailVerification emailVerification);
        Task DeleteVerificationCodeAsync(string email);
    }
}
