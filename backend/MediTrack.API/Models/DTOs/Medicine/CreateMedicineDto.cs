using System.ComponentModel.DataAnnotations;
using MediTrack.API.Models.Enums;

namespace MediTrack.API.Models.DTOs.Medicine;

public class CreateMedicineDto
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Dosage { get; set; } = string.Empty;

    [Required]
    public Frequency Frequency { get; set; }

    [MaxLength(50)]
    public string? TimeOfDay { get; set; }
}
