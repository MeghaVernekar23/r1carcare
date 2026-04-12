from sqlalchemy.orm import Session
from db.models.sqlalchemy_models import Customer
from db.models.pydantic_models import AddCustomerDetails
from utils.exceptions import CustomerNotFoundException
from utils.db_utils import get_customer_by_id


def get_all_customers(db: Session):
    return db.query(Customer).all()


def get_customer_by_phone_number(phone_number: str, db: Session):
    customer = db.query(Customer).filter(Customer.phone_number == phone_number).first()
    if not customer:
        raise CustomerNotFoundException(f"No customer found with phone number '{phone_number}'.")
    return customer


def add_customer(details: AddCustomerDetails, db: Session) -> dict:
    customer = Customer(
        name=details.name,
        phone_number=details.phone_number,
        email=details.email,
        address=details.address,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return {"message": "Customer added successfully.", "customer_id": customer.customer_id}


def update_customer(customer_id: int, details: AddCustomerDetails, db: Session) -> dict:
    customer = get_customer_by_id(customer_id, db)
    if not customer:
        raise CustomerNotFoundException(f"Customer with ID {customer_id} not found.")

    if details.name is not None:
        customer.name = details.name
    if details.phone_number is not None:
        customer.phone_number = details.phone_number
    if details.email is not None:
        customer.email = details.email
    if details.address is not None:
        customer.address = details.address

    db.commit()
    return {"message": "Customer updated successfully."}


def delete_customer(customer_id: int, db: Session) -> dict:
    customer = get_customer_by_id(customer_id, db)
    if not customer:
        raise CustomerNotFoundException(f"Customer with ID {customer_id} not found.")
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully."}
