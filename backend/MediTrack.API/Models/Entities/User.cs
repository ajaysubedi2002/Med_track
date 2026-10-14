namespace MediTrack.API.Models.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
    public ICollection<DailyLog> DailyLogs { get; set; } = new List<DailyLog>();

    public void SetPassword(string hash)
    {
        PasswordHash = hash;
    }
}
