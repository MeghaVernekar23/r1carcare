import datetime
from calendar import monthrange
from sqlalchemy.orm import Session
from db.models.sqlalchemy_models import StampCard, Customer
from db.models.pydantic_models import StampCardCreate


def _add_months(date: datetime.date, months: int) -> datetime.date:
    month = date.month + months
    year = date.year + (month - 1) // 12
    month = (month - 1) % 12 + 1
    day = min(date.day, monthrange(year, month)[1])
    return date.replace(year=year, month=month, day=day)


class StampCardNotFoundException(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


def _sync_expiry(card: StampCard, db: Session):
    if card.status == "active" and card.expiry_date < datetime.date.today():
        card.status = "expired"
        db.commit()


def _build_response(card: StampCard, db: Session) -> dict:
    customer = db.query(Customer).filter(Customer.customer_id == card.customer_id).first()
    return {
        "card_id": card.card_id,
        "customer_id": card.customer_id,
        "customer_name": customer.name if customer else None,
        "customer_phone": customer.phone_number if customer else None,
        "total_washes": card.total_washes,
        "washes_used": card.washes_used,
        "washes_remaining": max(0, card.total_washes - card.washes_used),
        "free_wash_earned": card.free_wash_earned,
        "free_wash_used": card.free_wash_used,
        "birthday_box_discount": card.birthday_box_discount,
        "birthday_box_discount_pct": card.birthday_box_discount_pct,
        "price_paid": card.price_paid,
        "purchase_date": card.purchase_date,
        "expiry_date": card.expiry_date,
        "status": card.status,
        "plan_type": card.plan_type or "annual",
        "validity_months": card.validity_months or 12,
        "notes": card.notes,
        "created_at": card.created_at,
    }


def get_all_stamp_cards(db: Session) -> list:
    cards = db.query(StampCard).order_by(StampCard.created_at.desc()).all()
    for card in cards:
        _sync_expiry(card, db)
    return [_build_response(c, db) for c in cards]


def get_stamp_card_by_customer_id(customer_id: int, db: Session):
    card = (
        db.query(StampCard)
        .filter(
            StampCard.customer_id == customer_id,
            StampCard.status.in_(["active", "completed"]),
        )
        .order_by(StampCard.created_at.desc())
        .first()
    )
    if not card:
        return None
    _sync_expiry(card, db)
    return _build_response(card, db)


def get_stamp_card_by_phone(phone: str, db: Session):
    customer = db.query(Customer).filter(Customer.phone_number == phone).first()
    if not customer:
        return None
    return get_stamp_card_by_customer_id(customer.customer_id, db)


def purchase_stamp_card(details: StampCardCreate, db: Session) -> dict:
    existing = (
        db.query(StampCard)
        .filter(StampCard.customer_id == details.customer_id, StampCard.status == "active")
        .first()
    )
    if existing:
        raise ValueError("Customer already has an active stamp card.")

    today = datetime.date.today()
    validity_months = details.validity_months or 12
    expiry = _add_months(today, validity_months)

    card = StampCard(
        customer_id=details.customer_id,
        total_washes=details.total_washes,
        washes_used=0,
        free_wash_earned=False,
        free_wash_used=False,
        birthday_box_discount=True,
        birthday_box_discount_pct=details.birthday_box_discount_pct,
        price_paid=details.price_paid,
        purchase_date=today,
        expiry_date=expiry,
        status="active",
        plan_type=details.plan_type or "annual",
        validity_months=validity_months,
        notes=details.notes,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return {"message": "Stamp card issued successfully.", "card_id": card.card_id}


def record_wash(card_id: int, db: Session) -> dict:
    card = db.query(StampCard).filter(StampCard.card_id == card_id).first()
    if not card:
        raise StampCardNotFoundException(f"Stamp card {card_id} not found.")
    if card.status == "expired":
        raise ValueError("This stamp card has expired.")
    if card.status == "completed" or card.washes_used >= card.total_washes:
        hint = " Redeem the free wash first." if card.free_wash_earned and not card.free_wash_used else ""
        raise ValueError("All washes on this card have been used." + hint)

    card.washes_used += 1
    card.updated_at = datetime.datetime.utcnow()

    if card.washes_used >= card.total_washes:
        card.free_wash_earned = True
        card.status = "completed"

    db.commit()
    return {
        "message": "Wash recorded successfully.",
        "washes_used": card.washes_used,
        "washes_remaining": max(0, card.total_washes - card.washes_used),
        "free_wash_earned": card.free_wash_earned,
    }


def use_free_wash(card_id: int, db: Session) -> dict:
    card = db.query(StampCard).filter(StampCard.card_id == card_id).first()
    if not card:
        raise StampCardNotFoundException(f"Stamp card {card_id} not found.")
    if not card.free_wash_earned:
        raise ValueError("Free wash not yet earned on this card.")
    if card.free_wash_used:
        raise ValueError("Free wash has already been redeemed.")

    card.free_wash_used = True
    card.updated_at = datetime.datetime.utcnow()
    db.commit()
    return {"message": "Free wash redeemed successfully."}
