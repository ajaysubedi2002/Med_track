import type { DailyLog } from "../../types";
import { CheckCircleIcon, XCircleIcon, SkipIcon } from "../icons";

interface DayDetailProps {
  logs: DailyLog[];
}

const moodLabels: Record<number, string> = {
  1: "Bad",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const moodColors: Record<number, string> = {
  1: "bg-red-100 text-red-600",
  2: "bg-orange-100 text-orange-600",
  3: "bg-amber-100 text-amber-600",
  4: "bg-emerald-100 text-emerald-600",
  5: "bg-teal-100 text-teal-600",
};

export default function DayDetail({ logs }: DayDetailProps) {
  return (
    <div className="space-y-1.5 mt-2">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-xl text-sm"
        >
          <div className="flex items-center gap-2.5">
            {log.statusText === "Taken" ? (
              <CheckCircleIcon size={15} className="text-emerald-500" />
            ) : log.statusText === "Missed" ? (
              <XCircleIcon size={15} className="text-red-400" />
            ) : (
              <SkipIcon size={15} className="text-amber-400" />
            )}
            <span className="font-medium text-slate-700">
              {log.medicineName}
            </span>
            <span className="text-slate-400">{log.medicineDosage}</span>
          </div>
          <div className="flex items-center gap-2">
            {log.mood && (
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-semibold ${moodColors[log.mood]}`}
                title={`Mood: ${moodLabels[log.mood]}`}
              >
                {moodLabels[log.mood]}
              </span>
            )}
            {log.symptoms && (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {log.symptoms}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
