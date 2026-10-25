using MediTrack.API.Models.DTOs.Doctor;

namespace MediTrack.API.Services.Interfaces;

public interface IDoctorService
{
    Task<List<PatientSearchResultDto>> SearchPatientsAsync(Guid doctorId, string query);
    Task<PatientSummaryDto> AddPatientAsync(Guid doctorId, Guid patientId);
    Task RemovePatientAsync(Guid doctorId, Guid patientId);
    Task<List<PatientSummaryDto>> GetMyPatientsAsync(Guid doctorId);
    Task<List<PatientDashboardItemDto>> GetPatientDashboardAsync(Guid doctorId);
}
