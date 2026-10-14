import axios from "axios";
import type {
  AuthResponse,
  Medicine,
  CreateMedicine,
  DailyLog,
  CreateLog,
  Stats,
  User,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:5166/api",
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
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),
  me: () => api.get<User>("/auth/me"),
};

export const medicineApi = {
  getAll: () => api.get<Medicine[]>("/medicines"),
  getById: (id: string) => api.get<Medicine>(`/medicines/${id}`),
  create: (data: CreateMedicine) => api.post<Medicine>("/medicines", data),
  update: (id: string, data: CreateMedicine) =>
    api.put<Medicine>(`/medicines/${id}`, data),
  delete: (id: string) => api.delete(`/medicines/${id}`),
};

export const logApi = {
  create: (data: CreateLog) => api.post<DailyLog>("/logs", data),
  getByDate: (date: string) => api.get<DailyLog[]>(`/logs?date=${date}`),
  getHistory: (days: number = 30) =>
    api.get<DailyLog[]>(`/logs/history?days=${days}`),
  getStats: () => api.get<Stats>("/logs/stats"),
};
