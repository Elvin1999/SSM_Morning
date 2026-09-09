using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SMM.Application.Auth.DTOs;
using SMM.Application.Auth.Interfaces;
using SMM.Domain.Entities;

namespace SMM.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(
        UserManager<AppUser> userManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request)
    {
        var existingEmail =
            await _userManager.FindByEmailAsync(request.Email);

        if (existingEmail is not null)
        {
            return BadRequest(new
            {
                message = "Email is already registered."
            });
        }

        var existingUserName =
            await _userManager.FindByNameAsync(request.UserName);

        if (existingUserName is not null)
        {
            return BadRequest(new
            {
                message = "Username is already taken."
            });
        }

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(
            user,
            request.Password
        );

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                errors = result.Errors.Select(x => x.Description)
            });
        }

        var tokenResult =
            await _tokenService.CreateTokenAsync(user);

        return Ok(new AuthResponse
        {
            UserId = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AccessToken = tokenResult.Token,
            ExpiresAt = tokenResult.ExpiresAt
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(
        LoginRequest request)
    {
        var user =
            await _userManager.FindByEmailAsync(request.Email);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var passwordValid =
            await _userManager.CheckPasswordAsync(
                user,
                request.Password
            );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var tokenResult =
            await _tokenService.CreateTokenAsync(user);

        return Ok(new AuthResponse
        {
            UserId = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AccessToken = tokenResult.Token,
            ExpiresAt = tokenResult.ExpiresAt
        });
    }
}