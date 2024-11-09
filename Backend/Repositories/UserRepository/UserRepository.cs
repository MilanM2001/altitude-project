using Backend.Data;
using Backend.Models;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.UserRepository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<(List<User>, int)> GetAllPageable(
    int pageNumber, int pageSize, string? email = null, DateOnly? dateOfBirth = null, bool? isVerified = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(u => u.Email.Contains(email));
            }

            if (dateOfBirth.HasValue)
            {
                query = query.Where(u => u.DateOfBirth == dateOfBirth);
            }

            if (isVerified.HasValue)
            {
                query = query.Where(u => u.IsVerified == isVerified.Value);
            }

            var totalRecords = await query.CountAsync();
            var users = await query
                             .Where(u => u.Role == Role.User)
                             .Skip((pageNumber - 1) * pageSize)
                             .Take(pageSize)
                             .ToListAsync();

            return (users, totalRecords);
        }

        public async Task<User> GetByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUser(User updatedUser)
        {
            _context.Users.Update(updatedUser);
            await _context.SaveChangesAsync();
        }
    }
}
