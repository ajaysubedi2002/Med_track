using MediTrack.API.Models.Enums;

namespace MediTrack.API.Models.Entities;

public class DailyLog : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid MedicineId { get; set; }
    public DateOnly Date { get; set; }
    public LogStatus Status { get; private set; }
    public int? Mood { get; set; }
    public string? Symptoms { get; set; }
    public string? Notes { get; set; }

    public User User { get; set; } = null!;
    public Medicine Medicine { get; set; } = null!;

    public void MarkAsTaken() => Status = LogStatus.Taken;
    public void MarkAsMissed() => Status = LogStatus.Missed;
    public void MarkAsSkipped() => Status = LogStatus.Skipped;
    public void SetStatus(LogStatus status) => Status = status;
}
