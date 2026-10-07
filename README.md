# RD Web Solutions

Professional websites for local businesses in the Canton, Ohio area.

**Starting at $200 · Live in 5–7 days · Unlimited revisions**

Visit: https://untitled-app-379fccf0.base44.app

## Services
- Basic Website — $200
- Premium Website — $400

## Contact
Ryandrewniak18@gmail.com

## Local development / Base44 preview

This repository contains only a static redirect page pointing to the website above, not that website's application source.

Run `docker compose -f docker-compose.base44.yml up -d` and open `http://localhost:3000/`. The Python static server serves the checkout directly; changes are available on the next request, but you must refresh the browser to see them. No dependencies, credentials, database, or migrations are needed.

Check service health with `docker compose -f docker-compose.base44.yml ps` and the local page with `curl -fsS http://localhost:3000/`. Stop it with `docker compose -f docker-compose.base44.yml down`.

The preview preserves the original redirect, so viewing the destination depends on that external website being available and allowing access. To edit the website itself, import its actual source repository. No sandbox-specific application overrides are used.
