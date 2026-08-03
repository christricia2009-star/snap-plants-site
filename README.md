# Snap Plants — Marketing & Legal Site

Premium static website for **Snap Plants**, an AI plant identification & care app.

Stack: HTML + Tailwind CSS (CDN) + minimal vanilla JS. No build step, no npm install.

**Platforms:** iOS + Android (both in testing). Toggle via the segmented control in the nav.  
**Feedback:** [testing@snapplants.com](mailto:testing@snapplants.com)

## Pages

| URL | Page |
|-----|------|
| `/` | Homepage — iOS/Android switcher, hero, story, features, gallery, feedback |
| `/privacy/` | Privacy Policy (App Store / Play ready) |
| `/terms/` | Terms of Service |
| `/support/` | Support, contact form, FAQ |

## Run locally

```bash
cd /Users/chris.cameron/snap-plants-app
python3 -m http.server 8080
```

Open:

- http://localhost:8080/
- http://localhost:8080/privacy/
- http://localhost:8080/terms/
- http://localhost:8080/support/

### Alternatives

```bash
npx --yes serve . -l 8080
# or
php -S localhost:8080
```

### iPhone on the same Wi‑Fi

```bash
python3 -m http.server 8080 --bind 0.0.0.0
ipconfig getifaddr en0   # your Mac LAN IP
```

On iPhone Safari: `http://YOUR_IP:8080`

## Project structure

```
snap-plants-app/
├── index.html
├── privacy/index.html
├── terms/index.html
├── support/index.html
├── css/site.css          # Organic motion, phone frames, legal prose
├── js/site.js            # Nav, walkthrough, forms, lightbox
├── images/               # Originals
│   └── optimized/        # WebP (used on site)
└── README.md
```

## Notes

- Waitlist and support forms store data in `localStorage` for local preview only.
- Support email placeholder: `support@snapplants.app`
- Governing law in Terms defaults to California — update before public launch if needed.
- All app screenshots in `/images` are used; no invented stock photography.

## Copyright

© 2026 Snap Plants. All rights reserved.
