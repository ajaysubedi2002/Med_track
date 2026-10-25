namespace MediTrack.API.Models.DTOs.Doctor;

public class PatientSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime AssignedAt { get; set; }
}
