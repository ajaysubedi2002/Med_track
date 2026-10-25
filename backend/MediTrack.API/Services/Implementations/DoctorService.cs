using MediTrack.API.Data;
using MediTrack.API.Middleware;
using MediTrack.API.Models.DTOs.Doctor;
using MediTrack.API.Models.Entities;
using MediTrack.API.Models.Enums;
using MediTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services.Implementations;

public class DoctorService : IDoctorService
{
    private readonly AppDbContext _db;

    public DoctorService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<PatientSearchResultDto>> SearchPatientsAsync(Guid doctorId, string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            throw new InvalidOperationException("Search query cannot be empty.");

        var trimmed = query.Trim();
        var pattern = $"%{trimmed}%";

        return await _db.Users
            .Where(u => u.Role == UserRole.Patient &&
                        (EF.Functions.ILike(u.Name, pattern) ||
                         EF.Functions.ILike(u.Email, pattern)))
            .OrderBy(u => u.Name)
            .Take(50)
            .Select(u => new PatientSearchResultDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Phone = u.Phone
            })
            .ToListAsync();
    }

    public async Task<PatientSummaryDto> AddPatientAsync(Guid doctorId, Guid patientId)
    {
        var patient = await _db.Users.FindAsync(patientId)
            ?? throw new KeyNotFoundException("Patient not found.");

        if (patient.Role != UserRole.Patient)
            throw new InvalidOperationException("The specified user is not a patient.");

        var alreadyLinked = await _db.DoctorPatients
            .AnyAsync(dp => dp.DoctorId == doctorId && dp.PatientId == patientId);

        if (alreadyLinked)
            throw new ConflictException("This patient is already under your care.");

        var link = new DoctorPatient
        {
            DoctorId = doctorId,
            PatientId = patientId,
            AssignedAt = DateTime.UtcNow
        };

        _db.DoctorPatients.Add(link);
        await _db.SaveChangesAsync();

        return new PatientSummaryDto
        {
            Id = patient.Id,
            Name = patient.Name,
            Email = patient.Email,
            Phone = patient.Phone,
            AssignedAt = link.AssignedAt
        };
    }

    public async Task RemovePatientAsync(Guid doctorId, Guid patientId)
    {
        var link = await _db.DoctorPatients
            .FirstOrDefaultAsync(dp => dp.DoctorId == doctorId && dp.PatientId == patientId)
            ?? throw new KeyNotFoundException("Patient is not under your care.");

        _db.DoctorPatients.Remove(link);
        await _db.SaveChangesAsync();
    }

    public async Task<List<PatientSummaryDto>> GetMyPatientsAsync(Guid doctorId)
    {
        return await _db.DoctorPatients
            .Where(dp => dp.DoctorId == doctorId)
            .OrderByDescending(dp => dp.AssignedAt)
            .Select(dp => new PatientSummaryDto
            {
                Id = dp.Patient.Id,
                Name = dp.Patient.Name,
                Email = dp.Patient.Email,
                Phone = dp.Patient.Phone,
                AssignedAt = dp.AssignedAt
            })
            .ToListAsync();
    }

    public async Task<List<PatientDashboardItemDto>> GetPatientDashboardAsync(Guid doctorId)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        // 7 calendar days prior (T-7 through T-1, today excluded)
        var weekStart = today.AddDays(-7);
        var weekEnd = today.AddDays(-1);

        // Load all assigned patients with their medicines and logs in one query batch
        var assignments = await _db.DoctorPatients
            .Where(dp => dp.DoctorId == doctorId)
            .Include(dp => dp.Patient)
            .ToListAsync();

        var result = new List<PatientDashboardItemDto>();

        foreach (var assignment in assignments)
        {
            var patient = assignment.Patient;

            // Active medicines for this patient
            var activeMedicines = await _db.Medicines
                .Where(m => m.UserId == patient.Id && m.IsActive)
                .ToListAsync();

            // Today's logs
            var todayLogs = await _db.DailyLogs
                .Where(l => l.UserId == patient.Id && l.Date == today)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            // Last 7 days logs (T-7 to T-1)
            var weekLogs = await _db.DailyLogs
                .Where(l => l.UserId == patient.Id && l.Date >= weekStart && l.Date <= weekEnd)
                .ToListAsync();

            // Compute MissedToday: any active medicine with no Taken log today
            var takenMedicineIdsToday = todayLogs
                .Where(l => l.Status == LogStatus.Taken)
                .Select(l => l.MedicineId)
                .ToHashSet();

            var missedMedsToday = activeMedicines
                .Where(m => !takenMedicineIdsToday.Contains(m.Id))
                .Select(m => m.Name)
                .ToList();

            bool missedToday = missedMedsToday.Count > 0;

            // Compute TodayMood: most recent log with a mood value today
            var todayMood = todayLogs
                .FirstOrDefault(l => l.Mood.HasValue)?.Mood;

            // Compute AdherenceLast7Days
            double adherence = 0.0;
            if (weekLogs.Count > 0)
            {
                var takenCount = weekLogs.Count(l => l.Status == LogStatus.Taken);
                adherence = Math.Round((double)takenCount / weekLogs.Count * 100, 1);
            }

            result.Add(new PatientDashboardItemDto
            {
                PatientId = patient.Id,
                Name = patient.Name,
                Email = patient.Email,
                Phone = patient.Phone,
                MissedToday = missedToday,
                TodayMood = todayMood,
                AdherenceLast7Days = adherence,
                MissedMedicationsToday = missedMedsToday
            });
        }

        return result;
    }
}
