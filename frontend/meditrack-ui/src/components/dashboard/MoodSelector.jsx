import { useState } from "react";
import { ActivityIcon } from "../icons";

const moods = [
  { value: 1, label: "Bad", color: "bg-red-100 text-red-600 ring-red-300", activeColor: "bg-red-500 text-white ring-red-500" },
  { value: 2, label: "Poor", color: "bg-orange-100 text-orange-600 ring-orange-300", activeColor: "bg-orange-500 text-white ring-orange-500" },
  { value: 3, label: "Okay", color: "bg-amber-100 text-amber-600 ring-amber-300", activeColor: "bg-amber-500 text-white ring-amber-500" },
  { value: 4, label: "Good", color: "bg-emerald-100 text-emerald-600 ring-emerald-300", activeColor: "bg-emerald-500 text-white ring-emerald-500" },
  { value: 5, label: "Great", color: "bg-teal-100 text-teal-600 ring-teal-300", activeColor: "bg-teal-500 text-white ring-teal-500" },
];

export default function MoodSelector({ onMoodSubmit }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSubmit(selectedMood, symptoms, notes);
      setSelectedMood(null);
      setSymptoms("");
      setNotes("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-fade-in">
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
            <ActivityIcon size={16} className="text-violet-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            How are you feeling today?
          </h2>
        </div>

        <div className="flex gap-2 justify-center">
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${mood.activeColor} ring-2 shadow-sm scale-105`
                    : `${mood.color} hover:ring-2`
                }`}
              >
                <span className="text-lg font-bold leading-none">{mood.value}</span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? "text-white/80" : ""}`}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMood && (
        <div className="px-6 pb-5 space-y-3 border-t border-slate-100 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Symptoms
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all"
              placeholder="e.g. headache, nausea, fatigue..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all resize-none"
              rows={2}
              placeholder="How was your day?"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm cursor-pointer"
          >
            Save Check-in
          </button>
        </div>
      )}
    </div>
  );
}
