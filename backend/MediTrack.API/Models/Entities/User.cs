using MediTrack.API.Models.Enums;

namespace MediTrack.API.Models.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.Patient;

    public ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
    public ICollection<DailyLog> DailyLogs { get; set; } = new List<DailyLog>();
    public ICollection<DoctorPatient> MyPatients { get; set; } = new List<DoctorPatient>();
    public ICollection<DoctorPatient> MyDoctors { get; set; } = new List<DoctorPatient>();

    public void SetPassword(string hash)
    {
        PasswordHash = hash;
    }
}
