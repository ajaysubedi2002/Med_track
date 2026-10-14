using MediTrack.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MediTrack.API.Data.Configurations;

public class MedicineConfiguration : IEntityTypeConfiguration<Medicine>
{
    public void Configure(EntityTypeBuilder<Medicine> builder)
    {
        builder.ToTable("medicines");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(m => m.Name).HasMaxLength(150).IsRequired();
        builder.Property(m => m.Dosage).HasMaxLength(50).IsRequired();
        builder.Property(m => m.Frequency).IsRequired();
        builder.Property(m => m.TimeOfDay).HasMaxLength(50);
        builder.Property(m => m.IsActive).HasDefaultValue(true);
        builder.Property(m => m.CreatedAt).HasDefaultValueSql("now()");
        builder.Property(m => m.UpdatedAt).HasDefaultValueSql("now()");

        builder.HasOne(m => m.User)
            .WithMany(u => u.Medicines)
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
