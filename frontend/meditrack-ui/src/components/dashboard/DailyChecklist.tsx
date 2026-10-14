import { useState } from "react";
import { logApi } from "../../services/api";
import type { Medicine, DailyLog } from "../../types";
import { CheckCircleIcon, XCircleIcon, SkipIcon, PillIcon } from "../icons";

interface DailyChecklistProps {
  medicines: Medicine[];
  todayLogs: DailyLog[];
  onLogUpdated: () => void;
}

export default function DailyChecklist({
  medicines,
  todayLogs,
  onLogUpdated,
}: DailyChecklistProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const getLogForMedicine = (medicineId: string) =>
    todayLogs.find((l) => l.medicineId === medicineId);

  const handleLog = async (medicineId: string, status: number) => {
    setLoadingId(medicineId);
    try {
      await logApi.create({ medicineId, date: today, status });
      onLogUpdated();
    } catch (err) {
      console.error("Failed to log medicine:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const loggedCount = medicines.filter((m) =>
    todayLogs.some((l) => l.medicineId === m.id)
  ).length;
  const progress =
    medicines.length > 0
      ? Math.round((loggedCount / medicines.length) * 100)
      : 0;

  if (medicines.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 text-center animate-fade-in">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PillIcon size={24} className="text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium">No active medicines</p>
        <p className="text-slate-400 text-sm mt-1">
          <a
            href="/medicines"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Add your first medicine
          </a>{" "}
          to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 mb-6 animate-fade-in overflow-hidden">
      {/* Header with progress */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">
            Today's Medicines
          </h2>
          <span className="text-xs font-medium text-slate-400">
            {loggedCount} of {medicines.length} logged
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Medicine list */}
      <div className="divide-y divide-slate-100">
        {medicines.map((med) => {
          const log = getLogForMedicine(med.id);
          const isLoading = loadingId === med.id;

          return (
            <div
              key={med.id}
              className={`px-6 py-4 flex items-center justify-between transition-colors ${
                log ? "bg-slate-50/50" : ""
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    log?.statusText === "Taken"
                      ? "bg-emerald-100"
                      : log?.statusText === "Missed"
                        ? "bg-red-100"
                        : log?.statusText === "Skipped"
                          ? "bg-amber-100"
                          : "bg-slate-100"
                  }`}
                >
                  {log?.statusText === "Taken" ? (
                    <CheckCircleIcon size={18} className="text-emerald-600" />
                  ) : log?.statusText === "Missed" ? (
                    <XCircleIcon size={18} className="text-red-500" />
                  ) : log?.statusText === "Skipped" ? (
                    <SkipIcon size={18} className="text-amber-500" />
                  ) : (
                    <PillIcon size={18} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium text-sm ${
                      log ? "text-slate-500" : "text-slate-800"
                    }`}
                  >
                    {med.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {med.dosage} &middot; {med.frequencyText}
                  </p>
                </div>
              </div>

              {log ? (
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    log.statusText === "Taken"
                      ? "bg-emerald-100 text-emerald-700"
                      : log.statusText === "Missed"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {log.statusText}
                </span>
              ) : (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleLog(med.id, 0)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <CheckCircleIcon size={13} />
                    Taken
                  </button>
                  <button
                    onClick={() => handleLog(med.id, 1)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <XCircleIcon size={13} />
                    Missed
                  </button>
                  <button
                    onClick={() => handleLog(med.id, 2)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <SkipIcon size={13} />
                    Skip
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
