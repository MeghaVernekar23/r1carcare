from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.sessions import get_db
from db.models.pydantic_models import CustomerDetails, AddCustomerDetails
from services.customers_service import (
    get_all_customers,
    get_customer_by_phone_number,
    add_customer,
    update_customer,
    delete_customer,
    get_last_vehicle_for_customer,
)
from services.oauth import get_current_user
from utils.exceptions import CustomerNotFoundException

customer_router = APIRouter(
    prefix="/customers",
    tags=["Customer"],
    responses={404: {"description": "Not found"}},
)


@customer_router.get("/", response_model=List[CustomerDetails], dependencies=[Depends(get_current_user)])
def list_customers(db: Session = Depends(get_db)):
    try:
        return get_all_customers(db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@customer_router.get("/details/{phone_number}", response_model=CustomerDetails)
def get_customer(phone_number: str, db: Session = Depends(get_db)):
    try:
        return get_customer_by_phone_number(phone_number, db)
    except CustomerNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@customer_router.post("/submit", response_model=dict, dependencies=[Depends(get_current_user)])
def create_customer(details: AddCustomerDetails, db: Session = Depends(get_db)):
    try:
        return add_customer(details, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@customer_router.put("/update/{customer_id}", response_model=dict, dependencies=[Depends(get_current_user)])
def edit_customer(customer_id: int, details: AddCustomerDetails, db: Session = Depends(get_db)):
    try:
        return update_customer(customer_id, details, db)
    except CustomerNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@customer_router.delete("/delete/{customer_id}", response_model=dict, dependencies=[Depends(get_current_user)])
def remove_customer(customer_id: int, db: Session = Depends(get_db)):
    try:
        return delete_customer(customer_id, db)
    except CustomerNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@customer_router.get("/vehicle/{phone_number}")
def get_vehicle_info(phone_number: str, db: Session = Depends(get_db)):
    try:
        return get_last_vehicle_for_customer(phone_number, db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
