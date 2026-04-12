from sqlalchemy.orm import Session
from datetime import date, datetime
from db.models.sqlalchemy_models import Booking, Packages, VehicleType
from db.models.pydantic_models import AddBookingDetails, EditBookingDetails, AddPackageDetails, EditPackageDetails
from utils.exceptions import BookingNotFoundException, InvalidFilterException
from utils.db_utils import build_booking_details, get_active_packages, get_active_vehicle_types

ALLOWED_FILTERS = ["today", "upcoming", "past", "pending", "confirmed", "completed", "cancelled"]


def get_packages(db: Session):
    return get_active_packages(db)


def get_all_packages(db: Session):
    return db.query(Packages).all()


def add_package(details: AddPackageDetails, db: Session):
    pkg = Packages(
        package_name=details.package_name,
        description=details.description,
        price=details.price,
        is_active=details.is_active,
    )
    db.add(pkg)
    db.commit()
    db.refresh(pkg)
    return pkg


def update_package(package_id: int, details: EditPackageDetails, db: Session):
    pkg = db.query(Packages).filter(Packages.package_id == package_id).first()
    if not pkg:
        raise Exception(f"Package {package_id} not found.")
    for field, value in details.model_dump(exclude_unset=True).items():
        setattr(pkg, field, value)
    db.commit()
    db.refresh(pkg)
    return pkg


def delete_package(package_id: int, db: Session):
    pkg = db.query(Packages).filter(Packages.package_id == package_id).first()
    if not pkg:
        raise Exception(f"Package {package_id} not found.")
    db.delete(pkg)
    db.commit()
    return {"detail": "Package deleted."}


def get_vehicle_types(db: Session):
    return get_active_vehicle_types(db)


def get_bookings_by_filter(filter: str, db: Session):
    if filter not in ALLOWED_FILTERS:
        raise InvalidFilterException(filter, ALLOWED_FILTERS)

    today = date.today()
    query = db.query(Booking)

    if filter == "today":
        query = query.filter(Booking.appointment_date == today)
    elif filter == "upcoming":
        query = query.filter(Booking.appointment_date > today)
    elif filter == "past":
        query = query.filter(Booking.appointment_date < today)
    else:
        query = query.filter(Booking.status == filter)

    bookings = query.order_by(Booking.appointment_date, Booking.appointment_time).all()
    return [build_booking_details(b, db) for b in bookings]


def get_bookings_by_date(date_str: str, db: Session):
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise InvalidFilterException(date_str, ["YYYY-MM-DD format required"])
    bookings = db.query(Booking).filter(Booking.appointment_date == target_date).all()
    return [build_booking_details(b, db) for b in bookings]


def get_booking_by_id(booking_id: int, db: Session):
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if not booking:
        raise BookingNotFoundException(f"Booking with ID {booking_id} not found.")
    return build_booking_details(booking, db)


def get_next_upcoming_booking(db: Session):
    today = date.today()
    now_time = datetime.now().strftime("%H:%M")
    booking = (
        db.query(Booking)
        .filter(Booking.appointment_date == today, Booking.appointment_time >= now_time)
        .order_by(Booking.appointment_time)
        .first()
    )
    if not booking:
        raise BookingNotFoundException("No upcoming bookings for today.")
    return build_booking_details(booking, db)


def add_booking(details: AddBookingDetails, db: Session) -> dict:
    booking = Booking(
        customer_id=details.customer_id,
        package_id=details.package_id,
        vehicle_type_id=details.vehicle_type_id,
        vehicle_number=details.vehicle_number,
        appointment_date=details.appointment_date,
        appointment_time=details.appointment_time,
        status=details.status or "pending",
        notes=details.notes,
        payment_mode=details.payment_mode,
        payment_total=details.payment_total,
        payment_paid=details.payment_paid,
        payment_notes=details.payment_notes,
        additional_services=details.additional_services,
        created_by=details.created_by,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"message": "Booking created successfully.", "booking_id": booking.booking_id}


def update_booking(booking_id: int, details: EditBookingDetails, db: Session) -> dict:
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if not booking:
        raise BookingNotFoundException(f"Booking with ID {booking_id} not found.")

    for field, value in details.model_dump(exclude_none=True).items():
        setattr(booking, field, value)
    booking.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Booking updated successfully."}


def update_payment(booking_id: int, details: EditBookingDetails, db: Session) -> dict:
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if not booking:
        raise BookingNotFoundException(f"Booking with ID {booking_id} not found.")

    payment_fields = ["payment_mode", "payment_total", "payment_paid", "payment_notes"]
    for field in payment_fields:
        val = getattr(details, field, None)
        if val is not None:
            setattr(booking, field, val)
    booking.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Payment updated successfully."}


def delete_booking(booking_id: int, db: Session) -> dict:
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if not booking:
        raise BookingNotFoundException(f"Booking with ID {booking_id} not found.")
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully."}


def get_bookings_by_customer(customer_id: int, db: Session):
    bookings = db.query(Booking).filter(Booking.customer_id == customer_id).all()
    results = []
    for b in bookings:
        pkg = db.query(Packages).filter(Packages.package_id == b.package_id).first()
        vt = db.query(VehicleType).filter(VehicleType.vehicle_type_id == b.vehicle_type_id).first()
        results.append({
            "booking_id": b.booking_id,
            "appointment_date": b.appointment_date,
            "appointment_time": b.appointment_time,
            "package_name": pkg.package_name if pkg else None,
            "vehicle_type_name": vt.vehicle_name if vt else None,
            "vehicle_number": b.vehicle_number,
            "status": b.status,
            "payment_total": b.payment_total,
        })
    return results
