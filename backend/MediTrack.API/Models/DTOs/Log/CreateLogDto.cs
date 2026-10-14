using System.ComponentModel.DataAnnotations;
using MediTrack.API.Models.Enums;

namespace MediTrack.API.Models.DTOs.Log;

public class CreateLogDto
{
    [Required]
    public Guid MedicineId { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public LogStatus Status { get; set; }

    [Range(1, 5)]
    public int? Mood { get; set; }

    public string? Symptoms { get; set; }
    public string? Notes { get; set; }
}
