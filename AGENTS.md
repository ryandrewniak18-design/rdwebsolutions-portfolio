# Project notes

- This checkout is only a static redirect (`index.html`), not the source for the linked Base44 website. Do not invent or reconstruct that website as part of environment setup.
- The Base44 Compose service serves the bind-mounted checkout directly with Python's static HTTP server. No dependencies, database, migrations, or credentials are required.
- Files are read on every request; there is no browser live-reload mechanism. Reload the preview after edits.
- Verify locally with `curl -fsS http://localhost:3000/` and `docker compose -f docker-compose.base44.yml ps`. Expect the original HTML with both meta-refresh and JavaScript redirects. Browser behavior also depends on the external redirect destination, which is not controlled by this checkout.
