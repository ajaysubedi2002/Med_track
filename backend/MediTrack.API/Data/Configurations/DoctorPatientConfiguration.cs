using MediTrack.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MediTrack.API.Data.Configurations;

public class DoctorPatientConfiguration : IEntityTypeConfiguration<DoctorPatient>
{
    public void Configure(EntityTypeBuilder<DoctorPatient> builder)
    {
        builder.ToTable("doctor_patients");
        builder.HasKey(dp => new { dp.DoctorId, dp.PatientId });

        builder.Property(dp => dp.AssignedAt)
            .IsRequired()
            .HasDefaultValueSql("now()");

        builder.HasOne(dp => dp.Doctor)
            .WithMany(u => u.MyPatients)
            .HasForeignKey(dp => dp.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(dp => dp.Patient)
            .WithMany(u => u.MyDoctors)
            .HasForeignKey(dp => dp.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(dp => dp.DoctorId);
    }
}
