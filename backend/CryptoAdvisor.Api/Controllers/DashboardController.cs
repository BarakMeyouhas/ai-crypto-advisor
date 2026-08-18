using System.Security.Claims;
using CryptoAdvisor.Api.Data;
using CryptoAdvisor.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CryptoAdvisor.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IDashboardService _dashboardService;

        public DashboardController(AppDbContext context, IDashboardService dashboardService)
        {
            _context = context;
            _dashboardService = dashboardService;
        }

        [HttpGet("insight")]
        public async Task<IActionResult> GetInsight()
        {
            var userId = GetUserId();
            var preference = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);
            if (preference == null) return NotFound("Preferences not found.");

            var insight = await _dashboardService.GetInsightAsync(preference);
            return Ok(new { insight });
        }

        [HttpGet("news")]
        public async Task<IActionResult> GetNews()
        {
            var userId = GetUserId();

            var preference = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);
            if (preference == null) return NotFound("User preferences not found.");

            var news = await _dashboardService.GetNewsAsync(preference);
            return Ok(news);
        }

        [HttpGet("meme")]
        public async Task<IActionResult> GetMeme()
        {
            var userId = GetUserId();

            var preference = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);

            var memeResult = await _dashboardService.GetMemeAsync(preference!);
            return Ok(memeResult);
        }
        [HttpPost("feedback")]
        public async Task<IActionResult> SubmitFeedback([FromBody] DTOs.FeedbackDto feedbackDto)
        {
            var userId = GetUserId();

            var feedback = new Models.ContentFeedback
            {
                UserId = userId,
                ContentType = feedbackDto.ContentType,
                ContentReference = feedbackDto.ContentReference,
                IsPositive = feedbackDto.IsPositive
            };

            _context.ContentFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback recorded successfully." });
        }
    }
}
