using System.Security.Claims;
using CryptoAdvisor.Api.Data;
using CryptoAdvisor.Api.DTOs;
using CryptoAdvisor.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CryptoAdvisor.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PreferencesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PreferencesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPreferences()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            var preference = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);
            
            if (preference == null)
            {
                return NotFound("Preferences not found.");
            }

            var dto = new PreferenceDto
            {
                InterestedAssets = preference.InterestedAssets,
                InvestorType = preference.InvestorType,
                PreferredContent = preference.PreferredContent
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePreferences([FromBody] PreferenceDto request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            var preference = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);

            if (preference == null)
            {
                preference = new UserPreference
                {
                    UserId = userId
                };
                _context.UserPreferences.Add(preference);
            }

            preference.InterestedAssets = request.InterestedAssets;
            preference.InvestorType = request.InvestorType;
            preference.PreferredContent = request.PreferredContent;
            preference.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Preferences updated successfully." });
        }
    }
}
