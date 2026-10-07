# Project notes

- This checkout is a static site: `index.html` (a redirect page to the live app) plus `README.md`. There is no JavaScript framework, build step, database, or dependencies.
- The Base44 Compose service serves the bind-mounted checkout directly with Python's built-in static HTTP server on port 3000. No credentials or migrations are required.
- Files are read on every request; there is no browser live-reload mechanism. Reload the preview after edits.
- Verify locally with `curl -fsS http://localhost:3000/` and `docker compose -f docker-compose.base44.yml ps`.
- The `index.html` redirects to `https://untitled-app-379fccf0.base44.app` via a meta refresh and inline script; inside the preview iframe that navigation may be blocked by the target site's frame policy, which is expected and not a build failure — the server itself is healthy as long as it returns the page with HTTP 200.
