import { useState, useEffect } from "react";
import type { Medicine, CreateMedicine } from "../../types";
import { PillIcon } from "../icons";

interface MedicineFormProps {
  medicine?: Medicine | null;
  onSubmit: (data: CreateMedicine) => void;
  onCancel: () => void;
}

const frequencyOptions = [
  { value: 0, label: "Once Daily" },
  { value: 1, label: "Twice Daily" },
  { value: 2, label: "Three Times Daily" },
  { value: 3, label: "Weekly" },
];

export default function MedicineForm({
  medicine,
  onSubmit,
  onCancel,
}: MedicineFormProps) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    if (medicine) {
      setName(medicine.name);
      setDosage(medicine.dosage);
      setFrequency(medicine.frequency);
      setTimeOfDay(medicine.timeOfDay || "");
    }
  }, [medicine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      dosage,
      frequency,
      timeOfDay: timeOfDay || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
            <PillIcon size={20} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {medicine ? "Edit Medicine" : "Add Medicine"}
            </h2>
            <p className="text-xs text-slate-400">
              {medicine ? "Update the details below" : "Fill in the medicine details"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Medicine Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
              placeholder="e.g. Vitamin D"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Dosage
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
              placeholder="e.g. 1000 IU, 500mg, 10ml"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
            >
              {frequencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Time of Day
              <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">
                (optional)
              </span>
            </label>
            <input
              type="text"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
              placeholder="e.g. Morning, After dinner"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2.5 rounded-xl font-medium text-sm hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm cursor-pointer"
            >
              {medicine ? "Save Changes" : "Add Medicine"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
