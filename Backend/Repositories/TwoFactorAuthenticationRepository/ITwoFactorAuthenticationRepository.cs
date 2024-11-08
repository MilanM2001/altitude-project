using Backend.Models;

namespace Backend.Repositories.TwoFactorAuthenticationRepository
{
    public interface ITwoFactorAuthenticationRepository
    {
        Task<TwoFactorAuthentication> GetByUserEmailAsync(string email);
        Task SaveAsync(TwoFactorAuthentication twoFactorAuth, TwoFactorAuthentication? existingAuth);
        Task DeleteByUserEmailAsync(string email);
    }
}
