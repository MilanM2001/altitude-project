using Backend.Models;

namespace Backend.Repositories.UserRepository
{
    public interface IUserRepository
    {
        Task<User> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task UpdateUser(User updatedUser);
    }
}
