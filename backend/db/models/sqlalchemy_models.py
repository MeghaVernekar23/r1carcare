from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Date, Float, Boolean
from sqlalchemy.sql import func
from db.sessions import Base
import datetime
from sqlalchemy.dialects.sqlite import JSON


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"))
    package_id = Column(Integer, ForeignKey("packages.package_id"))
    vehicle_type_id = Column(Integer, ForeignKey("vehicle_types.vehicle_type_id"))
    vehicle_number = Column(String, nullable=True)
    appointment_date = Column(Date)
    appointment_time = Column(String)
    status = Column(String, default="pending")
    notes = Column(Text)
    payment_mode = Column(String)
    payment_total = Column(Float)
    payment_paid = Column(Float)
    payment_notes = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    updated_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime)
    additional_services = Column(JSON)


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone_number = Column(String)
    email = Column(String)
    address = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Packages(Base):
    __tablename__ = "packages"

    package_id = Column(Integer, primary_key=True, index=True)
    package_name = Column(String)
    description = Column(Text)
    price = Column(Integer)
    is_active = Column(Integer)


class VehicleType(Base):
    __tablename__ = "vehicle_types"

    vehicle_type_id = Column(Integer, primary_key=True, index=True)
    vehicle_name = Column(String)
    active = Column(Integer)


class Holiday(Base):
    __tablename__ = "holidays"

    holiday_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(Date, nullable=False, unique=True)


class StampCard(Base):
    __tablename__ = "stamp_cards"

    card_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"), nullable=False)
    total_washes = Column(Integer, default=10)
    washes_used = Column(Integer, default=0)
    free_wash_earned = Column(Boolean, default=False)
    free_wash_used = Column(Boolean, default=False)
    birthday_box_discount = Column(Boolean, default=True)
    price_paid = Column(Float, nullable=False)
    purchase_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)
    status = Column(String, default="active")  # active, completed, expired
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
