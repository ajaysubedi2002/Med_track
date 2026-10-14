namespace MediTrack.API.Models.DTOs.Log;

public class StatsResponseDto
{
    public int TotalMedicines { get; set; }
    public int TotalLogs { get; set; }
    public double AdherencePercent { get; set; }
    public int CurrentStreak { get; set; }
    public StatusBreakdown AllTime { get; set; } = new();
    public StatusBreakdown ThisWeek { get; set; } = new();
}

public class StatusBreakdown
{
    public int Taken { get; set; }
    public int Missed { get; set; }
    public int Skipped { get; set; }
}
