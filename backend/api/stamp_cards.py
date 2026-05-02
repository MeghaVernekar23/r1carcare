from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from db.sessions import get_db
from db.models.pydantic_models import StampCardCreate, StampCardResponse
from services.stamp_cards_service import (
    get_all_stamp_cards,
    get_stamp_card_by_customer_id,
    get_stamp_card_by_phone,
    purchase_stamp_card,
    record_wash,
    use_free_wash,
    StampCardNotFoundException,
)
from services.oauth import get_current_user

stamp_cards_router = APIRouter(
    prefix="/stamp-cards",
    tags=["Stamp Cards"],
    responses={404: {"description": "Not found"}},
)


@stamp_cards_router.get("/", response_model=List[StampCardResponse], dependencies=[Depends(get_current_user)])
def list_stamp_cards(db: Session = Depends(get_db)):
    try:
        return get_all_stamp_cards(db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@stamp_cards_router.get("/by-customer/{customer_id}", response_model=Optional[StampCardResponse], dependencies=[Depends(get_current_user)])
def get_card_by_customer(customer_id: int, db: Session = Depends(get_db)):
    try:
        return get_stamp_card_by_customer_id(customer_id, db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@stamp_cards_router.get("/by-phone/{phone}", response_model=Optional[StampCardResponse])
def get_card_by_phone(phone: str, db: Session = Depends(get_db)):
    try:
        return get_stamp_card_by_phone(phone, db)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@stamp_cards_router.post("/purchase", response_model=dict, dependencies=[Depends(get_current_user)])
def issue_stamp_card(details: StampCardCreate, db: Session = Depends(get_db)):
    try:
        return purchase_stamp_card(details, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@stamp_cards_router.post("/{card_id}/record-wash", response_model=dict, dependencies=[Depends(get_current_user)])
def record_customer_wash(card_id: int, db: Session = Depends(get_db)):
    try:
        return record_wash(card_id, db)
    except StampCardNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@stamp_cards_router.post("/{card_id}/use-free-wash", response_model=dict, dependencies=[Depends(get_current_user)])
def redeem_free_wash(card_id: int, db: Session = Depends(get_db)):
    try:
        return use_free_wash(card_id, db)
    except StampCardNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
