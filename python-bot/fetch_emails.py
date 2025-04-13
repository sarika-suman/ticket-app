import imaplib
import email
import json
import time
import uuid
import random
import smtplib
import requests
from email.utils import parseaddr
from email.message import EmailMessage
from transformers import pipeline
from datetime import datetime

# Load config
with open("config.json", "r") as f:
    config = json.load(f)

IMAP_SERVER = config["imap_server"]
EMAIL_ACCOUNT = config["email_account"]
EMAIL_PASSWORD = config["email_password"]
CHECK_INTERVAL = config.get("check_interval", 60)
BACKEND_URL = config.get("backend_url", "http://localhost:8080/ticket")  # <-- correct endpoint

# Hugging Face classifier
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

candidate_labels = [
    "Technology",
    "Accounts",
    "Delivery",
    "Finance",
    "Product",
    "Refund"
]

def generate_ticket_id():
    return f"RSL-{random.randint(1000, 9999)}-{uuid.uuid4().hex[:3].upper()}"

def send_auto_reply(to_email, ticket_id):
    msg = EmailMessage()
    msg["Subject"] = "Ticket Confirmation"
    msg["From"] = EMAIL_ACCOUNT
    msg["To"] = to_email
    msg.set_content(f"""Hi there 👋,

Your ticket has been successfully raised ✅  
🎟 Ticket ID: #{ticket_id}

Our team will get back to you shortly.

Regards,  
Resolveright Support 🤖
""")
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
        server.send_message(msg)
        print(f"✅ Sent auto-reply to {to_email}")

def classify_and_post(sender_email, message, ticket_id):
    timestamp = datetime.now().isoformat()
    result = classifier(message, candidate_labels)
    top_category = result["labels"][0]
    confidence = round(result["scores"][0], 4)

    payload = {
        "ticketId": ticket_id,
        "message": message,  # Let backend handle full message now
        "category": top_category,
        "confidence": confidence,
        "senderEmail": sender_email,
        "status": "Open",
        "createdAt": timestamp,
        "resolvedAt": None
    }

    # Save locally for debug/log
    with open("messages.json", "w") as f:
        json.dump(payload, f, indent=4)

    try:
        response = requests.post(BACKEND_URL, json=payload)
        if response.status_code in [200, 201, 202]:
            print("🚀 Ticket sent to backend successfully.")
        else:
            print(f"⚠️ Backend error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Failed to send to backend: {e}")

def process_emails():
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
        mail.select("inbox")

        result, data = mail.search(None, "(UNSEEN)")
        if result == "OK":
            for num in data[0].split():
                result, msg_data = mail.fetch(num, "(RFC822)")
                if result == "OK":
                    msg = email.message_from_bytes(msg_data[0][1])
                    sender = msg.get("From", "")
                    sender_email = parseaddr(sender)[1]

                    body = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain" and part.get_payload(decode=True):
                                body = part.get_payload(decode=True).decode(errors="ignore")
                                break
                    else:
                        body = msg.get_payload(decode=True).decode(errors="ignore")

                    if body:
                        print(f"📨 New message from {sender_email}")
                        ticket_id = generate_ticket_id()
                        send_auto_reply(sender_email, ticket_id)
                        classify_and_post(sender_email, body.strip(), ticket_id)

        mail.logout()
    except Exception as e:
        print(f"❌ Error: {e}")

# Main loop
while True:
    process_emails()
    print("⏳ Waiting for next check...\n")
    time.sleep(CHECK_INTERVAL)
