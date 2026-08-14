using CryptoAdvisor.Api.Models;

namespace CryptoAdvisor.Api.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public DashboardService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GetInsightAsync(UserPreference preference)
        {
            var apiKey = _configuration["ExternalApis:OpenRouterKey"];
            
            // Static fallback if no API key is provided
            if (string.IsNullOrEmpty(apiKey))
            {
                return $"[MOCK INSIGHT] As a {preference.InvestorType}, keep an eye on {string.Join(", ", preference.InterestedAssets)}. The market is showing interesting consolidation patterns today.";
            }

            try 
            {
                var requestBody = new
                {
                    model = "openrouter/free",
                    messages = new[]
                    {
                        new { role = "system", content = "You are a concise, expert crypto advisor. Explain things in very simple, plain English so a beginner can understand. Avoid complex financial jargon. Do not use markdown. Do not include greetings." },
                        new { role = "user", content = $"The user is a {preference.InvestorType} interested in {string.Join(", ", preference.InterestedAssets ?? new List<string>())}. Provide a personalized, 1-2 sentence insight about their portfolio in simple English." }
                    }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions")
                {
                    Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(requestBody), System.Text.Encoding.UTF8, "application/json")
                };
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    using var document = System.Text.Json.JsonDocument.Parse(jsonString);
                    if (document.RootElement.TryGetProperty("choices", out var choices) && choices.GetArrayLength() > 0)
                    {
                        var message = choices[0].GetProperty("message");
                        if (message.TryGetProperty("content", out var content))
                        {
                            var insight = content.GetString()?.Trim();
                            if (!string.IsNullOrEmpty(insight))
                            {
                                return insight;
                            }
                        }
                    }
                }
            }
            catch
            {
                // Fallback on exception
            }
            
            return $"As a {preference.InvestorType}, keep an eye on {string.Join(", ", preference.InterestedAssets ?? new List<string>())}. The market is showing interesting consolidation patterns today.";
        }

        public async Task<object> GetNewsAsync(UserPreference preference)
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "newsFallback.json");
                if (File.Exists(filePath))
                {
                    var jsonString = await File.ReadAllTextAsync(filePath);
                    var allArticles = System.Text.Json.JsonSerializer.Deserialize<List<CryptoAdvisor.Api.DTOs.NewsArticleDto>>(jsonString, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (allArticles != null)
                    {
                        var filtered = new List<CryptoAdvisor.Api.DTOs.NewsArticleDto>();
                        if (preference != null)
                        {
                            filtered = allArticles
                                .Where(a => 
                                    (preference.InterestedAssets != null && preference.InterestedAssets.Any(asset => string.Equals(a.RelatedAsset, asset, StringComparison.OrdinalIgnoreCase))) ||
                                    string.Equals(a.InvestorType, preference.InvestorType, StringComparison.OrdinalIgnoreCase)
                                )
                                .ToList();
                        }

                        // If user has no assets or no matches, return general news
                        if (!filtered.Any())
                        {
                            filtered = allArticles;
                        }

                        // Randomly select 1 article so it's fresh each time
                        return filtered.OrderBy(x => Guid.NewGuid()).Take(1).ToList();
                    }
                }
            }
            catch
            {
                // Fallback handled below on exception
            }

            // Ultimate static fallback just in case the JSON file is missing
            return new List<object>
            {
                new { title = "Bitcoin surges past previous resistance", domain = "coindesk.com", url = "#" }
            };
        }

        public async Task<CryptoAdvisor.Api.DTOs.MemeResultDto> GetMemeAsync(UserPreference preference)
        {
            var result = new CryptoAdvisor.Api.DTOs.MemeResultDto
            {
                MemeUrl = "https://i.imgflip.com/1ur9b0.jpg", // A valid fallback meme url
                Subreddit = "cryptocurrencymemes",
                RelatedAsset = "general crypto"
            };

            try
            {
                var response = await _httpClient.GetAsync("https://meme-api.com/gimme/cryptocurrencymemes");
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    using var document = System.Text.Json.JsonDocument.Parse(jsonString);
                    
                    if (document.RootElement.TryGetProperty("url", out var urlElement))
                    {
                        var url = urlElement.GetString();
                        if (!string.IsNullOrEmpty(url))
                        {
                            result.MemeUrl = url;
                            return result;
                        }
                    }
                }
            }
            catch
            {
                // Fallback handled below
            }
            
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "memesFallback.json");
                if (File.Exists(filePath))
                {
                    var jsonString = await File.ReadAllTextAsync(filePath);
                    var allMemes = System.Text.Json.JsonSerializer.Deserialize<List<CryptoAdvisor.Api.DTOs.MemeResultDto>>(jsonString, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (allMemes != null && allMemes.Any())
                    {
                        var filtered = new List<CryptoAdvisor.Api.DTOs.MemeResultDto>();
                        if (preference != null && preference.InterestedAssets != null && preference.InterestedAssets.Any())
                        {
                            filtered = allMemes
                                .Where(m => preference.InterestedAssets.Any(asset => string.Equals(m.RelatedAsset, asset, StringComparison.OrdinalIgnoreCase)))
                                .ToList();
                        }

                        if (!filtered.Any())
                        {
                            filtered = allMemes;
                        }

                        // Pick a random meme from the filtered list
                        var randomMeme = filtered.OrderBy(x => Guid.NewGuid()).FirstOrDefault();
                        if (randomMeme != null)
                        {
                            return randomMeme;
                        }
                    }
                }
            }
            catch
            {
                // Ultimate fallback is the hardcoded result
            }
            
            return result;
        }
    }
}
