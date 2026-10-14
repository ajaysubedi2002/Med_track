using MediTrack.API.Models.Entities;
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
        builder.Property(u => u.CreatedAt).HasDefaultValueSql("now()");
    }
}
