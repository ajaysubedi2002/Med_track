using MediTrack.API.Models.Entities;
using MediTrack.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MediTrack.API.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(u => u.Email).HasMaxLength(255).IsRequired();
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.PasswordHash).HasMaxLength(255).IsRequired();
        builder.Property(u => u.Name).HasMaxLength(100).IsRequired();
        builder.Property(u => u.Phone).HasMaxLength(20);
        builder.Property(u => u.Role)
            .IsRequired()
            .HasDefaultValue(UserRole.Patient)
            .HasSentinel(UserRole.Patient);
        builder.Property(u => u.CreatedAt).HasDefaultValueSql("now()");

        // Seed admin user
        // Password: Admin@123
        var adminId = new Guid("11111111-1111-1111-1111-111111111111");
        builder.HasData(new
        {
            Id = adminId,
            Email = "admin@meditrack.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Name = "Admin",
            Phone = (string?)null,
            Role = UserRole.Admin,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }
}
