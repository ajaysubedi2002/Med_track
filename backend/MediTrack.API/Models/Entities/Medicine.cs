using MediTrack.API.Models.Enums;

namespace MediTrack.API.Models.Entities;

public class Medicine : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public Frequency Frequency { get; set; }
    public string? TimeOfDay { get; set; }
    public bool IsActive { get; private set; } = true;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<DailyLog> DailyLogs { get; set; } = new List<DailyLog>();

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
