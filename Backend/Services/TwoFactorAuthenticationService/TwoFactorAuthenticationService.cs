using Backend.Models;
using Backend.Repositories.TwoFactorAuthenticationRepository;
using Backend.Services.EmailService;

namespace Backend.Services.TwoFactorAuthenticationService
{
    public class TwoFactorAuthenticationService : ITwoFactorAuthenticationService
    {
        private readonly ITwoFactorAuthenticationRepository _twoFactorAuthRepository;
        private readonly IEmailService _emailService;

        public TwoFactorAuthenticationService(
            ITwoFactorAuthenticationRepository twoFactorAuthRepository,
            IEmailService emailService)
        {
            _twoFactorAuthRepository = twoFactorAuthRepository;
            _emailService = emailService;
        }

        public async Task GenerateAndSendTwoFactorCodeAsync(string email)
        {
            var existingAuth = await _twoFactorAuthRepository.GetByUserEmailAsync(email);
            var code = Guid.NewGuid().ToString("N").Substring(0, 6);
            var twoFactorAuth = new TwoFactorAuthentication
            {
                UserEmail = email,
                Code = code,
                ExpirationTime = DateTime.UtcNow.AddMinutes(5)
            };

            await _twoFactorAuthRepository.SaveAsync(twoFactorAuth, existingAuth);
            await _emailService.SendTwoFactorCodeEmail(email, code);
        }

        public async Task<bool> ValidateTwoFactorCodeAsync(string email, string code)
        {
            var twoFactorAuth = await _twoFactorAuthRepository.GetByUserEmailAsync(email);
            if (twoFactorAuth == null || twoFactorAuth.Code != code || twoFactorAuth.ExpirationTime < DateTime.UtcNow)
            {
                return false;
            }

            // If the code is valid, delete it from the database
            await _twoFactorAuthRepository.DeleteByUserEmailAsync(email);
            return true;
        }
    }
}
