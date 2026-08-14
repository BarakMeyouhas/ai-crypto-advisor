namespace CryptoAdvisor.Api.Models
{
    public class UserPreference
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid UserId { get; set; }
        public User? User { get; set; }

        public List<string> InterestedAssets { get; set; } = new();
        public string InvestorType { get; set; } = string.Empty;
        public List<string> PreferredContent { get; set; } = new();
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
