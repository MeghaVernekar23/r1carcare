import asyncio
from telethon import TelegramClient
from telethon.tl.functions.contacts import ImportContactsRequest
from telethon.tl.types import InputPhoneContact

# 1. Setup - Use your credentials from my.telegram.org

SESSION_NAME = 'automated_sender' # This creates 'automated_sender.session'

# 2. Your target list
TARGET_NUMBERS = ['+919353486424', '+918971543330'] 
MESSAGE = "Hello! This is an automated message. You are a user of R1 Car Care. We are here to assist you with your car care needs. If you have any questions or need assistance, please feel free to reach out to us. Thank you for being a part of the R1 Car Care community!"

async def main():
    # The first time you run this, it will prompt for your phone/code in the terminal.
    # After that, it uses the .session file and runs automatically.
    async with TelegramClient(SESSION_NAME, API_ID, API_HASH) as client:
        for phone in TARGET_NUMBERS:
            try:
                print(f"Processing {phone}...")
                
                # Import the number as a temporary contact (Required for non-saved numbers)
                contact = InputPhoneContact(client_id=0, phone=phone, first_name="User", last_name="")
                result = await client(ImportContactsRequest([contact]))
                
                if result.users:
                    user = result.users[0]
                    await client.send_message(user, MESSAGE)
                    print(f"✅ Sent to {phone}")
                else:
                    print(f"❌ {phone} is not on Telegram.")
                
                # IMPORTANT: Sleep to avoid being banned for spamming
                await asyncio.sleep(5) 

            except Exception as e:
                print(f"⚠️ Error with {phone}: {e}")

if __name__ == "__main__":
    asyncio.run(main())
