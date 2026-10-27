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
- PostgreSQL (running in Docker)

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

#### Run with Docker

Build and run the backend from the API project directory:

```bash
cd backend/MediTrack.API
docker build -t meditrack-api .
docker run --rm --add-host=host.docker.internal:host-gateway -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;Port=5433;Database=meditrack;Username=<user>;Password=<password>" \
  -e Jwt__Key="YourSuperSecretKeyThatIsAtLeast32Characters!" \
  -e Jwt__Issuer="MediTrack" \
  -e Jwt__Audience="MediTrackUsers" \
  -e Jwt__ExpiryInDays=7 \
  meditrack-api
```

The containerized API runs at **http://localhost:8080**. Use a database hostname reachable from the container instead of `localhost`.

#### Run the backend and PostgreSQL with Docker Compose

Copy the environment template and update the database or JWT values as needed:

```bash
cp .env.example .env
```

From the repository root:

```bash
docker compose up --build
```

This starts the live-reload frontend at **http://localhost:5173** and the API at **http://localhost:8080**. Source files are bind-mounted into the containers, the backend runs with `dotnet watch`, and the frontend runs with Vite HMR, so code changes are reflected without rebuilding the images. PostgreSQL is also available at **localhost:5433**. The migration service applies pending EF Core migrations before the API starts. Stop the services with `docker compose down`; add `-v` to also remove the persisted database volume.

Development URLs:

- Frontend: **http://localhost:5173**
- API: **http://localhost:8080**
- PostgreSQL: **localhost:5433**

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

Registration always creates a Patient account. Start the Docker services, register the account through the API, then promote the account to Doctor in PostgreSQL.

### Docker setup

Start the services:

```bash
docker compose up --build
```

```bash
# Register via API first
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"YourPassword","name":"Dr. Name"}'

# Promote the account to Doctor inside the PostgreSQL container
docker compose exec postgres psql \
  -U meditrack \
  -d meditrack \
  -c "UPDATE users SET \"Role\" = 1 WHERE \"Email\" = 'doctor@example.com';"
```

The account can then log in through the frontend at http://localhost:5173.

## OOP Concepts Used

- **Inheritance** — `BaseEntity` is the base for `User`, `Medicine`, `DailyLog`
- **Interfaces** — `IAuthService`, `IMedicineService`, `ILogService`, `IDoctorService`
- **Encapsulation** — Private setters with domain methods (`medicine.Deactivate()`, `log.SetStatus()`)
- **Dependency Injection** — All services registered and resolved via ASP.NET Core DI
- **Enums** — `Frequency`, `LogStatus`, `UserRole` for type-safe domain modeling
- **Role-Based Authorization** — `[Authorize(Roles = "Doctor")]` guards doctor-only routes
