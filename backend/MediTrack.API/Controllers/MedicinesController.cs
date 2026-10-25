using System.Security.Claims;
using MediTrack.API.Models.DTOs.Medicine;
using MediTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly IMedicineService _medicineService;

    public MedicinesController(IMedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _medicineService.GetAllAsync(GetUserId());
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _medicineService.GetByIdAsync(GetUserId(), id);
        return Ok(result);
    }

    // Only Doctor or Admin can create medicines directly
    [Authorize(Roles = "Doctor,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMedicineDto dto)
    {
        var result = await _medicineService.CreateAsync(GetUserId(), dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Roles = "Doctor,Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMedicineDto dto)
    {
        var result = await _medicineService.UpdateAsync(GetUserId(), id, dto);
        return Ok(result);
    }

    [Authorize(Roles = "Doctor,Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _medicineService.DeactivateAsync(GetUserId(), id);
        return NoContent();
    }
}

// Separate controller for doctor prescribing to a patient
[Authorize(Roles = "Doctor")]
[ApiController]
[Route("api/patients/{patientId:guid}/medicines")]
public class PatientMedicinesController : ControllerBase
{
    private readonly IMedicineService _medicineService;

    public PatientMedicinesController(IMedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Prescribe(Guid patientId, [FromBody] CreateMedicineDto dto)
    {
        var result = await _medicineService.PrescribeAsync(GetUserId(), patientId, dto);
        return CreatedAtAction(nameof(Prescribe), new { patientId, id = result.Id }, result);
    }
}
