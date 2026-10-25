namespace MediTrack.API.Models.DTOs.Doctor;

public class PatientDashboardItemDto
{
    public Guid PatientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool MissedToday { get; set; }
    public int? TodayMood { get; set; }
    public double AdherenceLast7Days { get; set; }
    public List<string> MissedMedicationsToday { get; set; } = new();
}
