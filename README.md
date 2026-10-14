# 💊 MediTrack — Daily Medicine & Health Tracker

A full-stack application to track daily medicines, log symptoms/mood, and monitor health adherence.

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend    | ASP.NET Core 8 Web API (C#)                |
| Database   | PostgreSQL 14                               |
| ORM        | Entity Framework Core 8 + Npgsql           |
| Auth       | JWT (JSON Web Tokens)                       |

## Features

- **User Authentication** — Register, Login with JWT tokens
- **Medicine Management** — Add, edit, deactivate medicines with dosage & frequency
- **Daily Logging** — Mark medicines as Taken/Missed/Skipped each day
- **Mood Tracking** — Rate your mood (1-5) and log symptoms/notes
- **Stats Dashboard** — Adherence %, current streak, weekly breakdown
- **History** — View past logs grouped by date with expandable details

## Project Structure

```
MediTrack/
├── backend/MediTrack.API/     # ASP.NET Core Web API
│   ├── Controllers/           # Auth, Medicines, Logs endpoints
│   ├── Models/                # Entities, DTOs, Enums
│   ├── Services/              # Business logic (interfaces + implementations)
│   ├── Data/                  # EF Core DbContext + configurations
│   ├── Helpers/               # JWT token generation
│   └── Middleware/            # Global exception handling
│
├── frontend/meditrack-ui/     # React SPA
│   ├── src/components/        # Reusable UI components
│   ├── src/pages/             # Page-level components
│   ├── src/services/          # API client (Axios)
│   ├── src/context/           # Auth context provider
│   └── src/types/             # TypeScript interfaces
│
└── docs/plans/                # Architecture & implementation plan
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- PostgreSQL 14+

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

The API runs at **http://localhost:5166** with Swagger UI at **http://localhost:5166/swagger**

### Frontend

```bash
cd frontend/meditrack-ui
npm install
npm run dev
```

The app runs at **http://localhost:5173**

## API Endpoints

| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| POST   | /api/auth/register        | Register new user          |
| POST   | /api/auth/login           | Login & get JWT token      |
| GET    | /api/auth/me              | Get current user           |
| GET    | /api/medicines            | List active medicines      |
| POST   | /api/medicines            | Add a medicine             |
| PUT    | /api/medicines/{id}       | Update a medicine          |
| DELETE | /api/medicines/{id}       | Deactivate a medicine      |
| POST   | /api/logs                 | Log a medicine for a day   |
| GET    | /api/logs?date=YYYY-MM-DD | Get logs for a date        |
| GET    | /api/logs/history?days=30 | Get log history            |
| GET    | /api/logs/stats           | Get adherence stats        |

## OOP Concepts Used

- **Inheritance** — `BaseEntity` → `User`, `Medicine`, `DailyLog`
- **Interfaces** — `IAuthService`, `IMedicineService`, `ILogService`
- **Encapsulation** — Private setters with domain methods (`medicine.Deactivate()`, `log.SetStatus()`)
- **Dependency Injection** — Services registered and injected via ASP.NET Core DI container
- **Enums** — `Frequency`, `LogStatus` for type-safe status management
