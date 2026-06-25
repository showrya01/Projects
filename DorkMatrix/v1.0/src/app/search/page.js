"use client";
import { useState } from "react";
import { Search, Check, Copy, ChevronDown, ShieldAlert, Lock, FileWarning, Archive, Database, Cloud } from "lucide-react";
import Nav from "@/components/shared/Nav";
import { DORK_CATEGORIES } from "@/data/mockData";

const ENGINES = [
  {
    key: "google",
    label: "Google",
    url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    color: "border-zinc-700 text-zinc-300 hover:border-zinc-400 hover:text-white",
    dot: "bg-zinc-400",
  },
  {
    key: "bing",
    label: "Bing",
    url: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    color: "border-blue-900 text-blue-400 hover:border-blue-500 hover:text-blue-300",
    dot: "bg-blue-400",
  },
  {
    key: "duckduckgo",
    label: "DuckDuckGo",
    url: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    color: "border-amber-900 text-amber-400 hover:border-amber-500 hover:text-amber-300",
    dot: "bg-amber-400",
  },
  {
    key: "brave",
    label: "Brave",
    url: (q) => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    color: "border-orange-900 text-orange-400 hover:border-orange-500 hover:text-orange-300",
    dot: "bg-orange-400",
  },
  {
    key: "yandex",
    label: "Yandex",
    url: (q) => `https://yandex.com/search/?text=${encodeURIComponent(q)}`,
    color: "border-rose-900 text-rose-400 hover:border-rose-500 hover:text-rose-300",
    dot: "bg-rose-400",
  },
];

const CAT_ICONS = {
  secrets: Lock,
  admin: ShieldAlert,
  logs: FileWarning,
  backups: Archive,
  dbdumps: Database,
  cloud: Cloud,
};

export default function SearchPage() {
  const [query, setQuery]               = useState("");
  const [target, setTarget]             = useState("");
  const [openCategory, setOpenCategory] = useState("secrets");
  const [copiedId, setCopiedId]         = useState(null);

  function fillTarget(text) {
    return text.replace("{TARGET}", target.trim() || "TARGET");
  }

  function openEngine(engineUrl) {
    if (!query.trim()) return;
    window.open(engineUrl(query.trim()), "_blank", "noopener,noreferrer");
  }

  function openAll() {
    if (!query.trim()) return;
    ENGINES.forEach((e) => {
      window.open(e.url(query.trim()), "_blank", "noopener,noreferrer");
    });
  }

  async function copyDork(id, text) {
    try {
      await navigator.clipboard.writeText(fillTarget(text));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {}
  }

  function loadDork(text) {
    setQuery(fillTarget(text));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 font-mono">
      <div className="scanlines pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10">
        <Nav />
        <div className="max-w-5xl mx-auto px-6 pb-16">

          {/* terminal input */}
          <div className="rounded-lg border border-emerald-900 bg-zinc-950 p-5 mb-3" style={{ boxShadow: "0 0 30px rgba(16,185,129,0.08)" }}>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 text-sm shrink-0" style={{ textShadow: "0 0 10px rgba(16,185,129,0.8)" }}>root@dorkmatrix:~$</span>
              <span className="text-zinc-600">:~$</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  // Enter with no modifier — open DuckDuckGo (most reliable)
                  if (e.key === "Enter" && !e.shiftKey) {
                    openEngine(ENGINES[2].url);
                  }
                }}
                placeholder='site:example.com ext:env'
                autoFocus
                className="flex-1 bg-transparent outline-none text-emerald-300 placeholder-zinc-700 text-sm"
              />
              <span className="animate-pulse text-emerald-400">▋</span>
            </div>

            {/* target helper */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-zinc-600">target</span>
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="example.com — auto-fills {TARGET} in dorks"
                className="flex-1 bg-transparent border-b border-zinc-800 pb-0.5 text-xs text-emerald-300 outline-none placeholder-zinc-700"
              />
            </div>
          </div>

          {/* engine buttons */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {ENGINES.map((e) => (
              <button
                key={e.key}
                onClick={() => openEngine(e.url)}
                disabled={!query.trim()}
                className={"flex items-center justify-center gap-2 rounded-lg border py-3 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed " + e.color}
              >
                <span className={"w-1.5 h-1.5 rounded-full " + e.dot} />
                {e.label}
              </button>
            ))}
          </div>

          {/* dork library */}
          <div>
            <p className="text-xs text-emerald-600 mb-4">// dork library — click load to fill the search bar</p>
            <div className="space-y-3">
              {DORK_CATEGORIES.map((cat) => {
                const Icon = CAT_ICONS[cat.id];
                const open = openCategory === cat.id;
                return (
                  <div key={cat.id} className="rounded-lg border border-zinc-800 overflow-hidden">
                    <button
                      onClick={() => setOpenCategory(open ? null : cat.id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950 hover:bg-zinc-900"
                    >
                      <span className="flex items-center gap-2 text-sm text-emerald-300">
                        <Icon className="w-4 h-4" />{cat.path}
                      </span>
                      <ChevronDown className={"w-4 h-4 text-zinc-500 transition-transform" + (open ? " rotate-180" : "")} />
                    </button>
                    {open && (
                      <div className="divide-y divide-zinc-900">
                        {cat.dorks.map((d, idx) => {
                          const dorkId = cat.id + idx;
                          return (
                            <div key={dorkId} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-black group">
                              <code className="text-xs text-emerald-500 break-all flex-1">{fillTarget(d)}</code>
                              <div className="flex gap-2 shrink-0">
                                {/* load into search bar */}
                                <button
                                  onClick={() => loadDork(d)}
                                  title="load into search bar"
                                  className="text-zinc-600 hover:text-emerald-400 transition"
                                >
                                  <Search className="w-3.5 h-3.5" />
                                </button>
                                {/* copy */}
                                <button
                                  onClick={() => copyDork(dorkId, d)}
                                  title="copy"
                                  className="text-zinc-600 hover:text-emerald-400 transition"
                                >
                                  {copiedId === dorkId
                                    ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
