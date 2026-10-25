import { useState } from "react";
import DayDetail from "./DayDetail";
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon } from "../icons";

export default function HistoryList({ logs }) {
  const [expandedDate, setExpandedDate] = useState(null);

  const groupedByDate = logs.reduce((acc, log) => {
    const date = log.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (dates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalendarIcon size={28} className="text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium text-lg">No history yet</p>
        <p className="text-slate-400 text-sm mt-1.5">
          Start logging your medicines to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {dates.map((date) => {
        const dayLogs = groupedByDate[date];
        const takenCount = dayLogs.filter((l) => l.statusText === "Taken").length;
        const totalCount = dayLogs.length;
        const isExpanded = expandedDate === date;
        const allTaken = takenCount === totalCount;
        const progress = Math.round((takenCount / totalCount) * 100);

        return (
          <div key={date} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandedDate(isExpanded ? null : date)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${allTaken ? "bg-emerald-500" : "bg-amber-400"}`} />
                <div className="text-left">
                  <span className="font-semibold text-slate-800 text-sm">
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2.5">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${allTaken ? "bg-emerald-500" : "bg-amber-400"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400 w-16 text-right">
                    {takenCount}/{totalCount} taken
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUpIcon size={16} className="text-slate-400" />
                ) : (
                  <ChevronDownIcon size={16} className="text-slate-400" />
                )}
              </div>
            </button>
            {isExpanded && (
              <div className="px-5 pb-4 border-t border-slate-100">
                <DayDetail logs={dayLogs} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
