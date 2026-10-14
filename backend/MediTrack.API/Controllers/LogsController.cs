using System.Security.Claims;
using MediTrack.API.Models.DTOs.Log;
using MediTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly ILogService _logService;

    public LogsController(ILogService logService)
    {
        _logService = logService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLogDto dto)
    {
        var result = await _logService.CreateAsync(GetUserId(), dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetByDate([FromQuery] DateOnly date)
    {
        var result = await _logService.GetByDateAsync(GetUserId(), date);
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] int days = 30)
    {
        var result = await _logService.GetHistoryAsync(GetUserId(), days);
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _logService.GetStatsAsync(GetUserId());
        return Ok(result);
    }
}
