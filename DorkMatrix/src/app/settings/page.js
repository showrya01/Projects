"use client";
import { useState } from "react";
import { Eye, EyeOff, Check, KeyRound, Shield, SlidersHorizontal, Network, Clock, Search, Radar, Ghost, Globe, Loader2 } from "lucide-react";
import Nav from "@/components/shared/Nav";
import { ENGINE_META, MODES } from "@/data/mockData";
import { loadSettings, saveSettings } from "@/lib/api";
import { useEffect } from "react";

const API_KEY_FIELDS = [
  { id: "google", label: "GOOGLE_API_KEY", hint: "enables Google Custom Search API, skips scraping" },
  { id: "bing",   label: "BING_API_KEY",   hint: "enables Bing Web Search API, skips scraping"      },
  { id: "brave",  label: "BRAVE_API_KEY",  hint: "free tier available, 2000 queries/month"           },
];

const MODE_ICONS = { normal: Search, deep: Radar, stealth: Ghost, api: Globe };

function Card({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-300 font-bold">{title}</span>
      </div>
      {subtitle && <p className="text-xs text-zinc-600 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys]     = useState({ google: "", bing: "", brave: "" });
  const [showKey, setShowKey]     = useState({ google: false, bing: false, brave: false });
  const [engines, setEngines]     = useState(() => new Set(Object.keys(ENGINE_META)));
  const [defaultMode, setMode]    = useState("normal");
  const [proxyEnabled, setProxy]  = useState(false);
  const [proxyList, setProxyList] = useState("");
  const [delayMin, setDelayMin]   = useState(800);
  const [delayMax, setDelayMax]   = useState(2500);
  const [retries, setRetries]     = useState(2);
  const [cacheTTL, setCacheTTL]   = useState(7);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    loadSettings().then((s) => {
      if (!s || !Object.keys(s).length) return;
      if (s.api_keys)          setApiKeys((p) => ({ ...p, ...s.api_keys }));
      if (s.engines?.length)   setEngines(new Set(s.engines));
      if (s.default_mode)      setMode(s.default_mode);
      if (s.proxy_enabled != null) setProxy(s.proxy_enabled);
      if (s.proxy_list)        setProxyList(s.proxy_list);
      if (s.delay_min)         setDelayMin(s.delay_min);
      if (s.delay_max)         setDelayMax(s.delay_max);
      if (s.retries)           setRetries(s.retries);
      if (s.cache_ttl)         setCacheTTL(s.cache_ttl);
    }).catch(() => {});
  }, []);

  function toggleEngine(key) {
    setEngines((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleSave() {
    setSaveError(null);
    try {
      await saveSettings({
        api_keys:      apiKeys,
        engines:       Array.from(engines),
        default_mode:  defaultMode,
        proxy_enabled: proxyEnabled,
        proxy_list:    proxyList,
        delay_min:     delayMin,
        delay_max:     delayMax,
        retries,
        cache_ttl:     cacheTTL,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      setSaveError(e.message || "Failed to save");
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 font-mono">
      <div className="relative z-10">
        <Nav />
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <p className="text-xs text-zinc-600 mb-6">settings are stored locally — nothing leaves your machine</p>

          <Card icon={KeyRound} title="api keys" subtitle="optional — if set, the matching engine uses its api instead of scraping">
            <div className="space-y-3">
              {API_KEY_FIELDS.map((field) => (
                <div key={field.id}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-zinc-500">{field.label}</label>
                    <span className={"text-xs px-2 py-0.5 rounded border " +
                      (apiKeys[field.id] ? "text-emerald-400 border-emerald-900" : "text-zinc-600 border-zinc-800")}>
                      {apiKeys[field.id] ? "configured" : "not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type={showKey[field.id] ? "text" : "password"}
                      value={apiKeys[field.id]}
                      onChange={(e) => setApiKeys((p) => ({ ...p, [field.id]: e.target.value }))}
                      placeholder="not configured — falls back to scraping"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-emerald-300 outline-none" />
                    <button onClick={() => setShowKey((p) => ({ ...p, [field.id]: !p[field.id] }))}
                      className="text-zinc-500 hover:text-emerald-400">
                      {showKey[field.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-700 mt-1">{field.hint}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card icon={Shield} title="engines" subtitle="default engines used for new searches">
            <div className="flex flex-wrap gap-2">
              {Object.entries(ENGINE_META).map(([key, meta]) => (
                <button key={key} onClick={() => toggleEngine(key)}
                  className={engines.has(key)
                    ? "px-3 py-1.5 rounded border border-emerald-700 text-emerald-400 text-xs"
                    : "px-3 py-1.5 rounded border border-zinc-800 text-zinc-600 text-xs"}>
                  {meta.label}
                </button>
              ))}
            </div>
          </Card>

          <Card icon={Search} title="default search mode" subtitle="applied to new searches, can be overridden per-search">
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => {
                const Icon = MODE_ICONS[m.id];
                const active = defaultMode === m.id;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={active
                      ? "flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 text-black text-xs font-bold"
                      : "flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 text-xs hover:bg-zinc-800"}>
                    <Icon className="w-3.5 h-3.5" />{m.label}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card icon={SlidersHorizontal} title="anti-bot tuning" subtitle="used by stealth mode and as a safety floor for normal/deep modes">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "min delay (ms)", value: delayMin, set: setDelayMin },
                { label: "max delay (ms)", value: delayMax, set: setDelayMax },
                { label: "max retries",    value: retries,  set: setRetries  },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs text-zinc-500 block mb-1">{f.label}</label>
                  <input type="number" value={f.value} onChange={(e) => f.set(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-emerald-300 outline-none" />
                </div>
              ))}
            </div>
          </Card>

          <Card icon={Network} title="proxy" subtitle="optional — one proxy per line, no paid proxy services required">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500">enable proxy rotation</span>
              <button onClick={() => setProxy((v) => !v)}
                className={proxyEnabled
                  ? "px-3 py-1 rounded bg-emerald-500 text-black text-xs font-bold"
                  : "px-3 py-1 rounded bg-zinc-900 text-zinc-400 text-xs"}>
                {proxyEnabled ? "on" : "off"}
              </button>
            </div>
            <textarea value={proxyList} onChange={(e) => setProxyList(e.target.value)}
              disabled={!proxyEnabled} rows={3}
              placeholder={"socks5://127.0.0.1:9050\nhttp://127.0.0.1:8080"}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-emerald-300 outline-none" />
          </Card>

          <Card icon={Clock} title="cache" subtitle="how long results stay cached before re-querying engines">
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={30} value={cacheTTL}
                onChange={(e) => setCacheTTL(Number(e.target.value))} className="flex-1" />
              <span className="text-xs text-emerald-400 w-20">{cacheTTL} min</span>
            </div>
            <p className="text-xs text-zinc-700 mt-2">5–10 min recommended for normal use</p>
          </Card>

          <div className="flex items-center gap-3">
            <button onClick={handleSave}
              className="px-4 py-1.5 rounded bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition glow-btn">
              save configuration
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Check className="w-3.5 h-3.5" />saved
              </span>
            )}
            {saveError && (
              <span className="text-xs text-red-400">{saveError}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
