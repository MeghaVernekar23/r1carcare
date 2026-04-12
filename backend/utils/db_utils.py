from sqlalchemy.orm import Session
from db.models.sqlalchemy_models import Users, Booking, Customer, Packages, VehicleType, Staff


def get_user_by_username(username: str, db: Session):
    return db.query(Users).filter(Users.username == username).first()


def get_customer_by_phone(phone_number: str, db: Session):
    return db.query(Customer).filter(Customer.phone_number == phone_number).first()


def get_customer_by_id(customer_id: int, db: Session):
    return db.query(Customer).filter(Customer.customer_id == customer_id).first()


def get_active_packages(db: Session):
    return db.query(Packages).filter(Packages.is_active == 1).all()


def get_active_vehicle_types(db: Session):
    return db.query(VehicleType).filter(VehicleType.active == 1).all()


def get_staff_by_id(staff_id: int, db: Session):
    return db.query(Staff).filter(Staff.staff_id == staff_id).first()


def build_booking_details(booking: Booking, db: Session) -> dict:
    customer = get_customer_by_id(booking.customer_id, db) if booking.customer_id else None
    package = db.query(Packages).filter(Packages.package_id == booking.package_id).first() if booking.package_id else None
    vehicle_type = db.query(VehicleType).filter(VehicleType.vehicle_type_id == booking.vehicle_type_id).first() if booking.vehicle_type_id else None

    return {
        "booking_id": booking.booking_id,
        "customer_id": booking.customer_id,
        "customer_name": customer.name if customer else None,
        "customer_phone": customer.phone_number if customer else None,
        "package_id": booking.package_id,
        "package_name": package.package_name if package else None,
        "vehicle_type_id": booking.vehicle_type_id,
        "vehicle_type_name": vehicle_type.vehicle_name if vehicle_type else None,
        "vehicle_number": booking.vehicle_number,
        "appointment_date": booking.appointment_date,
        "appointment_time": booking.appointment_time,
        "status": booking.status,
        "notes": booking.notes,
        "payment_mode": booking.payment_mode,
        "payment_total": booking.payment_total,
        "payment_paid": booking.payment_paid,
        "payment_notes": booking.payment_notes,
        "additional_services": booking.additional_services,
        "created_at": booking.created_at,
    }
