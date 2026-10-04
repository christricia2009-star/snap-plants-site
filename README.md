# Snap Plants — public site

Public site for **Snap Plants**, an independent iOS collector app from True Family. It is not affiliated with any nursery, brand, or trademark owner.

Base URL: `https://plants.snapcollectibles.com`

## Pages

| Path | Role |
| --- | --- |
| `/` | Home: what the app does, Free and Pro limits, trade and identification notes |
| `/privacy` | Privacy Policy |
| `/support` | Support |
| `/terms` | Terms of Use |

`privacy.html`, `support.html`, and `terms.html` redirect to those paths. On Vercel, `vercel.json` sends the same redirects.

Contact on every page: [admin@snapcollectibles.com](mailto:admin@snapcollectibles.com).

## Run locally

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173). There is no build step.
