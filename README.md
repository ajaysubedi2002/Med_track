# MediTrack — Daily Medicine & Health Tracker

A full-stack application to track daily medicines, log symptoms/mood, and monitor health adherence. Supports two roles — **Patient** and **Doctor** — with role-based dashboards and access control.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS (JSX)    |
| Backend    | ASP.NET Core 8 Web API (C#)             |
| Database   | PostgreSQL                              |
| ORM        | Entity Framework Core 8 + Npgsql        |
| Auth       | JWT (JSON Web Tokens) + BCrypt          |

## Features

### Patient
- Register and log in with JWT authentication
- View daily medicine schedule and mark each as Taken / Missed / Skipped
- Track mood (1–5) and log symptoms/notes
- View adherence stats — percentage, current streak, weekly breakdown
- Browse full log history grouped by date

### Doctor
- Role-protected dashboard showing all linked patients
- Search for patients by name or email and add/remove them
- Prescribe medicines directly to a patient's schedule
- View per-patient medicine and adherence summaries

## Project Structure

```
MediTrack/
├── backend/MediTrack.API/
│   ├── Controllers/           # Auth, Medicines, Logs, Doctor endpoints
│   ├── Models/
│   │   ├── Entities/          # User, Medicine, DailyLog, DoctorPatient
│   │   ├── DTOs/              # Request/response shapes per domain
│   │   └── Enums/             # Frequency, LogStatus, UserRole
│   ├── Services/
│   │   ├── Interfaces/        # IAuthService, IMedicineService, ILogService, IDoctorService
│   │   └── Implementations/   # Business logic
│   ├── Data/                  # EF Core DbContext + Fluent API configurations
│   ├── Helpers/               # JWT token generation
│   └── Middleware/            # Global exception handling
│
└── frontend/meditrack-ui/
    └── src/
        ├── components/        # dashboard, history, medicine, layout, icons
        ├── pages/             # LoginPage, RegisterPage, DashboardPage,
        │                      # MedicinesPage, HistoryPage,
        │                      # DoctorDashboardPage, DoctorPatientsPage
        ├── services/          # Axios API client
        ├── context/           # Auth context provider
        └── types/             # Shared type definitions
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- PostgreSQL (running on port 5433)

### Database Setup

```bash
createdb meditrack
```

### Backend

```bash
cd backend/MediTrack.API
dotnet ef database update
dotnet run
```

API runs at **http://localhost:5166**
Swagger UI at **http://localhost:5166/swagger**

### Frontend

```bash
cd frontend/meditrack-ui
npm install
npm run dev
```

App runs at **http://localhost:5173**

## API Endpoints

### Auth
| Method | Endpoint            | Auth     | Description              |
|--------|---------------------|----------|--------------------------|
| POST   | /api/auth/register  | Public   | Register (Patient role)  |
| POST   | /api/auth/login     | Public   | Login, returns JWT       |
| GET    | /api/auth/me        | Required | Get current user profile |

### Medicines
| Method | Endpoint                               | Roles         | Description                      |
|--------|----------------------------------------|---------------|----------------------------------|
| GET    | /api/medicines                         | Any           | List all medicines for user      |
| GET    | /api/medicines/{id}                    | Any           | Get a single medicine            |
| POST   | /api/medicines                         | Doctor, Admin | Add a medicine                   |
| PUT    | /api/medicines/{id}                    | Doctor, Admin | Update a medicine                |
| DELETE | /api/medicines/{id}                    | Doctor, Admin | Deactivate a medicine            |
| POST   | /api/patients/{patientId}/medicines    | Doctor        | Prescribe medicine to a patient  |

### Logs
| Method | Endpoint                      | Auth     | Description                   |
|--------|-------------------------------|----------|-------------------------------|
| POST   | /api/logs                     | Required | Log a medicine status for day |
| GET    | /api/logs?date=YYYY-MM-DD     | Required | Get logs for a specific date  |
| GET    | /api/logs/history?days=30     | Required | Get log history (last N days) |
| GET    | /api/logs/stats               | Required | Get adherence statistics      |

### Doctor
| Method | Endpoint                              | Roles  | Description                    |
|--------|---------------------------------------|--------|--------------------------------|
| GET    | /api/doctor/dashboard                 | Doctor | Patient dashboard overview     |
| GET    | /api/doctor/patients                  | Doctor | List linked patients           |
| GET    | /api/doctor/patients/search?q=        | Doctor | Search patients by name/email  |
| POST   | /api/doctor/patients/{patientId}      | Doctor | Link a patient                 |
| DELETE | /api/doctor/patients/{patientId}      | Doctor | Unlink a patient               |

## Creating a Doctor Account

Registration always creates a Patient account. To create a Doctor, register normally then update the role in the database:

```bash
# Register via API first
curl -X POST http://localhost:5166/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"YourPassword","name":"Dr. Name"}'

# Then promote to Doctor in PostgreSQL
PGPASSWORD=<password> psql -h localhost -p 5433 -U <user> -d meditrack \
  -c "UPDATE users SET \"Role\" = 1 WHERE \"Email\" = 'doctor@example.com';"
```

## OOP Concepts Used

- **Inheritance** — `BaseEntity` is the base for `User`, `Medicine`, `DailyLog`
- **Interfaces** — `IAuthService`, `IMedicineService`, `ILogService`, `IDoctorService`
- **Encapsulation** — Private setters with domain methods (`medicine.Deactivate()`, `log.SetStatus()`)
- **Dependency Injection** — All services registered and resolved via ASP.NET Core DI
- **Enums** — `Frequency`, `LogStatus`, `UserRole` for type-safe domain modeling
- **Role-Based Authorization** — `[Authorize(Roles = "Doctor")]` guards doctor-only routes
