# R1 Car Care — Backend

FastAPI backend for the R1 Car Care booking platform.

## Setup with uv

```bash
# From this directory (r1carcare/backend)

# Install uv if not present
pip install uv

# Install project dependencies into a virtual environment
uv sync

# Run dev server
uv run uvicorn main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment

Copy `.env` and adjust as needed:
```
SECRET_KEY=r1carcare_super_secret_key_2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./r1carcare.db
```

## Database

Uses **SQLite** by default (`r1carcare.db` created automatically on first run).

Seed data is auto-loaded on startup:
- 2 users (admin + customer service account)
- 8 wash packages
- 8 vehicle types
