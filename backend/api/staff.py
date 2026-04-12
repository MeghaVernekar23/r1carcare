from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.sessions import get_db
from db.models.pydantic_models import StaffDetails, AddStaffDetails, StaffHolidayDetails, AddStaffHolidayDetails
from services.staff_service import (
    get_all_staff,
    add_staff,
    update_staff,
    delete_staff,
    get_staff_holidays,
    add_staff_holiday,
    delete_staff_holiday,
)
from services.oauth import get_current_user
from utils.exceptions import StaffNotFoundException

staff_router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
    responses={404: {"description": "Not found"}},
)


@staff_router.get("/", response_model=List[StaffDetails], dependencies=[Depends(get_current_user)])
def list_staff(db: Session = Depends(get_db)):
    try:
        return get_all_staff(db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@staff_router.post("/add", response_model=dict, dependencies=[Depends(get_current_user)])
def create_staff(details: AddStaffDetails, db: Session = Depends(get_db)):
    try:
        return add_staff(details, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@staff_router.put("/update/{staff_id}", response_model=dict, dependencies=[Depends(get_current_user)])
def edit_staff(staff_id: int, details: AddStaffDetails, db: Session = Depends(get_db)):
    try:
        return update_staff(staff_id, details, db)
    except StaffNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@staff_router.delete("/delete/{staff_id}", response_model=dict, dependencies=[Depends(get_current_user)])
def remove_staff(staff_id: int, db: Session = Depends(get_db)):
    try:
        return delete_staff(staff_id, db)
    except StaffNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@staff_router.get("/{staff_id}/holidays", response_model=List[StaffHolidayDetails], dependencies=[Depends(get_current_user)])
def list_staff_holidays(staff_id: int, db: Session = Depends(get_db)):
    try:
        return get_staff_holidays(staff_id, db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@staff_router.post("/holidays/add", response_model=dict, dependencies=[Depends(get_current_user)])
def add_holiday(details: AddStaffHolidayDetails, db: Session = Depends(get_db)):
    try:
        return add_staff_holiday(details, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@staff_router.delete("/holidays/delete/{holiday_id}", response_model=dict, dependencies=[Depends(get_current_user)])
def remove_holiday(holiday_id: int, db: Session = Depends(get_db)):
    try:
        return delete_staff_holiday(holiday_id, db)
    except StaffNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
