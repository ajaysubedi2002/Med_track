using System.Security.Claims;
using MediTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[Authorize(Roles = "Doctor")]
[ApiController]
[Route("api/doctor")]
public class DoctorController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>GET /api/doctor/dashboard</summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var result = await _doctorService.GetPatientDashboardAsync(GetUserId());
        return Ok(result);
    }

    /// <summary>GET /api/doctor/patients</summary>
    [HttpGet("patients")]
    public async Task<IActionResult> GetMyPatients()
    {
        var result = await _doctorService.GetMyPatientsAsync(GetUserId());
        return Ok(result);
    }

    /// <summary>GET /api/doctor/patients/search?q=</summary>
    [HttpGet("patients/search")]
    public async Task<IActionResult> SearchPatients([FromQuery] string? q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Trim().Length > 100)
            return BadRequest(new { error = "Query parameter 'q' must be between 1 and 100 non-whitespace characters." });

        var result = await _doctorService.SearchPatientsAsync(GetUserId(), q);
        return Ok(result);
    }

    /// <summary>POST /api/doctor/patients/{patientId}</summary>
    [HttpPost("patients/{patientId:guid}")]
    public async Task<IActionResult> AddPatient(Guid patientId)
    {
        var result = await _doctorService.AddPatientAsync(GetUserId(), patientId);
        return Ok(result);
    }

    /// <summary>DELETE /api/doctor/patients/{patientId}</summary>
    [HttpDelete("patients/{patientId:guid}")]
    public async Task<IActionResult> RemovePatient(Guid patientId)
    {
        await _doctorService.RemovePatientAsync(GetUserId(), patientId);
        return NoContent();
    }
}
