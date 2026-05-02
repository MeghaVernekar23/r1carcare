from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from api.users import users_router
from api.bookings import bookings_router
from api.customers import customer_router
from api.holidays import holidays_router
from api.health import health_router
from api.stamp_cards import stamp_cards_router
from fastapi.middleware.cors import CORSMiddleware
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from db.sessions import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    create_tables()
    yield


app = FastAPI(
    title="R1 Car Care API",
    version="1.0.0",
    lifespan=lifespan,
    root_path="/api",
    description="API for managing R1 Car Care appointments, packages, and customer data.",
    contact={"name": "R1 Car Care"},
    openapi_tags=[
        {"name": "Health", "description": "API health check."},
        {"name": "User", "description": "Staff authentication and management."},
        {"name": "Booking", "description": "Car wash appointment management."},
        {"name": "Customer", "description": "Customer management."},
        {"name": "Holidays", "description": "Holiday / closure management."},
        {"name": "Stamp Cards", "description": "Annual wash package / loyalty stamp cards."},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(users_router)
app.include_router(bookings_router)
app.include_router(customer_router)
app.include_router(holidays_router)
app.include_router(stamp_cards_router)
