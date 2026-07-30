"""
BlueCards — Telegram Mass Broadcaster
==============================================================
WARNING: Telegram limits bots to 30 messages per second.
This script is throttled to 20 msgs/sec to guarantee safety.
"""

import os
import time
import requests
from dotenv import load_dotenv
from supabase import create_client

# ── 1. Load Environment Variables ─────────────────────────────
ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=ENV_FILE, override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "") # Using your standard anon/service key
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

if not all([SUPABASE_URL, SUPABASE_KEY, BOT_TOKEN]):
    raise RuntimeError("Missing required environment variables in .env")

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# ══════════════════════════════════════════════════════════════
# 🎯 THE CONFIGURATION ZONE (Edit this for each campaign)
# ══════════════════════════════════════════════════════════════

# 1. Your Promotional Message (All HTML tags are now safely closed!)
CAMPAIGN_TEXT = """
<b>🔥 💳 ብሉ ካርድ ልዩ ቅናሽ! / BlueCards Special Offer!</b>

💳 BlueCards — አስደናቂ የዶላር ምንዛሬ ተመን!
በአነስተኛ እና እጅግ በሚያስደስት የዶላር ምንዛሬ ተመን ዓለም አቀፍ ክፍያዎችን መፈጸም ይፈልጋሉ? ብሉ ካርድስ (BlueCards) ምርጥ መፍትሄ ይዞላችሁ ቀርቧል!
የቨርቹዋል ቪዛ (Visa) እና ማስተርካርድ (Mastercard) ባለቤት በመሆን በዓለም አቀፍ ደረጃ በቀላሉ ይገበያዩ፣ ያስታውቁ!
ለምን BlueCardsን ይመርጣሉ?
💸 እጅግ በጣም ቅናሽ እና ተወዳዳሪ የዶላር ምንዛሬ ተመን
🚀 ፈጣን እና አስተማማኝ የካርድ አወጣጥ አገልግሎት
🛒 ለፌስቡክ ማስታወቂያ (Facebook Ads)፣ ለአማዞን (Amazon)፣ ለኔትፍሊክስ (Netflix) እና ለሌሎችም ዓለም አቀፍ ድረ-ገጾች የሚሰራ
❌ ምንም አይነት ወርሃዊ የካርድ ማስጠበቂያ ክፍያ የሌለው
አሁኑኑ የቴሌግራም ሚኒ አፓችንን በመክፈት የራስዎን ካርድ ይፍጠሩ እና መጠቀም ይጀምሩ!
💬 ለማንኛውም ጥያቄ፣ አስተያየት ወይም እገዛ የእኛን የድጋፍ መስመር ያነጋግሩ፦ 🔗https://telegram.me/Blucardet

👇 <b>መተግበሪያውን ይክፈቱ / Open App</b> 👇
"""

# 2. Image URL (Leave as "" if you only want to send text)
# Update this with the real URL of your image
IMAGE_URL = "https://cdn.phototourl.com/free/2026-07-26-d97549d5-d9c2-4078-b002-3da2d10cd6d1.jpg" 

# 3. Test Mode (Set to True to send ONLY to yourself first)
TEST_MODE = False

# Your specific Telegram ID from the logs!
ADMIN_TG_ID = "373753326"  

# Database Configuration targeting the BlueCards setup
USERS_TABLE = "users" 
TG_ID_COLUMN = "chat_id"

# ══════════════════════════════════════════════════════════════

def send_message(chat_id: str, text: str, image_url: str = "") -> bool:
    """Hits the Telegram API to send the message/photo."""
    
    if image_url:
        # Send Photo with Caption
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
        payload = {
            "chat_id": chat_id,
            "photo": image_url,
            "caption": text,
            "parse_mode": "HTML"
        }
    else:
        # Send Text Only
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True
        }

    try:
        response = requests.post(url, json=payload, timeout=10)
        data = response.json()
        
        if data.get("ok"):
            return True
        else:
            # Handle users who blocked the bot
            if data.get("error_code") == 403:
                pass  # Silenced output to avoid spamming the console for blocked users
            else:
                print(f"⚠️ Failed to send to {chat_id}: {data.get('description')}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error sending to {chat_id}: {e}")
        return False

def get_all_human_users():
    """Fetches all users from Supabase using pagination."""
    all_users = []
    chunk_size = 1000
    start_index = 0
    
    while True:
        try:
            # Paginates through the 'users' table pulling the 'chat_id'
            res = sb.table(USERS_TABLE)\
                .select(TG_ID_COLUMN)\
                .range(start_index, start_index + chunk_size - 1)\
                .execute()
                
            chunk = res.data or []
            if not chunk:
                break # We've hit the end of the table
                
            all_users.extend(chunk)
            start_index += chunk_size
            print(f"🔄 Fetched batch: {len(all_users)} users so far...")
            
        except Exception as e:
            print(f"❌ Pagination error: {e}")
            break
            
    return all_users

def main():
    print("=" * 50)
    print("📢 BLUECARDS BROADCAST INITIATED")
    print("=" * 50)

    if TEST_MODE:
        print(f"🧪 TEST MODE ENABLED: Sending only to Admin ({ADMIN_TG_ID})...")
        success = send_message(ADMIN_TG_ID, CAMPAIGN_TEXT.strip(), IMAGE_URL)
        if success:
            print("✅ Test message delivered successfully! Check your Telegram.")
        else:
            print("❌ Test message failed.")
        return

    # --- PRODUCTION BROADCAST ---
    print("📡 Fetching user list from database (Paginating to break 1000 limit)...")
    users = get_all_human_users()

    total_users = len(users)
    if total_users == 0:
        print("❌ No valid users found to message.")
        return
        
    print(f"\n👥 Found {total_users} target users. Starting broadcast...\n")

    successful_sends = 0
    failed_sends = 0

    for index, user in enumerate(users):
        tg_id = user.get(TG_ID_COLUMN)
        if not tg_id:
            continue

        if send_message(tg_id, CAMPAIGN_TEXT.strip(), IMAGE_URL):
            successful_sends += 1
        else:
            failed_sends += 1

        # Progress tracker
        if (index + 1) % 100 == 0:
            print(f"⏳ Progress: {index + 1} / {total_users} processed...")

        # 🛡 THE SAFETY SHIELD: Sleep to ensure we stay under 30 msgs/sec
        time.sleep(0.05) 

    print("\n" + "=" * 50)
    print("🏁 BROADCAST COMPLETE")
    print(f"✅ Delivered: {successful_sends}")
    print(f"❌ Failed/Blocked: {failed_sends}")
    print("=" * 50)

if __name__ == "__main__":
    main()