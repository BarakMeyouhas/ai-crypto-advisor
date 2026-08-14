using CryptoAdvisor.Api.Models;

namespace CryptoAdvisor.Api.Services
{
    public interface IDashboardService
    {
        Task<string> GetInsightAsync(UserPreference preference);
        Task<object> GetNewsAsync(UserPreference preference);
        Task<CryptoAdvisor.Api.DTOs.MemeResultDto> GetMemeAsync(UserPreference preference);
    }
}
