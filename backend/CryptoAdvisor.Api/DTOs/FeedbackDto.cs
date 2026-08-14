namespace CryptoAdvisor.Api.DTOs
{
    public class FeedbackDto
    {
        public string ContentType { get; set; } = string.Empty;
        public string ContentReference { get; set; } = string.Empty;
        public bool IsPositive { get; set; }
    }
}
