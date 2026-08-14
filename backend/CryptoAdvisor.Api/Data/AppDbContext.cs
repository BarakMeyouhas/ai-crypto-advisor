using CryptoAdvisor.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CryptoAdvisor.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<ContentFeedback> ContentFeedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - UserPreference (1 to 1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Preference)
                .WithOne(p => p.User)
                .HasForeignKey<UserPreference>(p => p.UserId);

            // User - ContentFeedback (1 to many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Feedbacks)
                .WithOne(f => f.User)
                .HasForeignKey(f => f.UserId);
                
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        }
    }
}
