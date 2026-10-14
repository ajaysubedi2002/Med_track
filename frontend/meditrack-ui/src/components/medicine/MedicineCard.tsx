import type { Medicine } from "../../types";
import { EditIcon, TrashIcon, PillIcon, ClockIcon } from "../icons";

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
}

export default function MedicineCard({
  medicine,
  onEdit,
  onDelete,
}: MedicineCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between group hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <PillIcon size={20} className="text-teal-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{medicine.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-slate-500">{medicine.dosage}</span>
            <span className="text-slate-300">&middot;</span>
            <span className="text-sm text-slate-500">
              {medicine.frequencyText}
            </span>
            {medicine.timeOfDay && (
              <>
                <span className="text-slate-300">&middot;</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <ClockIcon size={11} />
                  {medicine.timeOfDay}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(medicine)}
          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
          title="Edit"
        >
          <EditIcon size={16} />
        </button>
        <button
          onClick={() => onDelete(medicine.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Remove"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </div>
  );
}
