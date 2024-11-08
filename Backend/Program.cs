using Backend.Data;
using Backend.Mappings;
using Backend.Repositories.UserRepository;
using Backend.Services.AuthService;
using Backend.Services.EmailService;
using Backend.Services.UserService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Text;

using DotNetEnv;
using Backend.Repositories.EmailVerificationCodeRepository;
using Backend.Services.EmailVerificationService;
using Backend.Repositories.TwoFactorAuthenticationRepository;
using Backend.Services.TwoFactorAuthenticationService;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

builder.Services.AddControllers();
builder.Services.AddSingleton<JwtSecurityTokenHandler>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ClockSkew = TimeSpan.Zero,
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated for " + context.Principal.Identity.Name);
            return Task.CompletedTask;
        }
    };
})
.AddGoogle(options =>
{
    options.ClientId = "158219373742-gfbebtft5b3513a3nue58atin351fidi.apps.googleusercontent.com";
    options.ClientSecret = "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";
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailVerificationRepository, EmailVerificationRepository>();
builder.Services.AddScoped<ITwoFactorAuthenticationRepository, TwoFactorAuthenticationRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEmailVerificationService, EmailVerificationService>();
builder.Services.AddScoped<ITwoFactorAuthenticationService, TwoFactorAuthenticationService>();


builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSingleton<SmtpClient>(provider =>
{
    var client = new SmtpClient("smtp.gmail.com");
    client.Port = 587;
    client.Credentials = new NetworkCredential(
        Environment.GetEnvironmentVariable("SMTP_USERNAME"),
        Environment.GetEnvironmentVariable("SMTP_PASSWORD")
    );
    client.EnableSsl = true;
    return client;
});

builder.Services.AddSwaggerGen(options =>
{

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteReact",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
    options.AddPolicy("AllowGoogleOAuth", builder =>
    {
        builder.WithOrigins("https://accounts.google.com")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowViteReact");
app.UseCors("AllowGoogleOAuth");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
