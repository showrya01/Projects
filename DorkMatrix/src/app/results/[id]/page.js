"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Terminal, Loader2, ChevronDown, ChevronUp,
  ExternalLink, AlertTriangle, Download,
} from "lucide-react";
import { getSearch, exportResults } from "@/lib/api";
import { ENGINE_META } from "@/data/mockData";

const ENGINE_COLORS = {
  google:     { header: "border-zinc-700  text-zinc-300",  dot: "bg-zinc-400",   count: "text-zinc-400"   },
  bing:       { header: "border-blue-900  text-blue-300",  dot: "bg-blue-400",   count: "text-blue-400"   },
  duckduckgo: { header: "border-amber-900 text-amber-300", dot: "bg-amber-400",  count: "text-amber-400"  },
  brave:      { header: "border-orange-900 text-orange-300", dot: "bg-orange-400", count: "text-orange-400" },
  yandex:     { header: "border-rose-900  text-rose-300",  dot: "bg-rose-400",   count: "text-rose-400"   },
};

const BUCKET_COLOR = {
  hidden: "text-red-400",
  unique: "text-cyan-400",
  rare:   "text-amber-400",
  common: "text-emerald-400",
};

export default function ResultsPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    if (!id) return;
    getSearch(Number(id))
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleCollapse(engine) {
    setCollapsed((prev) => ({ ...prev, [engine]: !prev[engine] }));
  }

  // Group results by engine — each result can appear in multiple engines
  const byEngine = {};
  if (data?.results) {
    // Initialise all queried engines (even empty ones)
    (data.engines_queried || []).forEach((e) => { byEngine[e] = []; });

    data.results.forEach((r) => {
      r.engines.forEach((e) => {
        if (byEngine[e] !== undefined) {
          byEngine[e].push(r);
        }
      });
    });
  }

  const totalURLs = data?.total ?? 0;

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 font-mono">
      <div className="scanlines pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 glow-emerald mb-1">
              <Terminal className="w-5 h-5" />
              <span className="text-xl font-bold tracking-tight">DorkMatrix</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400 text-sm">results</span>
            </div>
            {data && (
              <p className="text-xs text-zinc-500">
                query: <span className="text-emerald-400">{data.query}</span>
                {data.target && <> · target: <span className="text-emerald-400">{data.target}</span></>}
                {" "}· <span className="text-white">{totalURLs} urls</span>
                {" "}· {data.engines_queried?.length} engines
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/search")}
              className="px-3 py-1.5 rounded border border-zinc-800 text-zinc-400 text-xs hover:border-emerald-800 hover:text-emerald-400 transition">
              ← new search
            </button>
            {data && (
              <button
                onClick={() => exportResults(data.search_id, "json")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 text-zinc-400 text-xs hover:border-emerald-800 hover:text-emerald-400 transition">
                <Download className="w-3 h-3" /> export json
              </button>
            )}
          </div>
        </div>

        {/* loading */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            fetching results...
          </div>
        )}

        {/* error */}
        {error && (
          <div className="rounded-md border border-red-900 bg-zinc-950 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* per-engine sections */}
        {data && !loading && (
          <div className="space-y-4">
            {Object.entries(byEngine).map(([engine, results]) => {
              const meta    = ENGINE_META[engine];
              const colors  = ENGINE_COLORS[engine] ?? ENGINE_COLORS.bing;
              const status  = data.engine_status?.[engine] ?? "unknown";
              const isOpen  = !collapsed[engine];
              const count   = results.length;

              return (
                <div key={engine} className={"rounded-lg border bg-zinc-950 overflow-hidden border-" + (ENGINE_COLORS[engine]?.header.split(" ")[0].replace("border-", "") ?? "zinc-800")}>

                  {/* engine header */}
                  <button
                    onClick={() => toggleCollapse(engine)}
                    className={"w-full flex items-center justify-between px-4 py-3 border-b " + colors.header}>
                    <div className="flex items-center gap-3">
                      <span className={"w-2 h-2 rounded-full " + colors.dot} />
                      <span className="text-sm font-bold">{meta?.label ?? engine}</span>
                      <span className={"text-xs " + colors.count}>{count} url{count !== 1 ? "s" : ""}</span>
                      {status !== "success" && (
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <AlertTriangle className="w-3 h-3" />{status}
                        </span>
                      )}
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-zinc-500" />
                      : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </button>

                  {/* url list */}
                  {isOpen && (
                    <div className="divide-y divide-zinc-900">
                      {count === 0 ? (
                        <div className="px-4 py-4 text-xs text-zinc-600">
                          {status === "captcha"  && "⚠ CAPTCHA detected — engine blocked this request"}
                          {status === "timeout"  && "⚠ Engine timed out"}
                          {status === "error"    && "⚠ Engine returned an error"}
                          {status === "success"  && "No results found for this query"}
                        </div>
                      ) : (
                        results.map((r, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-4 px-4 py-3 hover:bg-zinc-900 transition group">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-white break-all">{r.url}</span>
                                <span className={"text-xs " + (BUCKET_COLOR[r.bucket] ?? "text-zinc-500")}>
                                  [{r.bucket}]
                                </span>
                              </div>
                              {r.title && (
                                <p className="text-xs text-emerald-400 mt-0.5 truncate">{r.title}</p>
                              )}
                              {r.snippet && (
                                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{r.snippet}</p>
                              )}
                            </div>
                            <a
                              href={r.url.startsWith("http") ? r.url : "https://" + r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-zinc-600 hover:text-emerald-400 transition opacity-0 group-hover:opacity-100">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
