using Backend.Exceptions;
using Backend.Models;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.EmailDto;
using Backend.Repositories.EmailVerificationCodeRepository;
using Backend.Repositories.TwoFactorAuthenticationRepository;
using Backend.Repositories.UserRepository;
using Backend.Services.AuthService;
using Backend.Services.UserService;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailVerificationRepository _emailVerificationRepository;
        private readonly ITwoFactorAuthenticationRepository _twoFactorAuthenticationRepository;
        private readonly SmtpClient _smtpClient;
        private readonly IConfiguration _configuration;
        private readonly JwtSecurityTokenHandler _tokenHandler = new JwtSecurityTokenHandler();

        public EmailService(IUserRepository userRepository, IEmailVerificationRepository emailVerificationRepository,
            ITwoFactorAuthenticationRepository twoFactorAuthenticationRepository, SmtpClient smtpClient, IConfiguration configuration, JwtSecurityTokenHandler tokenHandler)
        {
            _userRepository = userRepository;
            _emailVerificationRepository = emailVerificationRepository;
            _twoFactorAuthenticationRepository = twoFactorAuthenticationRepository;
            _smtpClient = smtpClient;
            _configuration = configuration;
            _tokenHandler = tokenHandler;
        }

        public async Task SendVerificationEmail(string email, string verificationCode)
        {
            var mailMessage = new MailMessage("test-project@example.com", email)
            {
                Subject = "Email Verification",
                Body = $"Your verification code is: {verificationCode}, go to http://localhost:5173/verify-account/{email}"
            };

            await _smtpClient.SendMailAsync(mailMessage);
        }

        public async Task SendTwoFactorCodeEmail(string email, string code)
        {
            var message = new MailMessage("test-project@example.com", email)
            {
                Subject = "Two-Factor Authentication Code",
                Body = $"Your 2FA code is: {code}, go to http://localhost:5173/verify-two-factor/{email}",
                IsBodyHtml = true
            };
            message.To.Add(email);

            
            await _smtpClient.SendMailAsync(message);
        }

        public async Task VerifyEmail(VerifyEmailDto verifyEmailDto)
        {
            var user = await _userRepository.GetByEmail(verifyEmailDto.Email);
            if (user == null)
                throw new EntityNotFoundException("User not found");

            var emailVerification = await _emailVerificationRepository.FindByUserEmailAsync(verifyEmailDto.Email);
            if (emailVerification == null)
                throw new EntityNotFoundException("Email Verification not found");

            if (emailVerification.Code != verifyEmailDto.Code)
                throw new InvalidCodeException("Invalid verification code");

            user.IsVerified = true;
            await _userRepository.UpdateUser(user);
            await _emailVerificationRepository.DeleteByUserEmailAsync(user.Email);
        }

        public async Task<AuthenticationResponseDto> VerifyTwoFactorAuthentication(VerifyTwoFactorDto verifyTwoFactorDto)
        {
            var user = await _userRepository.GetByEmail(verifyTwoFactorDto.Email);
            if (user == null)
                throw new EntityNotFoundException("User not found");

            var twoFactorAuthentication = await _twoFactorAuthenticationRepository.GetByUserEmailAsync(verifyTwoFactorDto.Email);
            if (twoFactorAuthentication == null)
                throw new EntityNotFoundException("Two Factor not found");

            if (twoFactorAuthentication.Code != verifyTwoFactorDto.Code)
                throw new InvalidCodeException("Invalid two factor code");

            var authenticationResponseDto = new AuthenticationResponseDto
            {
                AccessToken = GenerateAccessToken(user),
                RefreshToken = GenerateRefreshToken(user)
            };

            await _twoFactorAuthenticationRepository.DeleteByUserEmailAsync(user.Email);
            return authenticationResponseDto;
        }

        private string GenerateAccessToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            List<Claim> claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("role", user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
            claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: creds
            );

            return _tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            List<Claim> claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var refreshToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
            claims: claims,
                expires: DateTime.UtcNow.AddDays(2),
                signingCredentials: creds
            );

            return _tokenHandler.WriteToken(refreshToken);
        }
    }
}
