# Snap Plants — marketing site

Brand site for **Snap Plants**, the collector app for plants. iOS and Android are both in beta. This is the public home: identify, collection, trades, privacy, and a beta request form.

Layout and design follow the BassheadOS site: dark bay, electric yellow, ember, Big Shoulders Display.

## Run locally

Any static server from the repo root works.

```bash
# Python
python3 -m http.server 4173

# Node
npx --yes serve -l 4173
```

Open [http://localhost:4173](http://localhost:4173).

There is no build step. HTML, CSS, and JS are the source.

## What’s in the box

| Path | Role |
| --- | --- |
| `index.html` | Home: hero, pillars, Identify / Collection / Trades, FAQ, privacy teaser, beta request |
| `privacy.html` | Camera, sign-in, trades, this site |
| `terms.html` | Terms of Service |
| `support.html` | Support contact + Android tester URL reminder |
| `assets/css/site.css` | Design system |
| `assets/js/site.js` | Sticky header, mobile nav, beta form → `admin@snapcollectibles.com`, Android tester-URL gate |
| `assets/screens/` | WebP frames from the iOS and Android apps |
| `Screenshots/` | Original captures |
| `assets/img/` | Mark, favicon, apple-touch, OG, hero leaf |

## Beta requests

The form posts App name (`Snap Plants`), phone OS (`iOS` or `Android`), and email to [FormSubmit](https://formsubmit.co) → **admin@snapcollectibles.com**.

The first live submission sends a confirmation message to that inbox. Click it once so later requests land automatically. If the service is blocked, the page falls back to a `mailto:` draft with the same three fields.

### Android tester URL

Google Play internal testing does **not** email testers. After an Android request, the page shows:

`https://play.google.com/apps/internaltest/4701169274084912075`

The tester must copy that URL and check a box acknowledging they kept it. The URL is active once the email has been added to the tester list — please allow up to a few hours.

Change the inbox in `assets/js/site.js` (`BETA_INBOX`) if needed.

## Stores

iOS and Android are labeled **In beta**. Swap the badges for store URLs when the public listings are live.

## Domain / SEO

Canonicals, sitemap, and robots assume `https://plants.snapcollectibles.com/`. Open Graph image is `assets/img/og.png` (1200×630).

Old paths `/privacy/`, `/terms/`, and `/support/` redirect to the root HTML files.

## Tone / honesty

Live features are labeled **Live**. Identification is assistive, not a certified botanical ID. Trades are peer-to-peer. No fake rankings, testimonials, or download counts.

## License

© Snap Plants. All rights reserved.
