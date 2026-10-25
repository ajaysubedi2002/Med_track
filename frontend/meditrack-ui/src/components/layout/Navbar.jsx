import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HeartPulseIcon,
  LayoutDashboardIcon,
  PillIcon,
  HistoryIcon,
  LogOutIcon,
  UserIcon,
  UsersIcon,
  StethoscopeIcon,
} from "../icons";

export default function Navbar() {
  const { user, logout, isDoctor, isPatient } = useAuth();
  const location = useLocation();

  const patientLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboardIcon },
    { to: "/medicines", label: "Medicines", icon: PillIcon },
    { to: "/history", label: "History", icon: HistoryIcon },
  ];

  const doctorLinks = [
    { to: "/doctor/dashboard", label: "Dashboard", icon: StethoscopeIcon },
    { to: "/doctor/patients", label: "My Patients", icon: UsersIcon },
  ];

  const navLinks = isDoctor ? doctorLinks : isPatient ? patientLinks : [];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to={isDoctor ? "/doctor/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <HeartPulseIcon className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              MediTrack
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} className={active ? "text-teal-600" : ""} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
                <UserIcon size={13} className="text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium text-slate-700 leading-none">
                  {user?.name}
                </span>
                {user?.role && (
                  <span className="text-[10px] text-slate-400 mt-0.5 capitalize">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
