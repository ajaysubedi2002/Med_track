import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { medicineApi, logApi } from "../services/api";
import StatsCard from "../components/dashboard/StatsCard";
import DailyChecklist from "../components/dashboard/DailyChecklist";
import MoodSelector from "../components/dashboard/MoodSelector";
import { CalendarIcon } from "../components/icons";

export default function DashboardPage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    try {
      const [medsRes, logsRes, statsRes] = await Promise.all([
        medicineApi.getAll(),
        logApi.getByDate(today),
        logApi.getStats(),
      ]);
      setMedicines(medsRes.data);
      setTodayLogs(logsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMoodSubmit = async (mood, symptoms, notes) => {
    if (todayLogs.length > 0) {
      try {
        await logApi.create({
          medicineId: todayLogs[0].medicineId,
          date: today,
          status: todayLogs[0].status,
          mood,
          symptoms: symptoms || undefined,
          notes: notes || undefined,
        });
        fetchData();
      } catch (err) {
        console.error("Failed to save mood:", err);
      }
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          {greeting()}, {user?.name}
        </h1>
        <div className="flex items-center gap-1.5 mt-1.5">
          <CalendarIcon size={14} className="text-slate-400" />
          <p className="text-sm text-slate-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <StatsCard stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <DailyChecklist
            medicines={medicines}
            todayLogs={todayLogs}
            onLogUpdated={fetchData}
          />
        </div>
        <div className="lg:col-span-5">
          <MoodSelector onMoodSubmit={handleMoodSubmit} />
        </div>
      </div>
    </div>
  );
}
