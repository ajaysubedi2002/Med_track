import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RoleProtectedRoute from "./components/layout/RoleProtectedRoute";
import Navbar from "./components/layout/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MedicinesPage from "./pages/MedicinesPage";
import HistoryPage from "./pages/HistoryPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import DoctorPatientsPage from "./pages/DoctorPatientsPage";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
}

function AuthRedirect({ children }) {
  const { token, isLoading, isDoctor } = useAuth();
  if (isLoading) return null;
  if (token) {
    return <Navigate to={isDoctor ? "/doctor/dashboard" : "/"} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <RegisterPage />
              </AuthRedirect>
            }
          />

          {/* Patient routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MedicinesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HistoryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Doctor-only routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <RoleProtectedRoute role="Doctor">
                <AppLayout>
                  <DoctorDashboardPage />
                </AppLayout>
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <RoleProtectedRoute role="Doctor">
                <AppLayout>
                  <DoctorPatientsPage />
                </AppLayout>
              </RoleProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
