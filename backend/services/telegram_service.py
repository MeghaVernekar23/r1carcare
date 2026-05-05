import asyncio
import os
import threading
from telethon import TelegramClient
from telethon.tl.functions.contacts import ImportContactsRequest
from telethon.tl.types import InputPhoneContact
from dotenv import load_dotenv

load_dotenv()

API_ID = int(str(os.getenv("API_ID", "")).strip())
API_HASH = str(os.getenv("API_HASH", "")).strip().strip("'\"")
SESSION_NAME = os.path.join(os.path.dirname(os.path.dirname(__file__)), "automated_sender")


def _build_message(customer_name: str, appointment_date, appointment_time: str, package_name: str) -> str:
    return (
        f"Hi {customer_name}!\n\n"
        f"Your booking at R1 Car Care has been confirmed.\n\n"
        f"Date: {appointment_date}\n"
        f"Time: {appointment_time}\n"
        f"Package: {package_name}\n\n"
        f"If you need to make any changes, please contact us. Thank you for choosing R1 Car Care!"
    )


async def _try_send(phone: str, message: str, customer_name: str = ""):
    async with TelegramClient(SESSION_NAME, API_ID, API_HASH) as client:
        first, *rest = customer_name.strip().split(" ", 1)
        last = rest[0] if rest else ""
        contact = InputPhoneContact(client_id=0, phone=phone, first_name=first or "Customer", last_name=last)
        result = await client(ImportContactsRequest([contact]))
        if result.users:
            await client.send_message(result.users[0], message)
            print(f"[Telegram] Message sent to {phone}")
        else:
            print(f"[Telegram] {phone} is not on Telegram, skipping.")


def _run_in_thread(phone: str, message: str, customer_name: str):
    try:
        asyncio.run(_try_send(phone, message, customer_name))
    except Exception as e:
        print(f"[Telegram] Failed to send to {phone}: {e}")


def _normalize_phone(phone: str) -> str:
    digits = phone.strip().replace(" ", "").replace("-", "")
    if digits.startswith("+"):
        return digits
    if digits.startswith("91") and len(digits) == 12:
        return "+" + digits
    if len(digits) == 10:
        return "+91" + digits
    return "+" + digits


def notify_booking_confirmation(
    customer_name: str,
    phone: str,
    appointment_date,
    appointment_time: str,
    package_name: str,
):
    if not phone:
        return
    normalized = _normalize_phone(phone)
    message = _build_message(customer_name, appointment_date, appointment_time, package_name)
    print(f"[Telegram] Attempting to notify {normalized} ({customer_name})")
    thread = threading.Thread(target=_run_in_thread, args=(normalized, message, customer_name), daemon=True)
    thread.start()
