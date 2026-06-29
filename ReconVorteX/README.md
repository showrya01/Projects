

#  ReconVorteX 

### Professional Bug Bounty Reconnaissance Platform

*ReconVorteX is an intelligent reconnaissance platform designed for bug bounty hunters and penetration testers. It automates asset discovery, technology fingerprinting, historical URL collection, screenshot capture, vulnerability scanning, and risk scoring to identify the most valuable targets efficiently.*

---

##  Architecture

```
reconframework/
├── core/                        # Shared foundation
│   ├── config.py                # YAML + env-var config with per-phase dataclasses
│   ├── database.py              # Async SQLite with schema migrations (aiosqlite)
│   ├── logger.py                # Rich console + JSON file structured logging
│   ├── models.py                # Pydantic v2 canonical data models
│   └── base_plugin.py           # BasePlugin ABC + PluginContext DI
│
├── plugins/                     # Modular discovery + analysis plugins
│   ├── subdomains/              # Phase 1 — 9 passive sources
│   ├── live_hosts/              # Phase 2 — httpx binary + aiohttp fallback
│   ├── technology/              # Phase 3 — 35-signature fingerprint engine
│   ├── intelligence/            # Phase 4 — 44 scoring rules, 5 categories
│   ├── screenshots/             # Phase 5 — Gowitness + HTML gallery generator
│   ├── urls/                    # Phase 6 — GAU + Wayback + Common Crawl
│   ├── endpoints/               # Phase 7 — 50 patterns, 15 categories
│   ├── js/                      # Phase 8 — entropy + AST-like extraction
│   ├── takeover/                # Phase 9 — 30 service fingerprints
│   └── scanner/                 # Phase 10 — Nuclei + 14 header checks
│
├── phases/                      # Phase orchestrators (one per phase)
│   ├── phase1_discovery.py
│   ├── phase2_live_hosts.py
│   ├── phase3_technology.py
│   ├── phase4_intelligence.py
│   ├── phase5_screenshots.py
│   ├── phase6_urls.py
│   ├── phase7_endpoints.py
│   ├── phase8_js.py
│   ├── phase9_takeover.py
│   ├── phase10_scan.py
│   └── phase11_scoring.py
│
├── tests/                       # 551 tests (pytest + pytest-asyncio)
├── output/                      # All outputs written here
├── main.py                      # Typer CLI entry-point
├── config.yaml                  # Master configuration
├── Dockerfile                   # Multi-stage (Go tools + Python runtime)
└── docker-compose.yml
```

## ⚙️ Installation

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.12+ |
| Go (optional, for binaries) | 1.22+ |

### Quick Start (Python only)

```bash
wget https://raw.githubusercontent.com/showrya01/Projects/main/ReconVorteX/reconframework_FINAL.tar.gz
(or)
curl -LO https://raw.githubusercontent.com/showrya01/Projects/main/ReconVorteX/reconframework_FINAL.tar.gz
tar -xzf reconframework_FINAL.tar.gz
cd reconframework
pip install -r requirements.txt
python main.py --help
```

### Install Optional Binaries

All binaries are optional — every phase has a pure-Python fallback.

```bash
# Subdomain discovery
go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
go install github.com/tomnomnom/assetfinder@latest

# HTTP probing
go install github.com/projectdiscovery/httpx/cmd/httpx@latest

# Historical URLs
go install github.com/lc/gau/v2/cmd/gau@latest

# Vulnerability scanning + takeover detection
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
go install github.com/PentestIT/subzy@latest

# Screenshots
# Download from: https://github.com/sensepost/gowitness/releases
```

### Docker (all binaries included)

```bash
# Build once
docker build -t reconframework .

# Run a full pipeline
docker run --rm -v $(pwd)/output:/output reconframework run example.com

# Run a single phase
docker run --rm -v $(pwd)/output:/output reconframework phase1 example.com
```

---

##  Usage

### Single Phase

```bash
# Phase 1 — Subdomain discovery
python main.py phase1 example.com

# Phase 2 — Live host discovery
python main.py phase2 example.com

# Phase 3 — Technology fingerprinting
python main.py phase3 example.com

# Phase 11 — Final risk scoring
python main.py phase11 example.com
```

### Full Pipeline

```bash
# Run all phases sequentially
python main.py run example.com

# Run specific phases
python main.py run example.com --phases 1,2,3,4

# Debug mode
python main.py run example.com --debug
```

### Custom Config

```bash
# Override config file
python main.py run example.com --config path/to/config.yaml

# Override via environment variables
RF_CHAOS_KEY=your_key RF_LOG_LEVEL=DEBUG python main.py run example.com
```

### Docker Compose

```bash
# Edit docker-compose.yml to set RF_CHAOS_KEY, then:
docker compose run recon run example.com
docker compose run recon phase7 example.com
```

---

##  Output Files

All outputs are written to `./output/` after each phase:

```
output/
├── subdomains.txt               # Phase 1 — plain hostname list
├── subdomains.json              # Phase 1 — with source metadata
├── live_hosts.json              # Phase 2 — status, title, IP, tech
├── technologies.json            # Phase 3 — CMS, server, frameworks per host
├── asset_intelligence.json      # Phase 4 — CRITICAL→LOW ranked assets
├── screenshots/
│   ├── *.png                    # Phase 5 — captured screenshots
│   ├── index.html               # Phase 5 — self-contained HTML gallery
│   └── metadata.json            # Phase 5 — screenshot metadata + risk levels
├── urls.txt                     # Phase 6 — plain URL list
├── urls.json                    # Phase 6 — with source breakdown + buckets
├── sensitive_endpoints.txt      # Phase 7 — flagged URLs (plain list)
├── sensitive_endpoints.json     # Phase 7 — with severity + Phase 11 scores
├── js_analysis.json             # Phase 8 — endpoints, secrets, source maps
├── takeovers.json               # Phase 9 — vulnerable subdomains + confidence
├── nuclei_results.json          # Phase 10 — findings + Phase 11 scores
├── high_value_targets.json      # Phase 11 — composite ranked targets
├── recon.db                     # SQLite database (all phases)
├── recon.log                    # JSON structured log
└── audit.log                    # Append-only audit trail
```



##  Security & Ethics

> ** Important:** This tool is designed for **authorised security assessments only.**

- Only run against targets you have **explicit written permission** to test
- All active probing (Phases 2, 9, 10) respects configured rate limits
- Phase 7 is **purely passive** — zero network requests
- Nuclei scans use only **safe, non-intrusive templates** (`-no-interactsh`)
- No exploitation, fuzzing, or authentication attempts are ever performed

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.12+ |
| Async runtime | `asyncio` + `aiohttp` |
| Data validation | Pydantic v2 |
| Database | SQLite via `aiosqlite` |
| CLI | Typer + Rich |
| Logging | Structured JSON + Rich console |
| Retry logic | Tenacity |
| Testing | pytest + pytest-asyncio |
| Linting | Ruff + mypy |
| Containers | Docker (multi-stage) |
| CI/CD | GitHub Actions |


---

---

##  Performance

Tested against a scope with ~5,000 subdomains:

| Phase | Time | Notes |
|---|---|---|
| Phase 1 (9 sources) | ~2–4 min | Network-bound |
| Phase 2 (150 concurrent) | ~5–10 min | 5,000 hosts |
| Phase 3 (50 concurrent) | ~3–6 min | Re-fetches HTML |
| Phase 4 (pure analysis) | < 1 sec | CPU-bound |
| Phase 6 (GAU + Wayback) | ~3–8 min | API rate limits |
| Phase 7 (pattern match) | < 1 sec | Offline, no I/O |
| Phase 8 (JS fetch + extract) | ~5–15 min | Network-bound |
| Phase 9 (50 concurrent) | ~3–8 min | Network-bound |
| Phase 10 (Nuclei) | ~10–30 min | Template-dependent |
| Phase 11 (scoring) | < 1 sec | CPU-bound |

---

---

##  License

MIT License — see [LICENSE](LICENSE) for details.

---

##  Acknowledgements

Built with ❤️ using tooling from:
- [ProjectDiscovery](https://projectdiscovery.io/) — Subfinder, httpx, Nuclei
- [OWASP Amass](https://owasp.org/www-project-amass/)
- [Can I Take Over XYZ](https://github.com/EdOverflow/can-i-take-over-xyz) — Takeover fingerprints
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) — Entropy methodology

---


**Built for the bug bounty community. Hack responsibly. 🐛**

</div>
