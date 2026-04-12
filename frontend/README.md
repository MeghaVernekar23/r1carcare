# R1 Car Care — Frontend

React + Vite frontend for the R1 Car Care booking platform.

## Setup

```bash
# From this directory (r1carcare/frontend)

npm install
npm run dev
```

App runs at **http://localhost:5174**

Vite proxies `/api` requests to `http://localhost:8000` — make sure the backend is running.

## Build for Production

```bash
npm run build
```

## Pages

| Route | Description |
|---|---|
| `/` | Public homepage |
| `/booknow` | Customer booking form |
| `/login` | Staff login |
| `/dashboard` | Staff dashboard |
| `/customers` | Customer management |
| `/packages` | Package list |
| `/holidays` | Holiday management |
| `/addbooking` | Add appointment (staff) |
| `/bookings/today` | Today's appointments |
| `/bookings/upcoming` | Upcoming appointments |
| `/bookings/older` | Past appointments |
