from sqlalchemy import create_engine
import os
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from collections.abc import Generator

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./r1carcare.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

SEED_USERS = [
    {"username": "admin", "password": "admin123", "role": "admin"},
    {"username": "customer", "password": "customer@r1carcare", "role": "customer"},
]

SEED_PACKAGES = [
    {"package_name": "BASIC WASH", "description": "Exterior rinse + hand dry", "price": 199, "is_active": 1},
    {"package_name": "STANDARD WASH", "description": "Exterior wash + interior vacuum + wipe down", "price": 399, "is_active": 1},
    {"package_name": "PREMIUM WASH", "description": "Standard + tyre shine + window clean", "price": 599, "is_active": 1},
    {"package_name": "DELUXE WASH", "description": "Premium + engine bay clean + air freshener", "price": 899, "is_active": 1},
    {"package_name": "FULL DETAIL", "description": "Deluxe + clay bar + wax polish + deep interior detail", "price": 1499, "is_active": 1},
    {"package_name": "CERAMIC COAT", "description": "Full Detail + ceramic coating for long-term protection", "price": 3999, "is_active": 1},
    {"package_name": "BIKE WASH", "description": "Complete 2-wheeler wash & clean", "price": 149, "is_active": 1},
    {"package_name": "SUV PREMIUM", "description": "Premium wash for SUVs and large vehicles", "price": 799, "is_active": 1},
]

SEED_VEHICLE_TYPES = [
    {"vehicle_name": "HATCHBACK", "active": 1},
    {"vehicle_name": "SEDAN", "active": 1},
    {"vehicle_name": "SUV", "active": 1},
    {"vehicle_name": "MUV", "active": 1},
    {"vehicle_name": "LUXURY CAR", "active": 1},
    {"vehicle_name": "PICKUP TRUCK", "active": 1},
    {"vehicle_name": "MOTORCYCLE / SCOOTER", "active": 1},
    {"vehicle_name": "ELECTRIC VEHICLE (EV)", "active": 1},
]


def seed_data() -> None:
    from db.models.sqlalchemy_models import Users, Packages, VehicleType
    from services.oauth import hash_password
    db = SessionLocal()
    try:
        for u in SEED_USERS:
            if not db.query(Users).filter(Users.username == u["username"]).first():
                db.add(Users(
                    username=u["username"],
                    password_hash=hash_password(u["password"]),
                    role=u["role"],
                ))

        if db.query(Packages).count() == 0:
            for p in SEED_PACKAGES:
                db.add(Packages(**p))

        if db.query(VehicleType).count() == 0:
            for v in SEED_VEHICLE_TYPES:
                db.add(VehicleType(**v))

        db.commit()
    finally:
        db.close()


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
    seed_data()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
