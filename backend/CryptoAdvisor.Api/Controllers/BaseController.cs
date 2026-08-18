using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace CryptoAdvisor.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseController : ControllerBase
    {
        protected Guid GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid or missing user ID claim.");
            }
            return userId;
        }
    }
}
