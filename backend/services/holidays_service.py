from sqlalchemy.orm import Session
from db.models.sqlalchemy_models import Holiday
from db.models.pydantic_models import HolidayCreate


def get_all_holidays(db: Session):
    return db.query(Holiday).order_by(Holiday.date).all()


def add_holiday(details: HolidayCreate, db: Session) -> dict:
    holiday = Holiday(title=details.title, date=details.date)
    db.add(holiday)
    db.commit()
    db.refresh(holiday)
    return {"message": "Holiday added successfully.", "holiday_id": holiday.holiday_id}


def delete_holiday(holiday_id: int, db: Session) -> dict:
    holiday = db.query(Holiday).filter(Holiday.holiday_id == holiday_id).first()
    if not holiday:
        from utils.exceptions import BookingNotFoundException
        raise BookingNotFoundException(f"Holiday with ID {holiday_id} not found.")
    db.delete(holiday)
    db.commit()
    return {"message": "Holiday deleted successfully."}
