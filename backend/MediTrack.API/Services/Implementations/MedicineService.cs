using MediTrack.API.Data;
using MediTrack.API.Models.DTOs.Medicine;
using MediTrack.API.Models.Entities;
using MediTrack.API.Models.Enums;
using MediTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services.Implementations;

public class MedicineService : IMedicineService
{
    private readonly AppDbContext _db;

    public MedicineService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<MedicineResponseDto>> GetAllAsync(Guid userId)
    {
        return await _db.Medicines
            .Where(m => m.UserId == userId && m.IsActive)
            .OrderBy(m => m.Name)
            .Select(m => MapToDto(m))
            .ToListAsync();
    }

    public async Task<MedicineResponseDto> GetByIdAsync(Guid userId, Guid medicineId)
    {
        var medicine = await _db.Medicines
            .FirstOrDefaultAsync(m => m.Id == medicineId && m.UserId == userId)
            ?? throw new KeyNotFoundException("Medicine not found.");

        return MapToDto(medicine);
    }

    public async Task<MedicineResponseDto> CreateAsync(Guid userId, CreateMedicineDto dto)
    {
        var medicine = new Medicine
        {
            UserId = userId,
            Name = dto.Name,
            Dosage = dto.Dosage,
            Frequency = dto.Frequency,
            TimeOfDay = dto.TimeOfDay
        };

        _db.Medicines.Add(medicine);
        await _db.SaveChangesAsync();

        return MapToDto(medicine);
    }

    public async Task<MedicineResponseDto> PrescribeAsync(Guid doctorId, Guid patientId, CreateMedicineDto dto)
    {
        // Verify the doctor-patient relationship exists
        var linkExists = await _db.DoctorPatients
            .AnyAsync(dp => dp.DoctorId == doctorId && dp.PatientId == patientId);

        if (!linkExists)
            throw new UnauthorizedAccessException(
                "You are not assigned as the doctor for this patient.");

        var medicine = new Medicine
        {
            UserId = patientId,
            PrescribedByDoctorId = doctorId,
            Name = dto.Name,
            Dosage = dto.Dosage,
            Frequency = dto.Frequency,
            TimeOfDay = dto.TimeOfDay
        };

        _db.Medicines.Add(medicine);
        await _db.SaveChangesAsync();

        return MapToDto(medicine);
    }

    public async Task<MedicineResponseDto> UpdateAsync(
        Guid userId, Guid medicineId, UpdateMedicineDto dto)
    {
        var medicine = await _db.Medicines
            .FirstOrDefaultAsync(m => m.Id == medicineId && m.UserId == userId)
            ?? throw new KeyNotFoundException("Medicine not found.");

        medicine.Name = dto.Name;
        medicine.Dosage = dto.Dosage;
        medicine.Frequency = dto.Frequency;
        medicine.TimeOfDay = dto.TimeOfDay;
        medicine.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return MapToDto(medicine);
    }

    public async Task DeactivateAsync(Guid userId, Guid medicineId)
    {
        var medicine = await _db.Medicines
            .FirstOrDefaultAsync(m => m.Id == medicineId && m.UserId == userId)
            ?? throw new KeyNotFoundException("Medicine not found.");

        medicine.Deactivate();
        await _db.SaveChangesAsync();
    }

    private static MedicineResponseDto MapToDto(Medicine m)
    {
        return new MedicineResponseDto
        {
            Id = m.Id,
            Name = m.Name,
            Dosage = m.Dosage,
            Frequency = m.Frequency,
            FrequencyText = m.Frequency switch
            {
                Frequency.OnceDaily => "Once Daily",
                Frequency.TwiceDaily => "Twice Daily",
                Frequency.ThreeTimesDaily => "Three Times Daily",
                Frequency.Weekly => "Weekly",
                _ => m.Frequency.ToString()
            },
            TimeOfDay = m.TimeOfDay,
            IsActive = m.IsActive,
            PrescribedByDoctorId = m.PrescribedByDoctorId,
            CreatedAt = m.CreatedAt,
            UpdatedAt = m.UpdatedAt
        };
    }
}
