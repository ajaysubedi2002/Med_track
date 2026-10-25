using MediTrack.API.Models.Enums;

namespace MediTrack.API.Models.DTOs.Medicine;

public class MedicineResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public Frequency Frequency { get; set; }
    public string FrequencyText { get; set; } = string.Empty;
    public string? TimeOfDay { get; set; }
    public bool IsActive { get; set; }
    public Guid? PrescribedByDoctorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
