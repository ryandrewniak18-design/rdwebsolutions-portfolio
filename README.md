# RD Web Solutions

Professional websites for local businesses in the Canton, Ohio area.

**Starting at $200 · Live in 5–7 days · Unlimited revisions**

Standalone static website built with HTML and CSS.

## Services
- Basic Website — $200
- Premium Website — $400

## Contact
Ryandrewniak18@gmail.com

## Local development / Base44 preview

This repository contains a standalone responsive website for RD Web Solutions. Edit `index.html` for content and `styles.css` for styling.

Run `docker compose -f docker-compose.base44.yml up -d` and open `http://localhost:3000/`. The Python static server serves the checkout directly; changes are available on the next request, but you must refresh the browser to see them. No dependencies, credentials, database, or migrations are needed.

Check service health with `docker compose -f docker-compose.base44.yml ps` and the local page with `curl -fsS http://localhost:3000/`. Stop it with `docker compose -f docker-compose.base44.yml down`.

The site stays on the local preview without redirecting elsewhere. Navigation links jump to page sections, and contact links open the visitor's email application. There is no contact-form backend or payment processing. No sandbox-specific application overrides are used.

For deployment, upload `index.html` and `styles.css` to a static website host. No production hosting is configured in this repository.
