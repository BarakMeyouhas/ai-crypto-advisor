namespace CryptoAdvisor.Api.DTOs
{
    public class PreferenceDto
    {
        public List<string> InterestedAssets { get; set; } = new();
        public string InvestorType { get; set; } = string.Empty;
        public List<string> PreferredContent { get; set; } = new();
    }
}
