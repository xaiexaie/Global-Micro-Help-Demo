# Global-Micro-Help Demo (PWA)

A lightweight, client-only Progressive Web App prototype for posting and claiming very small, local needs or offers.

**Why this demo**
- Demonstrates a minimal, local-first workflow for micro-help posts and claims.
- Shows how a PWA can remain useful offline using a service worker and localStorage.
- Good starting point for adding synchronization, authentication, or moderation later.

**Features included**
- Offline-capable UI (caching via `sw.js`).
- Client-only data storage in `localStorage` (`app.js`).
- PWA metadata and icons (`manifest.json`, `icons/`) so the demo can be installed on mobile/desktop.
- Minimal, readable code: `index.html`, `styles.css`, `app.js`, `sw.js`.

Files of interest
- index.html — app UI
- app.js — app logic (posts, claims, localStorage)
- styles.css — simple styles
- sw.js — service worker for caching
- manifest.json + icons/ — PWA install assets

Quick start (local preview)
1. Open a terminal in this project folder.
2. Start a static server (service worker requires `localhost` or `https`):

    - Recommended (Node):

       npx http-server -c-1 -p 8080

    - Or (Python 3):

       python -m http.server 8000

3. Open the URL shown by the server (e.g., `http://localhost:8080`).
4. Create a sample Need or Offer and test offline behavior by disabling your network and reloading.

What to expect
- Posts and claims are stored locally in your browser — refreshing or installing the app keeps the local data persistent on that machine only.
- The service worker caches app shell files so the UI loads while offline; network sync is not implemented.

Suggested next steps for a production release
- Add a tiny backend and database for multi-user sync and persistence.
- Add lightweight identity (email/phone) and verification flows for trust.
- Harden storage and migration strategy beyond `localStorage` (IndexedDB or server sync).

Release / Sneak-peek blurb (copy for GitHub release notes)
"Global-Micro-Help — a minimal PWA prototype showing how tiny local needs and offers can be posted and claimed directly from the browser. Offline-capable, installable, and built with simple client-side code to serve as a foundation for future sync and verification features."

If you want, I can also:
- Draft a short release description for your GitHub release page.
- Create a small screenshot gallery and a `release.md` with instructions.

Enjoy the demo — tell me which follow-up you'd like (release blurb, screenshots, or backend sketch). 🚀 

OPEN FOR SUGGESTIONS: What features or improvements would you like to see next?