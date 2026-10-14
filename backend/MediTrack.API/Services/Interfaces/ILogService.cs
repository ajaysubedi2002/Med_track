using MediTrack.API.Models.DTOs.Log;

namespace MediTrack.API.Services.Interfaces;

public interface ILogService
{
    Task<LogResponseDto> CreateAsync(Guid userId, CreateLogDto dto);
    Task<List<LogResponseDto>> GetByDateAsync(Guid userId, DateOnly date);
    Task<List<LogResponseDto>> GetHistoryAsync(Guid userId, int days);
    Task<StatsResponseDto> GetStatsAsync(Guid userId);
}
