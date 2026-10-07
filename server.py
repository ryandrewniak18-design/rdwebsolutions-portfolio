"""Serve the source website and deliver audit requests through configured SMTP."""
import json
import os
import re
import smtplib
import ssl
import time
from collections import defaultdict
from email.message import EmailMessage
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Lock
from urllib.parse import urlsplit

ATTEMPTS = defaultdict(list)
ATTEMPTS_LOCK = Lock()
EMAIL_RE = re.compile(r"[^\s<>@\r\n]+@[^\s<>@\r\n]+\.[^\s<>@\r\n]+")


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Never log POST payloads or SMTP credentials.
        super().log_message(fmt, *args)

    def send_json(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if urlsplit(self.path).path != "/api/audit":
            return self.send_json(404, {"error": "Not found."})
        origin = self.headers.get("Origin", "")
        allowed = os.environ.get("AUDIT_ALLOWED_ORIGIN", "").rstrip("/")
        parsed = urlsplit(origin)
        same_origin = parsed.scheme in ("http", "https") and parsed.netloc == self.headers.get("Host")
        if not origin or (origin != allowed if allowed else not same_origin):
            return self.send_json(403, {"error": "This request must come from the website."})
        if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
            return self.send_json(415, {"error": "Unsupported request format."})
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if not 0 < size <= 20000:
                return self.send_json(413, {"error": "Your request is too large."})
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict):
                raise ValueError("Invalid request")
            fields = {}
            for key, limit in {"name": 200, "email": 254, "phone": 50, "business": 200, "website": 500, "problem": 5000, "company_url": 500}.items():
                value = data.get(key, "")
                if not isinstance(value, str) or len(value) > limit:
                    raise ValueError("Invalid field")
                fields[key] = value.strip()
            if fields["company_url"]:
                return self.send_json(400, {"error": "Unable to accept this request."})
            if any(not fields[key] for key in ("name", "email", "business", "problem")) or not EMAIL_RE.fullmatch(fields["email"]):
                return self.send_json(400, {"error": "Please complete your name, a valid email, business name, and marketing problem."})
        except (ValueError, UnicodeError):
            return self.send_json(400, {"error": "Please check the form and try again."})
        required = ("SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM")
        if any(not os.environ.get(key) for key in required):
            return self.send_json(503, {"error": "Your request was not sent: email delivery is not connected yet. Please email rpdbusinessllc@gmail.com or call (330) 437-8842."})
        now = time.monotonic()
        # Peer addresses are used, not spoofable forwarding headers.
        with ATTEMPTS_LOCK:
            for address in list(ATTEMPTS):
                ATTEMPTS[address] = [t for t in ATTEMPTS[address] if now - t < 600]
                if not ATTEMPTS[address]:
                    del ATTEMPTS[address]
            address = self.client_address[0]
            if len(ATTEMPTS[address]) >= 5:
                return self.send_json(429, {"error": "Please wait before sending another request, or contact us by email or phone."})
            ATTEMPTS[address].append(now)
        message = EmailMessage()
        try:
            message["Subject"] = "New RPD growth audit request"
            message["From"] = os.environ["SMTP_FROM"]
            message["To"] = "rpdbusinessllc@gmail.com"
            message["Reply-To"] = fields["email"]
            message.set_content("\n\n".join(f"{key.title()}: {fields[key]}" for key in ("name", "email", "phone", "business", "website", "problem")))
            host = os.environ["SMTP_HOST"]
            port = int(os.environ.get("SMTP_PORT", "587"))
            context = ssl.create_default_context()
            if port == 465:
                connection = smtplib.SMTP_SSL(host, port, timeout=15, context=context)
            else:
                connection = smtplib.SMTP(host, port, timeout=15)
            with connection as smtp:
                if port != 465:
                    smtp.starttls(context=context)
                smtp.login(os.environ["SMTP_USERNAME"], os.environ["SMTP_PASSWORD"])
                refused = smtp.send_message(message)
                if refused:
                    raise smtplib.SMTPException("Recipient refused")
        except (smtplib.SMTPException, OSError, ValueError):
            return self.send_json(502, {"error": "Your request was not sent. Please try again, email rpdbusinessllc@gmail.com, or call (330) 437-8842."})
        self.send_json(200, {"sent": True})


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 3000), Handler).serve_forever()
