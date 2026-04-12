from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.sessions import get_db
from db.models.pydantic_models import HolidayCreate, HolidayResponse
from services.holidays_service import get_all_holidays, add_holiday, delete_holiday
from services.oauth import get_current_user
from utils.exceptions import BookingNotFoundException

holidays_router = APIRouter(
    prefix="/holidays",
    tags=["Holidays"],
    responses={404: {"description": "Not found"}},
)


@holidays_router.get("/", response_model=List[HolidayResponse], dependencies=[Depends(get_current_user)])
def list_holidays(db: Session = Depends(get_db)):
    try:
        return get_all_holidays(db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@holidays_router.post("/submit", response_model=dict, dependencies=[Depends(get_current_user)])
def create_holiday(details: HolidayCreate, db: Session = Depends(get_db)):
    try:
        return add_holiday(details, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@holidays_router.delete("/{holiday_id}", response_model=dict, dependencies=[Depends(get_current_user)])
def remove_holiday(holiday_id: int, db: Session = Depends(get_db)):
    try:
        return delete_holiday(holiday_id, db)
    except BookingNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
