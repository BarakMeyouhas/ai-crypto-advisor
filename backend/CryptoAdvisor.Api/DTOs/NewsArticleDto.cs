namespace CryptoAdvisor.Api.DTOs
{
    public class NewsArticleDto
    {
        public string Title { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string RelatedAsset { get; set; } = string.Empty;
        public string InvestorType { get; set; } = string.Empty;
    }
}
