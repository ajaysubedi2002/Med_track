namespace MediTrack.API.Models.Entities;

public class DoctorPatient
{
    public Guid DoctorId { get; set; }
    public Guid PatientId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public User Doctor { get; set; } = null!;
    public User Patient { get; set; } = null!;
}
