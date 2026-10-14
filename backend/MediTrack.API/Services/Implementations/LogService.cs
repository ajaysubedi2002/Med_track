using MediTrack.API.Data;
using MediTrack.API.Models.DTOs.Log;
using MediTrack.API.Models.Entities;
using MediTrack.API.Models.Enums;
using MediTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services.Implementations;

public class LogService : ILogService
{
    private readonly AppDbContext _db;

    public LogService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<LogResponseDto> CreateAsync(Guid userId, CreateLogDto dto)
    {
        var medicine = await _db.Medicines
            .FirstOrDefaultAsync(m => m.Id == dto.MedicineId && m.UserId == userId)
            ?? throw new KeyNotFoundException("Medicine not found.");

        var existing = await _db.DailyLogs
            .FirstOrDefaultAsync(l => l.MedicineId == dto.MedicineId && l.Date == dto.Date);

        if (existing != null)
        {
            existing.SetStatus(dto.Status);
            existing.Mood = dto.Mood;
            existing.Symptoms = dto.Symptoms;
            existing.Notes = dto.Notes;
            await _db.SaveChangesAsync();
            return MapToDto(existing, medicine);
        }

        var log = new DailyLog
        {
            UserId = userId,
            MedicineId = dto.MedicineId,
            Date = dto.Date,
            Mood = dto.Mood,
            Symptoms = dto.Symptoms,
            Notes = dto.Notes
        };
        log.SetStatus(dto.Status);

        _db.DailyLogs.Add(log);
        await _db.SaveChangesAsync();

        return MapToDto(log, medicine);
    }

    public async Task<List<LogResponseDto>> GetByDateAsync(Guid userId, DateOnly date)
    {
        return await _db.DailyLogs
            .Include(l => l.Medicine)
            .Where(l => l.UserId == userId && l.Date == date)
            .OrderBy(l => l.Medicine.Name)
            .Select(l => new LogResponseDto
            {
                Id = l.Id,
                MedicineId = l.MedicineId,
                MedicineName = l.Medicine.Name,
                MedicineDosage = l.Medicine.Dosage,
                Date = l.Date,
                Status = l.Status,
                StatusText = l.Status.ToString(),
                Mood = l.Mood,
                Symptoms = l.Symptoms,
                Notes = l.Notes,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<LogResponseDto>> GetHistoryAsync(Guid userId, int days)
    {
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-days));

        return await _db.DailyLogs
            .Include(l => l.Medicine)
            .Where(l => l.UserId == userId && l.Date >= startDate)
            .OrderByDescending(l => l.Date)
            .ThenBy(l => l.Medicine.Name)
            .Select(l => new LogResponseDto
            {
                Id = l.Id,
                MedicineId = l.MedicineId,
                MedicineName = l.Medicine.Name,
                MedicineDosage = l.Medicine.Dosage,
                Date = l.Date,
                Status = l.Status,
                StatusText = l.Status.ToString(),
                Mood = l.Mood,
                Symptoms = l.Symptoms,
                Notes = l.Notes,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<StatsResponseDto> GetStatsAsync(Guid userId)
    {
        var totalMedicines = await _db.Medicines
            .CountAsync(m => m.UserId == userId && m.IsActive);

        var allLogs = await _db.DailyLogs
            .Where(l => l.UserId == userId)
            .ToListAsync();

        var weekStart = DateOnly.FromDateTime(
            DateTime.UtcNow.AddDays(-(int)DateTime.UtcNow.DayOfWeek));
        var weekLogs = allLogs.Where(l => l.Date >= weekStart).ToList();

        var totalLogs = allLogs.Count;
        var takenCount = allLogs.Count(l => l.Status == LogStatus.Taken);
        var adherence = totalLogs > 0
            ? Math.Round((double)takenCount / totalLogs * 100, 1)
            : 0;

        var streak = await CalculateStreakAsync(userId);

        return new StatsResponseDto
        {
            TotalMedicines = totalMedicines,
            TotalLogs = totalLogs,
            AdherencePercent = adherence,
            CurrentStreak = streak,
            AllTime = new StatusBreakdown
            {
                Taken = takenCount,
                Missed = allLogs.Count(l => l.Status == LogStatus.Missed),
                Skipped = allLogs.Count(l => l.Status == LogStatus.Skipped)
            },
            ThisWeek = new StatusBreakdown
            {
                Taken = weekLogs.Count(l => l.Status == LogStatus.Taken),
                Missed = weekLogs.Count(l => l.Status == LogStatus.Missed),
                Skipped = weekLogs.Count(l => l.Status == LogStatus.Skipped)
            }
        };
    }

    private async Task<int> CalculateStreakAsync(Guid userId)
    {
        var activeMedicineCount = await _db.Medicines
            .CountAsync(m => m.UserId == userId && m.IsActive);

        if (activeMedicineCount == 0) return 0;

        var logs = await _db.DailyLogs
            .Where(l => l.UserId == userId)
            .GroupBy(l => l.Date)
            .Select(g => new
            {
                Date = g.Key,
                TakenCount = g.Count(l => l.Status == LogStatus.Taken),
                TotalCount = g.Count()
            })
            .OrderByDescending(g => g.Date)
            .ToListAsync();

        int streak = 0;
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        for (int i = 0; i < logs.Count; i++)
        {
            var expectedDate = today.AddDays(-i);
            var dayLog = logs.FirstOrDefault(l => l.Date == expectedDate);

            if (dayLog == null || dayLog.TakenCount < dayLog.TotalCount)
                break;

            streak++;
        }

        return streak;
    }

    private static LogResponseDto MapToDto(DailyLog log, Medicine medicine)
    {
        return new LogResponseDto
        {
            Id = log.Id,
            MedicineId = log.MedicineId,
            MedicineName = medicine.Name,
            MedicineDosage = medicine.Dosage,
            Date = log.Date,
            Status = log.Status,
            StatusText = log.Status.ToString(),
            Mood = log.Mood,
            Symptoms = log.Symptoms,
            Notes = log.Notes,
            CreatedAt = log.CreatedAt
        };
    }
}
