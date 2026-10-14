import type { Stats } from "../../types";
import { ChartIcon, FlameIcon, PillIcon, CheckCircleIcon, XCircleIcon, SkipIcon } from "../icons";

interface StatsCardProps {
  stats: Stats | null;
  loading: boolean;
}

function AdherenceRing({ percent }: { percent: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color =
    percent >= 80
      ? "stroke-emerald-500"
      : percent >= 50
        ? "stroke-amber-500"
        : "stroke-red-500";

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke="#e2e8f0" strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none" strokeWidth="8" strokeLinecap="round"
          className={`${color} animate-progress`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">
          {percent}%
        </span>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          Adherence
        </span>
      </div>
    </div>
  );
}

export default function StatsCard({ stats, loading }: StatsCardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 animate-fade-in">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
          <div className="h-28 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-3"></div>
              <div className="h-7 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 animate-fade-in">
      {/* Adherence Ring Card */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-6">
        <AdherenceRing percent={stats.adherencePercent} />
        <div className="flex-1 space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            This Week
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircleIcon size={14} className="text-emerald-500" />
                <span className="text-sm text-slate-600">Taken</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {stats.thisWeek.taken}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircleIcon size={14} className="text-red-400" />
                <span className="text-sm text-slate-600">Missed</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {stats.thisWeek.missed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SkipIcon size={14} className="text-amber-400" />
                <span className="text-sm text-slate-600">Skipped</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {stats.thisWeek.skipped}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
            <FlameIcon size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">
              {stats.currentStreak}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Day Streak</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-3">
            <PillIcon size={20} className="text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">
              {stats.totalMedicines}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Active Medicines</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
            <ChartIcon size={20} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">
              {stats.totalLogs}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Total Logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
