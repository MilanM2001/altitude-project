namespace Backend.Services.TwoFactorAuthenticationService
{
    public interface ITwoFactorAuthenticationService
    {
        Task GenerateAndSendTwoFactorCodeAsync(string email);
        Task<bool> ValidateTwoFactorCodeAsync(string email, string code);
    }
}
