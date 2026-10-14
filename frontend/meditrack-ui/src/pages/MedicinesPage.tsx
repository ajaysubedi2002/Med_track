import { useState, useEffect } from "react";
import { medicineApi } from "../services/api";
import MedicineCard from "../components/medicine/MedicineCard";
import MedicineForm from "../components/medicine/MedicineForm";
import { PillIcon, PlusIcon } from "../components/icons";
import type { Medicine, CreateMedicine } from "../types";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const fetchMedicines = async () => {
    try {
      const { data } = await medicineApi.getAll();
      setMedicines(data);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAdd = async (data: CreateMedicine) => {
    try {
      await medicineApi.create(data);
      setShowForm(false);
      fetchMedicines();
    } catch (err) {
      console.error("Failed to add medicine:", err);
    }
  };

  const handleEdit = async (data: CreateMedicine) => {
    if (!editingMedicine) return;
    try {
      await medicineApi.update(editingMedicine.id, data);
      setEditingMedicine(null);
      fetchMedicines();
    } catch (err) {
      console.error("Failed to update medicine:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this medicine?")) return;
    try {
      await medicineApi.delete(id);
      fetchMedicines();
    } catch (err) {
      console.error("Failed to delete medicine:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 h-20"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Medicines</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-teal-700 hover:to-emerald-700 shadow-sm shadow-teal-500/20 transition-all cursor-pointer"
        >
          <PlusIcon size={16} />
          Add Medicine
        </button>
      </div>

      {medicines.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PillIcon size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium text-lg">
            No medicines yet
          </p>
          <p className="text-slate-400 text-sm mt-1.5 max-w-sm mx-auto">
            Add your first medicine to start tracking your daily intake and
            build healthy habits.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 mt-5 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-100 transition-colors cursor-pointer"
          >
            <PlusIcon size={16} />
            Add Medicine
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {medicines.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onEdit={setEditingMedicine}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <MedicineForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      {editingMedicine && (
        <MedicineForm
          medicine={editingMedicine}
          onSubmit={handleEdit}
          onCancel={() => setEditingMedicine(null)}
        />
      )}
    </div>
  );
}
