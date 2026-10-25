import { useState, useEffect, useRef } from "react";
import { doctorApi } from "../services/api";
import {
  UsersIcon,
  AlertCircleIcon,
  PhoneIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  XCircleIcon,
} from "../components/icons";

const moodEmojis = { 1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" };
const moodLabels = { 1: "Bad", 2: "Poor", 3: "Okay", 4: "Good", 5: "Great" };

export default function DoctorDashboardPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [addSuccess, setAddSuccess] = useState("");
  const searchRef = useRef(null);

  const fetchDashboard = async () => {
    try {
      const { data } = await doctorApi.getDashboard();
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await doctorApi.searchPatients(searchQuery.trim());
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddPatient = async (patientId) => {
    setAddingId(patientId);
    try {
      await doctorApi.addPatient(patientId);
      setAddSuccess("Patient added successfully.");
      setSearchQuery("");
      setSearchResults([]);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add patient.");
    } finally {
      setAddingId(null);
    }
  };

  const missedCount = patients.filter((p) => p.missedToday).length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-white rounded-2xl border border-slate-200"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl border border-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Monitor your patients' medication adherence</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setAddSuccess(""); }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-teal-700 hover:to-emerald-700 shadow-sm transition-all cursor-pointer"
        >
          <PlusIcon size={16} />
          Add Patient
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <UsersIcon size={22} className="text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{patients.length}</p>
            <p className="text-sm text-slate-400">Total Patients</p>
          </div>
        </div>
        <div className={`bg-white rounded-2xl border p-5 flex items-center gap-4 ${missedCount > 0 ? "border-red-200 bg-red-50/30" : "border-slate-200"}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${missedCount > 0 ? "bg-red-100" : "bg-slate-100"}`}>
            <AlertCircleIcon size={22} className={missedCount > 0 ? "text-red-500" : "text-slate-400"} />
          </div>
          <div>
            <p className={`text-2xl font-bold ${missedCount > 0 ? "text-red-600" : "text-slate-800"}`}>{missedCount}</p>
            <p className="text-sm text-slate-400">Missed Today</p>
          </div>
        </div>
      </div>

      {/* Patient cards */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UsersIcon size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium text-lg">No patients yet</p>
          <p className="text-slate-400 text-sm mt-1.5">Add patients to start monitoring their medications.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 mt-5 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-100 transition-colors cursor-pointer"
          >
            <PlusIcon size={16} />
            Add First Patient
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div
              key={patient.patientId}
              className={`bg-white rounded-2xl border p-5 ${
                patient.missedToday ? "border-red-200 shadow-sm shadow-red-100" : "border-slate-200"
              }`}
            >
              {/* Patient header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MailIcon size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-400">{patient.email}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <PhoneIcon size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-400">{patient.phone}</span>
                    </div>
                  )}
                </div>
                {patient.todayMood != null && (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">{moodEmojis[patient.todayMood]}</span>
                    <span className="text-[10px] text-slate-400">{moodLabels[patient.todayMood]}</span>
                  </div>
                )}
              </div>

              {/* Adherence */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 font-medium">7-day adherence</span>
                  <span className={`text-xs font-bold ${
                    patient.adherenceLast7Days >= 80 ? "text-emerald-600" :
                    patient.adherenceLast7Days >= 50 ? "text-amber-600" : "text-red-500"
                  }`}>
                    {patient.adherenceLast7Days}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      patient.adherenceLast7Days >= 80 ? "bg-emerald-500" :
                      patient.adherenceLast7Days >= 50 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ width: `${patient.adherenceLast7Days}%` }}
                  />
                </div>
              </div>

              {/* Missed today */}
              {patient.missedToday && patient.missedMedicationsToday.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertCircleIcon size={13} className="text-red-500" />
                    <span className="text-xs font-semibold text-red-600">Missed today</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {patient.missedMedicationsToday.map((med, i) => (
                      <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-medium">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!patient.missedToday && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                  <span className="text-xs font-semibold text-emerald-600">✓ All taken today</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-800">Add Patient</h2>
              <button
                onClick={() => { setShowModal(false); setSearchQuery(""); setSearchResults([]); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <XCircleIcon size={18} />
              </button>
            </div>

            {addSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl mb-4 text-sm">
                {addSuccess}
              </div>
            )}

            <div className="relative mb-4">
              <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
                placeholder="Search patient by name..."
                autoFocus
              />
            </div>

            {searchLoading && (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
              </div>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.email}</p>
                      {p.phone && <p className="text-xs text-slate-400">{p.phone}</p>}
                    </div>
                    <button
                      onClick={() => handleAddPatient(p.id)}
                      disabled={addingId === p.id}
                      className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <PlusIcon size={12} />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No patients found matching "{searchQuery}"</p>
            )}

            {!searchQuery.trim() && (
              <p className="text-sm text-slate-400 text-center py-4">Type a name to search for patients</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
