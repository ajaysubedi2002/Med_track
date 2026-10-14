using MediTrack.API.Models.DTOs.Auth;

namespace MediTrack.API.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserDto> GetCurrentUserAsync(Guid userId);
}
