using MediTrack.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MediTrack.API.Data.Configurations;

public class DailyLogConfiguration : IEntityTypeConfiguration<DailyLog>
{
    public void Configure(EntityTypeBuilder<DailyLog> builder)
    {
        builder.ToTable("daily_logs");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(d => d.Date).IsRequired();
        builder.Property(d => d.Status).IsRequired();
        builder.Property(d => d.Mood);
        builder.Property(d => d.Symptoms);
        builder.Property(d => d.Notes);
        builder.Property(d => d.CreatedAt).HasDefaultValueSql("now()");

        builder.HasIndex(d => new { d.MedicineId, d.Date }).IsUnique();
        builder.HasIndex(d => new { d.UserId, d.Date });

        builder.HasOne(d => d.User)
            .WithMany(u => u.DailyLogs)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.Medicine)
            .WithMany(m => m.DailyLogs)
            .HasForeignKey(d => d.MedicineId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
