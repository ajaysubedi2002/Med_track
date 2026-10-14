import { useState, useEffect } from "react";
import { logApi } from "../services/api";
import HistoryList from "../components/history/HistoryList";
import type { DailyLog } from "../types";

const periodOptions = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

export default function HistoryPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await logApi.getHistory(days);
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [days]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">History</h1>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none cursor-pointer"
        >
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 h-16 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <HistoryList logs={logs} />
      )}
    </div>
  );
}
