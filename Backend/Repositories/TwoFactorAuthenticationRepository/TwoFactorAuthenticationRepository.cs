using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.TwoFactorAuthenticationRepository
{
    public class TwoFactorAuthenticationRepository : ITwoFactorAuthenticationRepository
    {
        private readonly DataContext _context;

        public TwoFactorAuthenticationRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<TwoFactorAuthentication> GetByUserEmailAsync(string email)
        {
            return await _context.TwoFactorAuthentications
                                 .FirstOrDefaultAsync(tfa => tfa.UserEmail == email);
        }

        public async Task SaveAsync(TwoFactorAuthentication twoFactorAuth, TwoFactorAuthentication? existingAuth = null)
        {
            if (existingAuth != null)
            {
                _context.TwoFactorAuthentications.Remove(existingAuth);
            }

            await _context.TwoFactorAuthentications.AddAsync(twoFactorAuth);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByUserEmailAsync(string email)
        {
            var twoFactorAuth = await GetByUserEmailAsync(email);
            if (twoFactorAuth != null)
            {
                _context.TwoFactorAuthentications.Remove(twoFactorAuth);
                await _context.SaveChangesAsync();
            }
        }
    }
}
