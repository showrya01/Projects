"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Terminal, Globe, Diff, Ghost, Radar, Lock,
  ShieldAlert, Eye, Archive, Database, Cloud,
  ArrowRight,
} from "lucide-react";

const TAGLINES = [
  "site:target.com ext:env",
  'intitle:"admin login" site:target.com',
  "site:target.com ext:sql.bak",
  'site:target.com ("AWS_SECRET_ACCESS_KEY")',
  "site:target.com ext:log intext:error",
];

const FEATURES = [
  { icon: Globe,       title: "5-engine parallel recon",  body: "Google, Bing, DuckDuckGo, Brave, and Yandex searched simultaneously. One query, full coverage." },
  { icon: Diff,        title: "cross-engine diff engine", body: "Finds URLs indexed in one engine but invisible to others. The gap between results is where sensitive assets hide." },
  { icon: Ghost,       title: "stealth mode",             body: "UA rotation, randomized delays, session cycling, and retry backoff to minimize bot detection." },
  { icon: Radar,       title: "deep recon mode",          body: "Multi-page crawl, higher result depth, async collection across all engines in one pass." },
  { icon: Lock,        title: "prebuilt dork library",    body: "Categorized dorks for secrets, admin panels, logs, backups, DB dumps, and cloud exposure. One click to fire." },
  { icon: ShieldAlert, title: "hidden target detection",  body: "Sensitive patterns (env, sql.bak, cpanel, debug) are automatically flagged as hidden targets." },
];

const ENGINES = [
  { label: "Google",     note: "best-effort, CAPTCHA-limited",  color: "text-zinc-400"   },
  { label: "Bing",       note: "reliable HTML scraping",        color: "text-blue-400"   },
  { label: "DuckDuckGo", note: "lite HTML, fastest",            color: "text-amber-400"  },
  { label: "Brave",      note: "free API tier available",        color: "text-orange-400" },
  { label: "Yandex",     note: "surfaces Eastern-indexed assets", color: "text-rose-400" },
];

const DORK_PREVIEWS = [
  { icon: Lock,        label: "secrets",       example: "site:{TARGET} ext:env"                      },
  { icon: ShieldAlert, label: "admin panels",  example: 'site:{TARGET} intitle:"admin login"'        },
  { icon: Archive,     label: "backups",       example: "site:{TARGET} ext:bak"                      },
  { icon: Database,    label: "db dumps",      example: "site:{TARGET} ext:sql"                      },
  { icon: Cloud,       label: "cloud exposure",example: 'site:{TARGET} ("s3.amazonaws.com")'         },
  { icon: Eye,         label: "logs",          example: "site:{TARGET} ext:log"                      },
];

export default function LandingPage() {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [displayed, setDisplayed]   = useState("");
  const [typing, setTyping]         = useState(true);

  useEffect(() => {
    const target = TAGLINES[taglineIdx];
    let i = displayed.length;
    if (typing) {
      if (i < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i + 1)), 38);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), 1400);
      return () => clearTimeout(t);
    } else {
      if (i > 0) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i - 1)), 18);
        return () => clearTimeout(t);
      }
      setTaglineIdx((prev) => (prev + 1) % TAGLINES.length);
      setTyping(true);
    }
  }, [displayed, typing, taglineIdx]);

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 font-mono overflow-x-hidden">
      <div className="scanlines pointer-events-none fixed inset-0 z-0" />

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-zinc-900">
        <div className="flex items-center gap-2 text-emerald-400 glow-emerald">
          <Terminal className="w-5 h-5" />
          <span className="font-bold tracking-tight">DorkMatrix</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-emerald-300">
          <Link href="/search" className="hover:text-white transition">dashboard</Link>
          <a href="https://github.com/showrya01/Projects/tree/main/DorkMatrix" className="hover:text-white transition">github</a>
          <Link href="/search" className="px-3 py-1.5 rounded border border-emerald-600 text-emerald-400 hover:bg-emerald-950 transition">
            launch app
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-700 text-emerald-400 text-xs mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          open-source · self-hosted · zero paid services
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
          Search Beyond{" "}
          <span className="text-emerald-400" style={{ textShadow: "0 0 24px rgba(16,185,129,0.6)" }}>
            Search Engines.
          </span>
        </h1>
        <p className="text-sm text-emerald-100 max-w-xl mx-auto mb-10">
          Multi-engine dorking platform for bug hunters. Run one query across Google, Bing, DuckDuckGo,
          Brave, and Yandex simultaneously — then compare what each one indexed and what the others missed.
        </p>
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-emerald-900 bg-zinc-950 text-sm mb-10 glow-box-emerald">
          <span className="text-emerald-400" style={{ textShadow: "0 0 10px rgba(16,185,129,0.8)" }}>root@dorkmatrix:~$</span>
          <span className="text-emerald-300">{displayed}</span>
          <span className="w-2 h-4 bg-emerald-400 animate-pulse" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="/search" className="flex items-center gap-2 px-5 py-2 rounded bg-emerald-500 text-black text-sm font-bold hover:bg-emerald-400 transition glow-btn">
            open dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="https://github.com/showrya01/Projects/tree/main/DorkMatrix" className="px-5 py-2 rounded border border-zinc-800 text-zinc-400 text-sm hover:border-zinc-600 transition">
            view source
          </a>
        </div>
      </section>

      {/* engine strip */}
      <section className="relative z-10 border-y border-zinc-900 py-6">
        <div className="max-w-4xl mx-auto px-8 flex items-center justify-between gap-4 flex-wrap">
          {ENGINES.map((e) => (
            <div key={e.label} className="text-center">
              <div className={"text-sm font-bold " + e.color}>{e.label}</div>
              <div className="text-xs text-emerald-700 mt-0.5">{e.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20">
        <p className="text-xs text-emerald-600 mb-8">// what it does</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-300">{f.title}</span>
                </div>
                <p className="text-xs text-white leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* dork library preview */}
      <section className="relative z-10 border-t border-zinc-900 max-w-4xl mx-auto px-8 py-20">
        <p className="text-xs text-emerald-600 mb-2">// prebuilt dork library</p>
        <h2 className="text-lg text-white mb-6">Ready-to-fire dorks for every recon scenario.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DORK_PREVIEWS.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.label} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-black px-4 py-3">
                <Icon className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-white font-bold mb-1">{d.label}</div>
                  <code className="text-xs text-emerald-500">{d.example}</code>
                </div>
              </div>
            );
          })}
        </div>
        <Link href="/search" className="inline-flex items-center gap-2 mt-6 text-xs text-emerald-500 hover:text-emerald-400 transition">
          browse all dorks in the dashboard <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* comparison callout */}
      <section className="relative z-10 border-t border-zinc-900 max-w-4xl mx-auto px-8 py-20">
        <p className="text-xs text-emerald-600 mb-2">// why comparison matters</p>
        <h2 className="text-lg text-white mb-4">The gap between engines is the attack surface.</h2>
        <p className="text-xs text-emerald-100 max-w-lg leading-relaxed mb-6">
          Sensitive files, admin panels, backup archives, and exposed endpoints are sometimes indexed by
          one engine and missed by the rest. DorkMatrix surfaces those differences automatically — classified
          as common, unique, rare, or hidden — so you know exactly what to investigate.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {["hidden targets", "unique results", "rare indexed assets", "common results"].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-emerald-900 text-emerald-400">{tag}</span>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-zinc-900 px-8 py-6 flex items-center justify-between text-xs text-emerald-600">
        <span>DorkMatrix — open-source recon platform</span>
        <a href="https://github.com/showrya01/Projects/tree/main/DorkMatrix" className="hover:text-emerald-400 transition">github</a>
      </footer>
    </div>
  );
}
