import { useState, useEffect } from "react";
import { doctorApi } from "../services/api";
import MedicineForm from "../components/medicine/MedicineForm";
import {
  UsersIcon,
  PhoneIcon,
  MailIcon,
  TrashIcon,
  PillIcon,
  PlusIcon,
  CalendarIcon,
} from "../components/icons";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescribingPatient, setPrescribingPatient] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchPatients = async () => {
    try {
      const { data } = await doctorApi.getMyPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRemove = async (patientId, name) => {
    if (!confirm(`Remove ${name} from your patient list?`)) return;
    setRemovingId(patientId);
    try {
      await doctorApi.removePatient(patientId);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove patient.");
    } finally {
      setRemovingId(null);
    }
  };

  const handlePrescribe = async (data) => {
    if (!prescribingPatient) return;
    try {
      await doctorApi.prescribeMedicine(prescribingPatient.id, data);
      setPrescribingPatient(null);
      alert(`Medicine prescribed to ${prescribingPatient.name} successfully.`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to prescribe medicine.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Patients</h1>
          <p className="text-sm text-slate-400 mt-0.5">{patients.length} patient{patients.length !== 1 ? "s" : ""} under your care</p>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UsersIcon size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium text-lg">No patients yet</p>
          <p className="text-slate-400 text-sm mt-1.5">
            Go to your dashboard to add patients.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UsersIcon size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <MailIcon size={12} className="text-slate-400" />
                        <span className="text-sm text-slate-500">{patient.email}</span>
                      </div>
                      {patient.phone && (
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon size={12} className="text-slate-400" />
                          <span className="text-sm text-slate-500">{patient.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400">
                          Since {new Date(patient.assignedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrescribingPatient(patient)}
                    className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    <PillIcon size={14} />
                    Prescribe
                  </button>
                  <button
                    onClick={() => handleRemove(patient.id, patient.name)}
                    disabled={removingId === patient.id}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
                    title="Remove patient"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {prescribingPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md">
            <div className="bg-teal-600 text-white px-5 py-3 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <PlusIcon size={16} />
                <span className="font-semibold text-sm">
                  Prescribing for {prescribingPatient.name}
                </span>
              </div>
            </div>
            <MedicineForm
              onSubmit={handlePrescribe}
              onCancel={() => setPrescribingPatient(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
