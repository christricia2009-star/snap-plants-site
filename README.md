# Snap Plants — Marketing & Legal Site

Static website for **Snap Plants**, an iOS app for identifying plants, tracking a personal plant collection, and optionally trading plants with other users.

Stack: HTML + Tailwind CSS (CDN) + minimal vanilla JS. No build step, no npm install.

**Platform:** iOS · Coming to the App Store  
**Feedback:** [admin@snapcollectibles.com](mailto:admin@snapcollectibles.com)

## Pages

| URL | Page |
|-----|------|
| `/` | Homepage — hero, how it works, features, gallery, FAQ, privacy blurb, soft App Store CTA |
| `/privacy/` | Privacy Policy |
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

## Product story (site copy)

- **How it works:** Snap → Identify → Track → Trade
- **Core features:** camera scan + categories, ID results + lookup links, My Plants / My Shelf, manual add, plant detail, wishlist, Sign in with Apple, trades + chat, cloud backup (signed-in), export collection, More (history/stats)
- **Tone:** friendly, plant-care oriented, honest about assistive ID
- **CTA:** soft “Coming to App Store” until a real link exists

## Notes

- Support contact form stores data in `localStorage` for local preview only.
- Support email: `admin@snapcollectibles.com`
- Governing law in Terms defaults to California — update before public launch if needed.
- Do not invent pricing or backend stack names on the marketing site.
- All app screenshots in `/images` are used; no invented stock photography.

## Copyright

© 2026 Snap Plants. All rights reserved.
