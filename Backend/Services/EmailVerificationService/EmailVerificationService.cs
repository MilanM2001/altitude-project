using Backend.Models;
using Backend.Repositories.EmailVerificationCodeRepository;

namespace Backend.Services.EmailVerificationService
{
    public class EmailVerificationService : IEmailVerificationService
    {
        private readonly IEmailVerificationRepository _emailVerificationRepository;

        public EmailVerificationService(IEmailVerificationRepository emailVerificationRepository)
        {
            _emailVerificationRepository = emailVerificationRepository;
        }

        public async Task<EmailVerification?> GetVerificationCodeAsync(string email)
        {
            return await _emailVerificationRepository.FindByUserEmailAsync(email);
        }

        public async Task SaveVerificationCodeAsync(EmailVerification emailVerification)
        {
            await _emailVerificationRepository.SaveAsync(emailVerification);
        }

        public async Task DeleteVerificationCodeAsync(string email)
        {
            await _emailVerificationRepository.DeleteByUserEmailAsync(email);
        }
    }
}
