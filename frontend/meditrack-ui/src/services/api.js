import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const medicineApi = {
  getAll: () => api.get("/medicines"),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post("/medicines", data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};

export const logApi = {
  create: (data) => api.post("/logs", data),
  getByDate: (date) => api.get(`/logs?date=${date}`),
  getHistory: (days = 30) => api.get(`/logs/history?days=${days}`),
  getStats: () => api.get("/logs/stats"),
};

export const doctorApi = {
  getDashboard: () => api.get("/doctor/dashboard"),
  searchPatients: (q) => api.get(`/doctor/patients/search?q=${encodeURIComponent(q)}`),
  addPatient: (patientId) => api.post(`/doctor/patients/${patientId}`),
  removePatient: (patientId) => api.delete(`/doctor/patients/${patientId}`),
  getMyPatients: () => api.get("/doctor/patients"),
  prescribeMedicine: (patientId, data) => api.post(`/patients/${patientId}/medicines`, data),
};
