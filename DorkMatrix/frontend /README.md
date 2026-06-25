# DorkMatrix

> **Search Beyond Search Engines.**

DorkMatrix is a fully open-source, self-hosted recon platform for bug hunters. Type a Google Dork query and instantly search across Google, Bing, DuckDuckGo, Brave, and Yandex — each opening in its own tab with your query pre-filled.

No paid APIs. No proxies. No SaaS. Runs entirely on your machine.

---

## Screenshots


| Dashboard | 
|-----------|
| ![Screenshot](./screenshots/Screenshot%202026-06-25%20121321.png) | 

|Dork Library |
|-------------|
| ![Screenshot](./screenshots/Screenshot%202026-06-25%20121336.png) |
---

## Features

- **5-engine search** — Google, Bing, DuckDuckGo, Brave, Yandex
- **Prebuilt dork library** — secrets, admin panels, logs, backups, DB dumps, cloud exposure
- **Target auto-fill** — set a target once, `{TARGET}` fills across all dorks automatically
- **One-click copy** — copy any dork to clipboard instantly
- **Settings page** — configure API keys, default engines, anti-bot delays, proxy list, cache TTL (I will introduce in the upcomming versions.)
- **Zero cost** — no paid services required to run

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TailwindCSS |


---

## Project Structure

```
darkmatrix/
├── frontend/                  # Next.js app
│   └── src/
│       ├── app/
│       │   ├── page.js        # Landing page
│       │   ├── search/        # Main dashboard
│       │   └── settings/      # Settings page
│       ├── components/
│       │   └── shared/
│       │       └── Nav.jsx    # Shared navigation
│       ├── data/
│       │   └── mockData.js    # Dork library + constants
│       └── lib/
│           └── api.js         # Backend API client
│
└── README.md
```

---

## Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/darkmatrix.git
cd darkmatrix
```

---


### 2. Frontend setup

Open a **new terminal** (keep backend running):

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend runs at `http://localhost:3000`


```env
# Optional API keys (leave blank to use scraping)
GOOGLE_API_KEY=
GOOGLE_CSE_ID=
BING_API_KEY=
BRAVE_API_KEY=
```

All API keys are optional. If not set, DorkMatrix falls back to scraping.

**Brave API** — recommended, free tier available (2,000 queries/month):
→ https://api.search.brave.com

**Google Custom Search** — 100 free queries/day:
→ https://console.cloud.google.com → Custom Search API

---

## Usage

1. Open `http://localhost:3000`
2. Go to **dashboard**
3. Type your dork query in the terminal input
4. Set a **target** (e.g. `example.com`) — auto-fills `{TARGET}` in the dork library
5. Click any engine button to open that search in a new tab
6. Or load a prebuilt dork from the library below, then pick your engine

### Example dorks to try

```
site:example.com ext:env
site:example.com ext:sql
site:example.com inurl:admin
site:example.com ("AWS_ACCESS_KEY_ID")
site:example.com ext:log intext:error
```

> ⚠️ Only use DorkMatrix against targets you own or have explicit written permission to test. Use within bug bounty program scope only.

---

## Dork Library Categories

| Category | What it finds |
|----------|--------------|
| Secrets Exposure | `.env` files, API keys, credentials |
| Admin Panels | Login pages, dashboards, cPanel |
| Logs | Error logs, debug output, stack traces |
| Backups | `.bak`, `.zip`, `.tar.gz`, `.old` files |
| Database Dumps | `.sql`, `.db`, `.sqlite` files |
| Cloud Exposure | S3 buckets, GCS, Azure Blob Storage |

---

## Settings

Navigate to `/settings` to configure:

- **API keys** — Google, Bing, Brave
- **Default engines** — which engines are active by default


---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `404` on `localhost:3000` | Delete root-level `app/` folder: `rm -rf frontend/app frontend/components frontend/lib` |
| `lxml` build error | `pip install "lxml>=5.3.0"` |
| Popup blocked on engine buttons | Allow popups for localhost in your browser settings |
| Port 3000 in use | Kill existing process: `kill $(lsof -t -i:3000)` |

---

## Contributing

Pull requests are welcome.

```bash
# Fork the repo
git checkout -b feature/your-feature
git commit -m "add: your feature"
git push origin feature/your-feature
# Open a PR
```

Please test locally before opening a PR.

---

## Legal

DorkMatrix is a recon tool for authorized security research, bug bounty hunting, and penetration testing.

**Only use it against:**
- Your own infrastructure
- Intentionally vulnerable practice environments
- Bug bounty targets within their defined scope

Unauthorized use against systems you do not own or have explicit permission to test may violate laws including the Computer Fraud and Abuse Act (CFAA) and equivalent legislation in your country.

The authors are not responsible for misuse.

---

## License

MIT License — free to use, modify, and distribute.

---

*Built for bug hunters. Use responsibly.*
