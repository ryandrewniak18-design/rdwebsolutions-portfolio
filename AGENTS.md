# Project notes

- This checkout now contains a standalone RD Web Solutions website in `index.html` and `styles.css`; there is no external redirect or JavaScript framework.
- The Base44 Compose service serves the bind-mounted checkout directly with Python's static HTTP server. No dependencies, database, migrations, or credentials are required.
- Files are read on every request; there is no browser live-reload mechanism. Reload the preview after edits.
- Verify locally with `curl -fsS http://localhost:3000/`, `curl -fsS http://localhost:3000/styles.css`, and `docker compose -f docker-compose.base44.yml ps`. Check tablet and mobile layouts in preview.
- Contact and plan links use `mailto:` to the existing business email. They open the visitor's email application; there is no server-side form delivery or payment processing.
