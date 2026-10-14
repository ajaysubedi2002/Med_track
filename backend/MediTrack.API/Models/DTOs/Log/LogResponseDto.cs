using MediTrack.API.Models.Enums;

namespace MediTrack.API.Models.DTOs.Log;

public class LogResponseDto
{
    public Guid Id { get; set; }
    public Guid MedicineId { get; set; }
    public string MedicineName { get; set; } = string.Empty;
    public string MedicineDosage { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public LogStatus Status { get; set; }
    public string StatusText { get; set; } = string.Empty;
    public int? Mood { get; set; }
    public string? Symptoms { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
