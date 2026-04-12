from sqlalchemy.orm import Session
from db.models.sqlalchemy_models import Staff, StaffHoliday
from db.models.pydantic_models import AddStaffDetails, AddStaffHolidayDetails
from utils.exceptions import StaffNotFoundException
from utils.db_utils import get_staff_by_id


def get_all_staff(db: Session):
    return db.query(Staff).order_by(Staff.name).all()


def add_staff(details: AddStaffDetails, db: Session) -> dict:
    member = Staff(
        name=details.name,
        phone_number=details.phone_number,
        role=details.role,
        status=details.status,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return {"message": "Staff member added successfully.", "staff_id": member.staff_id}


def update_staff(staff_id: int, details: AddStaffDetails, db: Session) -> dict:
    member = get_staff_by_id(staff_id, db)
    if not member:
        raise StaffNotFoundException(f"Staff member with ID {staff_id} not found.")
    if details.name is not None:
        member.name = details.name
    if details.phone_number is not None:
        member.phone_number = details.phone_number
    if details.role is not None:
        member.role = details.role
    if details.status is not None:
        member.status = details.status
    db.commit()
    return {"message": "Staff member updated successfully."}


def delete_staff(staff_id: int, db: Session) -> dict:
    member = get_staff_by_id(staff_id, db)
    if not member:
        raise StaffNotFoundException(f"Staff member with ID {staff_id} not found.")
    db.query(StaffHoliday).filter(StaffHoliday.staff_id == staff_id).delete()
    db.delete(member)
    db.commit()
    return {"message": "Staff member deleted successfully."}


def get_staff_holidays(staff_id: int, db: Session):
    return db.query(StaffHoliday).filter(StaffHoliday.staff_id == staff_id).order_by(StaffHoliday.date.desc()).all()


def add_staff_holiday(details: AddStaffHolidayDetails, db: Session) -> dict:
    holiday = StaffHoliday(
        staff_id=details.staff_id,
        date=details.date,
        reason=details.reason,
    )
    db.add(holiday)
    db.commit()
    db.refresh(holiday)
    return {"message": "Holiday added.", "id": holiday.id}


def delete_staff_holiday(holiday_id: int, db: Session) -> dict:
    holiday = db.query(StaffHoliday).filter(StaffHoliday.id == holiday_id).first()
    if not holiday:
        raise StaffNotFoundException(f"Holiday record with ID {holiday_id} not found.")
    db.delete(holiday)
    db.commit()
    return {"message": "Holiday removed."}
