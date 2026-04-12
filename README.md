# R1 Car Care — Full-Stack Car Wash Booking App

A modern car wash booking and management platform built with **React** (frontend) and **FastAPI** (backend), inspired by Birthday Box but purpose-built for car care centers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Bootstrap 5, Lucide Icons |
| Backend | FastAPI, SQLAlchemy, SQLite, JWT Auth (python-jose), passlib |
| Package Manager (backend) | `uv` |
| Package Manager (frontend) | `npm` |

---

## Project Structure

```
r1carcare/
├── frontend/        # React + Vite app (port 5174)
│   └── src/
│       ├── pages/   # Home, Login, BookNow, Dashboard, ...
│       ├── components/  # Layout (sidebar)
│       ├── css/     # Scoped CSS per component
│       ├── services/ # API base URL config
│       └── utils/   # Authenticated fetch wrapper
├── backend/         # FastAPI app (port 8000)
│   ├── api/         # Route handlers (users, bookings, customers, holidays, health)
│   ├── db/          # SQLAlchemy models, Pydantic models, DB session
│   ├── services/    # Business logic (auth, bookings, customers, holidays)
│   └── utils/       # Exceptions, DB utilities
└── README.md
```

---

## Quick Start

### 1. Backend

```bash
cd r1carcare/backend

# Install uv (if not already installed)
pip install uv

# Create virtual environment and install dependencies
uv sync

# Run the development server
uv run uvicorn main:app --reload --port 8000
```

The API will be available at: **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

### 2. Frontend

```bash
cd r1carcare/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at: **http://localhost:5174**

> The Vite dev server proxies `/api` requests to `http://localhost:8000`, so both services work together seamlessly.

---

## Default Credentials

| Role | Username | Password |
|---|---|---|
| Admin/Staff | `admin` | `admin123` |
| Customer (internal) | `customer` | `customer@r1carcare` |

---

## Features

### Public Pages
- **Homepage** — Services, packages, gallery, testimonials, CTA
- **Book Now** — Online appointment form (phone lookup, package/vehicle selection, time slot)

### Staff Dashboard
- **Dashboard** — Today's appointments, stats, next upcoming booking
- **Appointments** — Today's / Upcoming / Past bookings in tabular view
- **Customers** — Full CRUD management
- **Packages** — View all wash packages
- **Holidays** — Mark and remove closure dates
- **Add Appointment** — Staff-side booking form with customer lookup

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health/` | Health check |
| POST | `/api/users/login` | Staff login (JWT) |
| GET | `/api/users/me` | Current user info |
| POST | `/api/users/add-user` | Create staff user |
| GET | `/api/bookings/packages` | List wash packages |
| GET | `/api/bookings/vehicle-types` | List vehicle types |
| GET | `/api/bookings/by-filter?filter=` | Filter bookings (today/upcoming/past/pending/...) |
| GET | `/api/bookings/by-date?date=` | Bookings on a specific date |
| GET | `/api/bookings/next-booking` | Next appointment today |
| GET | `/api/bookings/{id}` | Get booking by ID |
| POST | `/api/bookings/submit` | Create booking |
| PUT | `/api/bookings/update/{id}` | Update booking |
| PUT | `/api/bookings/update-payment/{id}` | Update payment |
| DELETE | `/api/bookings/delete/{id}` | Delete booking |
| GET | `/api/customers/` | List all customers |
| GET | `/api/customers/details/{phone}` | Lookup customer by phone |
| POST | `/api/customers/submit` | Add customer |
| PUT | `/api/customers/update/{id}` | Update customer |
| DELETE | `/api/customers/delete/{id}` | Delete customer |
| GET | `/api/holidays/` | List holidays |
| POST | `/api/holidays/submit` | Add holiday |
| DELETE | `/api/holidays/{id}` | Remove holiday |
