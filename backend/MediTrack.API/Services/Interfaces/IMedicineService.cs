using MediTrack.API.Models.DTOs.Medicine;

namespace MediTrack.API.Services.Interfaces;

public interface IMedicineService
{
    Task<List<MedicineResponseDto>> GetAllAsync(Guid userId);
    Task<MedicineResponseDto> GetByIdAsync(Guid userId, Guid medicineId);
    Task<MedicineResponseDto> CreateAsync(Guid userId, CreateMedicineDto dto);
    Task<MedicineResponseDto> UpdateAsync(Guid userId, Guid medicineId, UpdateMedicineDto dto);
    Task DeactivateAsync(Guid userId, Guid medicineId);
}
