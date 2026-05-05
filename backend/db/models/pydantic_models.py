from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


# ── User models ──────────────────────────────────────────
class RoleEnum(str, Enum):
    admin = "admin"
    customer = "customer"


class UserCreate(BaseModel):
    username: str
    password: str
    role: RoleEnum
    email: Optional[str] = None
    phone_number: Optional[str] = None


class UserResponse(BaseModel):
    username: str
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


# ── Customer models ───────────────────────────────────────
class CustomerDetails(BaseModel):
    customer_id: int
    name: Optional[str]
    phone_number: Optional[str]
    email: Optional[str]
    address: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class AddCustomerDetails(BaseModel):
    name: str
    phone_number: str
    email: Optional[str] = None
    address: Optional[str] = None


# ── Package / Vehicle type models ────────────────────────
class PackageDetails(BaseModel):
    package_id: int
    package_name: str
    description: Optional[str]
    price: int
    is_active: int

    class Config:
        from_attributes = True


class VehicleTypeDetails(BaseModel):
    vehicle_type_id: int
    vehicle_name: str
    active: int

    class Config:
        from_attributes = True


# ── Booking models ────────────────────────────────────────
class BookingDetails(BaseModel):
    booking_id: int
    customer_id: Optional[int]
    customer_name: Optional[str]
    customer_phone: Optional[str]
    package_id: Optional[int]
    package_name: Optional[str]
    vehicle_type_id: Optional[int]
    vehicle_type_name: Optional[str]
    vehicle_number: Optional[str]
    appointment_date: Optional[date]
    appointment_time: Optional[str]
    status: Optional[str]
    notes: Optional[str]
    payment_mode: Optional[str]
    payment_total: Optional[float]
    payment_paid: Optional[float]
    payment_notes: Optional[str]
    additional_services: Optional[list]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class AddBookingDetails(BaseModel):
    customer_id: int
    package_id: Optional[int] = None
    vehicle_type_id: int
    vehicle_number: Optional[str] = None
    appointment_date: date
    appointment_time: str
    status: Optional[str] = "pending"
    notes: Optional[str] = None
    payment_mode: Optional[str] = None
    payment_total: Optional[float] = None
    payment_paid: Optional[float] = None
    payment_notes: Optional[str] = None
    additional_services: Optional[list] = None
    created_by: Optional[int] = None

    @field_validator("vehicle_number", mode="before")
    @classmethod
    def uppercase_vehicle_number(cls, v):
        return v.upper() if isinstance(v, str) else v


class EditBookingDetails(BaseModel):
    package_id: Optional[int] = None
    vehicle_type_id: Optional[int] = None
    vehicle_number: Optional[str] = None
    appointment_date: Optional[date] = None
    appointment_time: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    payment_mode: Optional[str] = None
    payment_total: Optional[float] = None
    payment_paid: Optional[float] = None
    payment_notes: Optional[str] = None
    additional_services: Optional[list] = None
    updated_by: Optional[int] = None

    @field_validator("vehicle_number", mode="before")
    @classmethod
    def uppercase_vehicle_number(cls, v):
        return v.upper() if isinstance(v, str) else v


class CustomerBookingSummary(BaseModel):
    booking_id: int
    appointment_date: Optional[date]
    appointment_time: Optional[str]
    package_name: Optional[str]
    vehicle_type_name: Optional[str]
    vehicle_number: Optional[str]
    status: Optional[str]
    payment_total: Optional[float]

    class Config:
        from_attributes = True


# ── Holiday models ────────────────────────────────────────
class HolidayCreate(BaseModel):
    title: str
    date: date


class HolidayResponse(BaseModel):
    holiday_id: int
    title: str
    date: date

    class Config:
        from_attributes = True


# ── Stamp Card models ─────────────────────────────────────
class StampCardCreate(BaseModel):
    customer_id: int
    total_washes: int = 10
    price_paid: float = 4000.0
    plan_type: Optional[str] = "annual"
    validity_months: int = 12
    birthday_box_discount_pct: Optional[int] = None
    notes: Optional[str] = None


class StampCardResponse(BaseModel):
    card_id: int
    customer_id: int
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    total_washes: int
    washes_used: int
    washes_remaining: int
    free_wash_earned: bool
    free_wash_used: bool
    birthday_box_discount: bool
    birthday_box_discount_pct: Optional[int] = None
    price_paid: float
    purchase_date: date
    expiry_date: date
    status: str
    plan_type: Optional[str] = None
    validity_months: Optional[int] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
