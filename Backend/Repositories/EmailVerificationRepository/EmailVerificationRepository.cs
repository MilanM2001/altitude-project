using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.EmailVerificationCodeRepository
{
    public class EmailVerificationRepository : IEmailVerificationRepository
    {
        private readonly DataContext _context;

        public EmailVerificationRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<EmailVerification?> FindByUserEmailAsync(string email)
        {
            return await _context.EmailVerifications
                                 .FirstOrDefaultAsync(ev => ev.UserEmail == email);
        }

        public async Task SaveAsync(EmailVerification emailVerification)
        {
            _context.EmailVerifications.Add(emailVerification);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByUserEmailAsync(string email)
        {
            var record = await _context.EmailVerifications
                                        .FirstOrDefaultAsync(ev => ev.UserEmail == email);
            if (record != null)
            {
                _context.EmailVerifications.Remove(record);
                await _context.SaveChangesAsync();
            }
        }
    }
}
