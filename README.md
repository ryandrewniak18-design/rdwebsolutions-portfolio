# RPD Business LLC

Marketing that grows local service businesses. Tracked to the dollar.

This standalone site recreates the public information and five-page structure of https://rpd-growth-engine.base44.app/, with refined layouts, scroll reveals, staggered entrances, reading progress, hover interactions, and reduced-motion support.

## Pages

- `/` — Homepage, five systems, Big Cat engagement, process, and FAQ
- `/services/` — All five services and how they are measured
- `/work/` — Big Cat Performance & Physical Therapy scope, timeline, and baseline metrics
- `/about/` — Ryan Drewniak and the five operating rules
- `/contact/` — Growth audit form, contact details, and audit deliverables

Content and case-study statuses are copied from the source site, not dynamically synced. Old RD Web Solutions pricing is no longer used.

## Development / Base44 preview

Run `docker compose -f docker-compose.base44.yml up -d --build` and open `http://localhost:3000/`. The container installs the pinned watcher dependency at startup and serves the bind-mounted checkout with `server.py`. Backend changes restart through polling; refresh the browser for HTML, CSS, and JavaScript changes. No database or migrations are required.

Check service health with `docker compose -f docker-compose.base44.yml ps` and page content with `curl -fsS http://localhost:3000/`. Stop with `docker compose -f docker-compose.base44.yml down`. For syntax checks, run `python -m py_compile server.py` inside the container, directing its bytecode cache to `/tmp`.

`site.js` supplies shared navigation and enhances page transitions without preventing direct loads. `motion.js` animates content as it enters the viewport and respects reduced-motion preferences. `contact.js` handles audit form requests. Styles live in `styles.css`.

## Email delivery

Audit requests go to **rpdbusinessllc@gmail.com**. Configure `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_FROM` securely in Base44 Secrets. For Gmail, use `smtp.gmail.com`, your Gmail login and sender address, and an app password from your Google Account's Security settings (requires two-step verification). Do not put credentials in this repository or chat.

`SMTP_PORT` is optional: 587 by default (verified STARTTLS), or 465 (verified implicit TLS). Secrets are delivered via `/run/base44/app.env`, the last Compose env file, without environment overrides. The site boots without them, but the form then returns an explicit not-sent error with direct email/phone alternatives. Nothing is stored locally. A success response means the SMTP server accepted the email, not guaranteed inbox delivery.

Compose sets `AUDIT_ALLOWED_ORIGIN` to `https://3000-${BASE44_PUBLIC_HOST_SUFFIX}` so the public preview's same-origin form requests pass origin checks behind the proxy. This is an ordinary configurable public-origin setting. Without it, `server.py` checks Origin against Host. No preview flag overrides or security bypasses are used.

## Deployment

No production hosting is configured. The frontend can be hosted statically (deploy all HTML directories, CSS, and scripts), but `/api/audit` requires the Python server or an equivalent email backend. For a full deployment run `python server.py` behind a production HTTPS reverse proxy, set the exact public `AUDIT_ALLOWED_ORIGIN`, configure SMTP credentials, and add edge rate limiting. Do not expose the whole repository as a production static directory: serve only the public website files. Public images and fonts are loaded from the original site and Google Fonts.
