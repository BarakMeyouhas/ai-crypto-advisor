namespace CryptoAdvisor.Api.Models
{
    public class ContentFeedback
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public string ContentType { get; set; } = string.Empty;
        public string ContentReference { get; set; } = string.Empty;
        public bool IsPositive { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
