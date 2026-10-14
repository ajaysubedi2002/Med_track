using MediTrack.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Medicine> Medicines => Set<Medicine>();
    public DbSet<DailyLog> DailyLogs => Set<DailyLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
