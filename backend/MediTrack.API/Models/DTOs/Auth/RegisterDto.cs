using System.ComponentModel.DataAnnotations;

namespace MediTrack.API.Models.DTOs.Auth;

public class RegisterDto
{
    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6), MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(20)]
    [RegularExpression(@"^[0-9 \+\-\(\)]*$",
        ErrorMessage = "Phone may only contain digits, spaces, +, -, ( and ).")]
    public string? Phone { get; set; }
}
