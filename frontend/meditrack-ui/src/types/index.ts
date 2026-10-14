export type Frequency = "OnceDaily" | "TwiceDaily" | "ThreeTimesDaily" | "Weekly";
export type LogStatus = "Taken" | "Missed" | "Skipped";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  frequencyText: string;
  timeOfDay?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicine {
  name: string;
  dosage: string;
  frequency: number;
  timeOfDay?: string;
}

export interface DailyLog {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineDosage: string;
  date: string;
  status: number;
  statusText: string;
  mood?: number;
  symptoms?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateLog {
  medicineId: string;
  date: string;
  status: number;
  mood?: number;
  symptoms?: string;
  notes?: string;
}

export interface StatusBreakdown {
  taken: number;
  missed: number;
  skipped: number;
}

export interface Stats {
  totalMedicines: number;
  totalLogs: number;
  adherencePercent: number;
  currentStreak: number;
  allTime: StatusBreakdown;
  thisWeek: StatusBreakdown;
}
