using AutoMapper;
using Backend.Exceptions;
using Backend.Models;
using Backend.Models.DTOs.AuthDto;
using Backend.Models.DTOs.UserDto;
using Backend.Repositories.EmailVerificationCodeRepository;
using Backend.Repositories.TwoFactorAuthenticationRepository;
using Backend.Repositories.UserRepository;
using Backend.Services.EmailService;
using Backend.Services.TwoFactorAuthenticationService;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailVerificationRepository _emailVerificationRepository;
        private readonly ITwoFactorAuthenticationService _twoFactorAuthenticationService;
        private readonly ITwoFactorAuthenticationRepository _twoFactorAuthenticationRepository;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly JwtSecurityTokenHandler _tokenHandler = new JwtSecurityTokenHandler();
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IUserRepository userRepository, IEmailVerificationRepository emailVerificationRepository, ITwoFactorAuthenticationService twoFactorAuthenticationService,
            ITwoFactorAuthenticationRepository twoFactorAuthenticationRepository, IEmailService emailService, IMapper mapper,
            IConfiguration configuration, JwtSecurityTokenHandler tokenHandler, IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _emailVerificationRepository = emailVerificationRepository;
            _twoFactorAuthenticationService = twoFactorAuthenticationService;
            _twoFactorAuthenticationRepository = twoFactorAuthenticationRepository;
            _emailService = emailService;
            _mapper = mapper;
            _configuration = configuration;
            _tokenHandler = tokenHandler;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task Register(RegisterDto registerDto)
        {
            var existingUser = await _userRepository.GetByEmail(registerDto.Email);
            if (existingUser != null)
                throw new EntityExistsException("User with that email already exists");


            var user = _mapper.Map<User>(registerDto);

            user.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            user.IsDeleted = false;
            user.Image = Array.Empty<byte>();
            user.Role = Models.Enums.Role.User;
            user.IsVerified = false;
            var verificationCode = Guid.NewGuid().ToString("N").Substring(0, 6);
            var emailVerification = new EmailVerification
            {
                UserEmail = user.Email,
                Code = verificationCode,
            };
            //To turn the verification off, just set the IsVerified to true and comment the SendVerificationEmail function below.
            //After the user is registered, a code and a link will be send to his email. Enter the code in the input field after accessing the link

            await _userRepository.AddUserAsync(user);
            await _emailVerificationRepository.SaveAsync(emailVerification);
            await _emailService.SendVerificationEmail(user.Email, verificationCode);
        }

        public async Task<AuthenticationResponseDto> Login(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmail(loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                throw new InvalidDataException("Invalid credentials");
            else if (user.IsDeleted == true)
                throw new UserDeletedException("User is deleted");
            else if (user.IsVerified == false)
                throw new UserNotVerifiedException("User is not verified");
            else if (user.TwoFactorEnabled == true)
            {
                //If two factor is enabled, check if a two factor code for the user already exists inside the database
                //If it doesn't exist, create a new two factor code and send it to the user
                var existingTwoFactor = await _twoFactorAuthenticationRepository.GetByUserEmailAsync(loginDto.Email);
                if (existingTwoFactor == null)
                { 
                    await _twoFactorAuthenticationService.GenerateAndSendTwoFactorCodeAsync(user.Email);
                    throw new TwoFactorEnabledException("Two Factor Authentication sent");
                }
                //If the two factor code does exist, first check if its expired
                else {
                    //If the code is expired, delete it and send a new one
                    if (existingTwoFactor.ExpirationTime < DateTime.UtcNow)
                    {
                        await _twoFactorAuthenticationService.GenerateAndSendTwoFactorCodeAsync(user.Email);
                        throw new TwoFactorExpiredException("Two Factor expired, new one sent");
                    }
                    
                    throw new EntityExistsException("Two factor code has already been sent");
                }
            }

            var authenticationResponseDto = new AuthenticationResponseDto
            {
                AccessToken = GenerateAccessToken(user),
                RefreshToken = GenerateRefreshToken(user)
            };

            return authenticationResponseDto;
        }

        public async Task<AuthenticationResponseDto> GoogleLogin(string googleToken)
        {
            var payload = await VerifyGoogleToken(googleToken);
            if (payload == null)
                throw new SecurityTokenException("Invalid Google Token");

            var authenticationResponseDto = new AuthenticationResponseDto();

            var email = payload.Email;
            var existingUser = await _userRepository.GetByEmail(email);
            User newUser = new User();

            if (existingUser == null)
            {
                newUser = new User
                {
                    Email = email,
                    Name = payload.GivenName,
                    Surname = payload.FamilyName,
                    Role = Models.Enums.Role.User,
                    IsDeleted = false,
                    Image = Array.Empty<byte>(),
                };

                //If the user does not exist then we return him but don't save him
                authenticationResponseDto.AccessToken = "";
                authenticationResponseDto.RefreshToken = "";
                authenticationResponseDto.NewUser = newUser;
                return authenticationResponseDto;
            }

            if (existingUser.IsDeleted == true)
                throw new UserDeletedException("User is deleted");
            else if (existingUser.IsVerified == false)
                throw new UserNotVerifiedException("User is not verified");
            else if (existingUser.TwoFactorEnabled == true)
            {
                //If two factor is enabled, check if a two factor code for the user already exists inside the database
                //If it doesn't exist, create a new two factor code and send it to the user
                var existingTwoFactor = await _twoFactorAuthenticationRepository.GetByUserEmailAsync(payload.Email);
                if (existingTwoFactor == null)
                {
                    await _twoFactorAuthenticationService.GenerateAndSendTwoFactorCodeAsync(payload.Email);
                    throw new TwoFactorEnabledException("Two Factor Authentication sent");
                }
                //If the two factor code does exist, first check if its expired
                else
                {
                    //If the code is expired, delete it and send a new one
                    if (existingTwoFactor.ExpirationTime < DateTime.UtcNow)
                    {
                        await _twoFactorAuthenticationService.GenerateAndSendTwoFactorCodeAsync(payload.Email);
                        throw new TwoFactorExpiredException("Two Factor expired, new one sent");
                    }

                    throw new EntityExistsException("Two factor code has already been sent");
                }
            }

            //If the user exists then create the tokens and log him in
            authenticationResponseDto.AccessToken = GenerateAccessToken(existingUser ?? newUser);
            authenticationResponseDto.RefreshToken = GenerateRefreshToken(existingUser ?? newUser);
            authenticationResponseDto.NewUser = null;


            return authenticationResponseDto; ;
        }

        public async Task<UserResponseDto> GetMe()
        {
            var email = "";
            if (_httpContextAccessor.HttpContext != null)
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(email))
                throw new SecurityTokenException("Token invalid");


            var user = await _userRepository.GetByEmail(email);

            if (user == null)
                throw new EntityNotFoundException($"User with email '{email}' was not found.");

            UserResponseDto userResponse = _mapper.Map<UserResponseDto>(user);
            userResponse.Image = Convert.ToBase64String(user.Image);

            return userResponse;
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new List<string> { "158219373742-gfbebtft5b3513a3nue58atin351fidi.apps.googleusercontent.com" }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }

        public string GenerateAccessToken(User user)
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

        public string GenerateRefreshToken(User user)
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

        public async Task<string> RefreshAccessToken(string refreshToken)
        {
            try
            { 
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                Console.WriteLine(_configuration["Jwt:Issuer"]);
                Console.WriteLine(_configuration["Jwt:Audience"]);

                var claimsPrincipal = _tokenHandler.ValidateToken(refreshToken, tokenValidationParameters, out SecurityToken validatedToken);

                if (!(validatedToken is JwtSecurityToken jwtToken) || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token");
                }

                var email = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    throw new SecurityTokenException("Invalid token");
                }

                var user = await _userRepository.GetByEmail(email);

                if (user == null)
                {
                    throw new SecurityTokenException("User not found");
                }

                return GenerateAccessToken(user);
            }
            catch (Exception ex)
            {
                throw new SecurityTokenException("Invalid refresh token", ex);
            }
        }
    }
}
