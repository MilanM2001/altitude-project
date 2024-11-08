using Backend.Models;

namespace Backend.Repositories.EmailVerificationCodeRepository
{
    public interface IEmailVerificationRepository
    {
        Task<EmailVerification?> FindByUserEmailAsync(string email);
        Task SaveAsync(EmailVerification emailVerification);
        Task DeleteByUserEmailAsync(string email);
    }
}
