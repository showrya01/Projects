const API_BASE = "/api"; // proxied to http://localhost:8000/api via next.config.js

// ── Search ────────────────────────────────────────────────────────────────────

/**
 * Run a dorking search across selected engines.
 * @param {object}   params
 * @param {string}   params.query
 * @param {string}   params.target
 * @param {string}   params.mode     "normal"|"deep"|"stealth"|"api"
 * @param {string[]} params.engines
 * @returns {Promise<SearchResponse>}
 */
export async function runSearch({ query, target, mode, engines }) {
  const res = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, target, mode, engines }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Search failed (${res.status})`);
  }
  return res.json();
}

/**
 * Fetch a past search by ID.
 */
export async function getSearch(searchId) {
  const res = await fetch(`${API_BASE}/search/${searchId}`);
  if (!res.ok) throw new Error(`Search ${searchId} not found`);
  return res.json();
}

/**
 * Fetch the most recent search — used by the Comparison page.
 */
export async function getLatestSearch() {
  const res = await fetch(`${API_BASE}/search/latest`);
  if (!res.ok) throw new Error("No searches found yet");
  return res.json();
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function loadSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) return {};
  return res.json();
}

export async function saveSettings(settings) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to save settings");
  return res.json();
}

// ── Export ────────────────────────────────────────────────────────────────────

/**
 * Download a JSON export and trigger browser save dialog.
 */
export async function exportResults(searchId, format = "json") {
  const res = await fetch(`${API_BASE}/export/${searchId}?format=${format}`);
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `dorkmatrix_${searchId}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}
