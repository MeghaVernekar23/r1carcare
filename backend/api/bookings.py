from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from db.sessions import get_db
from db.models.pydantic_models import (
    BookingDetails,
    PackageDetails,
    VehicleTypeDetails,
    AddBookingDetails,
    EditBookingDetails,
    CustomerBookingSummary,
)
from services.bookings_service import (
    get_packages,
    get_vehicle_types,
    get_bookings_by_filter,
    get_bookings_by_date,
    get_booking_by_id,
    get_next_upcoming_booking,
    add_booking,
    update_booking,
    update_payment,
    delete_booking,
    get_bookings_by_customer,
)
from services.oauth import get_current_user
from utils.exceptions import BookingNotFoundException, InvalidFilterException

bookings_router = APIRouter(
    prefix="/bookings",
    tags=["Booking"],
    responses={404: {"description": "Not found"}},
)


@bookings_router.get("/packages", response_model=List[PackageDetails], description="Get all wash packages.")
def list_packages(db: Session = Depends(get_db)):
    try:
        return get_packages(db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@bookings_router.get("/vehicle-types", response_model=List[VehicleTypeDetails], description="Get all vehicle types.")
def list_vehicle_types(db: Session = Depends(get_db)):
    try:
        return get_vehicle_types(db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@bookings_router.get(
    "/by-filter",
    response_model=List[BookingDetails],
    dependencies=[Depends(get_current_user)],
    description="Filter bookings by status or date range (today, upcoming, past, pending, confirmed, completed, cancelled).",
)
def filter_bookings(filter: str = Query(...), db: Session = Depends(get_db)):
    try:
        return get_bookings_by_filter(filter, db)
    except InvalidFilterException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@bookings_router.get(
    "/by-date",
    response_model=List[BookingDetails],
    dependencies=[Depends(get_current_user)],
    description="Get bookings for a specific date (YYYY-MM-DD).",
)
def bookings_by_date(date: str = Query(...), db: Session = Depends(get_db)):
    try:
        return get_bookings_by_date(date, db)
    except InvalidFilterException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@bookings_router.get(
    "/next-booking",
    response_model=BookingDetails,
    dependencies=[Depends(get_current_user)],
    description="Get the next upcoming booking for today.",
)
def next_booking(db: Session = Depends(get_db)):
    try:
        return get_next_upcoming_booking(db)
    except BookingNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@bookings_router.get(
    "/by-customer/{customer_id}",
    response_model=List[CustomerBookingSummary],
    dependencies=[Depends(get_current_user)],
    description="Get all bookings for a customer.",
)
def customer_bookings(customer_id: int, db: Session = Depends(get_db)):
    try:
        return get_bookings_by_customer(customer_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@bookings_router.get(
    "/{booking_id}",
    response_model=BookingDetails,
    dependencies=[Depends(get_current_user)],
    description="Get a booking by ID.",
)
def booking_by_id(booking_id: int, db: Session = Depends(get_db)):
    try:
        return get_booking_by_id(booking_id, db)
    except BookingNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@bookings_router.post(
    "/submit",
    response_model=dict,
    dependencies=[Depends(get_current_user)],
    description="Create a new booking.",
)
def create_booking(details: AddBookingDetails, db: Session = Depends(get_db)):
    try:
        return add_booking(details, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@bookings_router.put(
    "/update/{booking_id}",
    response_model=dict,
    dependencies=[Depends(get_current_user)],
    description="Update booking details.",
)
def edit_booking(booking_id: int, details: EditBookingDetails, db: Session = Depends(get_db)):
    try:
        return update_booking(booking_id, details, db)
    except BookingNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@bookings_router.put(
    "/update-payment/{booking_id}",
    response_model=dict,
    dependencies=[Depends(get_current_user)],
    description="Update payment details for a booking.",
)
def edit_payment(booking_id: int, details: EditBookingDetails, db: Session = Depends(get_db)):
    try:
        return update_payment(booking_id, details, db)
    except BookingNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@bookings_router.delete(
    "/delete/{booking_id}",
    response_model=dict,
    dependencies=[Depends(get_current_user)],
    description="Cancel/delete a booking.",
)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    try:
        return delete_booking(booking_id, db)
    except BookingNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
