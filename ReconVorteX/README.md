

# 🔍 ReconVorteX 

### Professional Bug Bounty Reconnaissance Platform

*ReconVorteX is an intelligent reconnaissance platform designed for bug bounty hunters and penetration testers. It automates asset discovery, technology fingerprinting, historical URL collection, screenshot capture, vulnerability scanning, and risk scoring to identify the most valuable targets efficiently.*

---

## 📖 Overview

ReconFramework is a **production-quality, modular reconnaissance platform** built for bug bounty hunters and penetration testers. It automates the entire recon workflow — from subdomain discovery through to composite risk scoring — in a single, consistent pipeline.

---

## 🏗️ Architecture

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

---

## 🚀 Pipeline Phases

| # | Phase | Method | Output |
|---|-------|--------|--------|
| 1 | **Subdomain Discovery** | Subfinder, Amass, Assetfinder, Findomain, crt.sh, AlienVault, Chaos, HackerTarget, RapidDNS | `subdomains.json` |
| 2 | **Live Host Discovery** | httpx binary → aiohttp fallback, 150 concurrent, redirect chain | `live_hosts.json` |
| 3 | **Technology Intelligence** | 35 pure-Python signatures (headers, HTML, cookies, scripts) | `technologies.json` |
| 4 | **Asset Intelligence Engine** | 44 rules across hostname, title, tech, HTTP behaviour — CRITICAL→LOW tiers | `asset_intelligence.json` |
| 5 | **Screenshot Collection** | Gowitness binary, CRITICAL/HIGH priority, self-contained HTML gallery | `screenshots/` |
| 6 | **Historical URL Collection** | GAU binary + Wayback CDX API + Common Crawl, smart filter | `urls.json` |
| 7 | **Sensitive Endpoint Discovery** | 50 patterns, 15 categories — zero network requests | `sensitive_endpoints.json` |
| 8 | **JavaScript Intelligence** | 14 finding types, Shannon entropy scoring, AST-like secret detection | `js_analysis.json` |
| 9 | **Subdomain Takeover Detection** | HTTP fingerprints (30 services) + Subzy + Nuclei takeover templates | `takeovers.json` |
| 10 | **Safe Vulnerability Scanning** | Nuclei safe templates + 14 Python header checks (always-on) | `nuclei_results.json` |
| 11 | **Risk Scoring Engine** | Composite scores from Phases 4, 7, 8, 9, 10 → ranked targets | `high_value_targets.json` |

---

## ⚙️ Installation

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.12+ |
| Go (optional, for binaries) | 1.22+ |

### Quick Start (Python only)

```bash
wget
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

## 📋 Usage

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
python main.py run example.com --config /path/to/custom.yaml

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

## 📁 Output Files

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

### Sample `high_value_targets.json` Entry

```json
{
  "host": "admin.example.com",
  "score": 47,
  "risk": "CRITICAL",
  "reasons": [
    "Phase 4: CRITICAL asset — Jenkins CI detected (+20)",
    "Phase 9: Takeover — GitHub Pages confidence=0.95 via subzy (+20)",
    "Phase 10: scan score 7 — top: Missing Content-Security-Policy (+7)"
  ],
  "source_breakdown": {
    "phase4": 20,
    "phase9": 20,
    "phase10": 7
  }
}
```

---

## 🔌 Plugin System

Adding a new data source requires **one file and one import**:

```python
# plugins/subdomains/mysource.py

from core.base_plugin import BasePlugin, PluginContext, PluginResult

class MySourcePlugin(BasePlugin[list[str]]):
    NAME     = "mysource"
    PRIORITY = 20          # lower = runs earlier

    async def run(self, ctx: PluginContext) -> PluginResult[list[str]]:
        domain = ctx.domain
        # ... your discovery logic ...
        return self._ok(["sub1.example.com", "sub2.example.com"])
```

Then add it to `plugins/subdomains/__init__.py`:

```python
from plugins.subdomains.mysource import MySourcePlugin
ALL_PLUGINS = [..., MySourcePlugin]
```

That's it — the Phase 1 orchestrator picks it up automatically.

---

## ⚙️ Configuration

All behaviour is controlled via `config.yaml`. Every setting can be overridden with environment variables prefixed `RF_`:

```yaml
phase1:
  max_concurrent_tools: 4
  http_timeout: 30
  chaos_key: ""          # or: RF_CHAOS_KEY=your_key

phase2:
  concurrency: 150       # concurrent HTTP probes
  timeout_s: 10
  max_redirects: 5

phase7:
  min_severity: "LOW"    # CRITICAL | HIGH | MEDIUM | LOW | INFO

phase11:
  tier_critical: 30      # score thresholds
  tier_high:     20
  tier_medium:   10
```

See [`config.yaml`](config.yaml) for the complete reference.

---

## 🧪 Testing

```bash
# Run full test suite
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html

# Run a single phase's tests
pytest tests/test_phase7.py -v

# Run specific test class
pytest tests/test_phase8.py::TestJSExtractorAWS -v
```

---

## 🔒 Security & Ethics

> **⚠️ Important:** This tool is designed for **authorised security assessments only.**

- Only run against targets you have **explicit written permission** to test
- All active probing (Phases 2, 9, 10) respects configured rate limits
- Phase 7 is **purely passive** — zero network requests
- Nuclei scans use only **safe, non-intrusive templates** (`-no-interactsh`)
- No exploitation, fuzzing, or authentication attempts are ever performed

---

## 🛠️ Tech Stack

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

## 📊 Performance

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

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

Built with ❤️ using tooling from:
- [ProjectDiscovery](https://projectdiscovery.io/) — Subfinder, httpx, Nuclei
- [OWASP Amass](https://owasp.org/www-project-amass/)
- [Can I Take Over XYZ](https://github.com/EdOverflow/can-i-take-over-xyz) — Takeover fingerprints
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) — Entropy methodology

---


**Built for the bug bounty community. Hack responsibly. 🐛**

</div>
