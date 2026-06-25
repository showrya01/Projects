"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";

const TABS = [
  { label: "dashboard", href: "/search" },
  { label: "settings", href: "/settings" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* wordmark */}
      <div className="pt-10 mb-8">
        <Link href="/" className="flex items-center gap-2 text-emerald-400 glow-emerald w-fit">
          <Terminal className="w-6 h-6" />
          <span className="text-2xl font-bold tracking-tight">DorkMatrix</span>
        </Link>
      </div>
      {/* tab bar */}
      <div className="flex gap-1 border-b border-emerald-900 text-xs mb-8">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={
                active
                  ? "px-4 py-2 text-emerald-400 border-b-2 border-emerald-400"
                  : "px-4 py-2 text-zinc-600 hover:text-zinc-400 transition"
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
