using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SMM.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        var email = User.FindFirstValue(
            ClaimTypes.Email
        );

        return Ok(new
        {
            userId,
            email
        });
    }
}