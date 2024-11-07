using Backend.Models;

namespace Backend.Repositories.UserRepository
{
    public interface IUserRepository
    {
        Task<(List<User>, int)> GetAllPageable(int pageNumber, int pageSize, string? email, DateOnly? dateOfBirth);
        Task<User> GetByEmail(string email);
        Task AddUserAsync(User user);
        Task UpdateUser(User updatedUser);
    }
}
