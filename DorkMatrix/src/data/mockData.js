// Engine metadata — shared by dashboard, comparison, and settings
export const ENGINE_META = {
  google:     { label: "Google",     code: "G",   color: "zinc"   },
  bing:       { label: "Bing",       code: "B",   color: "blue"   },
  duckduckgo: { label: "DuckDuckGo", code: "DDG", color: "amber"  },
  brave:      { label: "Brave",      code: "BR",  color: "orange" },
  yandex:     { label: "Yandex",     code: "Y",   color: "rose"   },
};

// Tailwind color classes per engine — keeps class names static so Tailwind includes them
export const ENGINE_COLORS = {
  zinc:   { text: "text-zinc-400",   border: "border-zinc-800"   },
  blue:   { text: "text-blue-400",   border: "border-blue-900"   },
  amber:  { text: "text-amber-400",  border: "border-amber-900"  },
  orange: { text: "text-orange-400", border: "border-orange-900" },
  rose:   { text: "text-rose-400",   border: "border-rose-900"   },
};

// Result classification bucket styles
export const BUCKET_STYLE = {
  hidden: { label: "hidden",  text: "text-red-400",     border: "border-red-900"     },
  unique: { label: "unique",  text: "text-cyan-400",    border: "border-cyan-900"    },
  rare:   { label: "rare",    text: "text-amber-400",   border: "border-amber-900"   },
  common: { label: "common",  text: "text-emerald-400", border: "border-emerald-900" },
};

// Search modes
export const MODES = [
  { id: "normal",  label: "normal",     hint: "fast standard search"          },
  { id: "deep",    label: "deep recon", hint: "more pages, deeper collection"  },
  { id: "stealth", label: "stealth",    hint: "anti-bot evasion, slower"       },
  { id: "api",     label: "api only",   hint: "uses configured api keys"       },
];

// Sensitive URL pattern for hidden-target detection
export const SENSITIVE_PATTERN = /env|sql|bak|backup|admin|cpanel|debug|log|key|secret|password/i;

// Classify a result into a bucket
export function classifyResult(engines) {
  return engines.length >= 3 ? "common"
       : engines.length === 2 ? "rare"
       : "unique"; // single-engine sensitive URLs get reclassified by the caller
}

// Mock results — replaced by real API data once backend is live
export const MOCK_RESULTS = [
  { id: 1, url: "example.com/admin/login.php",               snippet: "Sign in to the administrative control panel.",               engines: ["google","bing","duckduckgo","brave","yandex"] },
  { id: 2, url: "example.com/api/v1/docs",                   snippet: "Internal API reference for v1 endpoints.",                  engines: ["google","bing","brave"]                       },
  { id: 3, url: "example.com/backup/db_2024.sql.bak",        snippet: "Index of /backup — db_2024.sql.bak, 14.2 MB.",              engines: ["yandex"]                                      },
  { id: 4, url: "example.com/.env",                          snippet: "DB_PASSWORD=*** APP_KEY=*** exposed env file.",             engines: ["duckduckgo"]                                  },
  { id: 5, url: "example.com/wp-content/uploads/report.pdf", snippet: "Quarterly internal report, marked confidential.",           engines: ["bing","yandex"]                               },
  { id: 6, url: "dev.example.com/debug",                     snippet: "Werkzeug debugger — interactive console enabled.",          engines: ["yandex"]                                      },
  { id: 7, url: "example.com/sitemap.xml",                   snippet: "XML sitemap listing all indexed pages.",                    engines: ["google","bing","duckduckgo","brave"]           },
  { id: 8, url: "example.com/cpanel",                        snippet: "Web hosting control panel login page.",                     engines: ["google"]                                      },
  { id: 9, url: "static.example.com/old/index.html.old",     snippet: "Legacy static page, unlinked from nav.",                   engines: ["brave","duckduckgo"]                          },
  { id: 10, url: "example.com/logs/error.log",               snippet: "[ERROR] Uncaught exception in payment handler.",            engines: ["bing"]                                        },
];

// Dork library
export const DORK_CATEGORIES = [
  {
    id: "secrets",
    path: "/secrets_exposure",
    dorks: [
      'site:{TARGET} ext:env',
      'site:{TARGET} ext:json ("api_key" OR "access_token" OR "secret")',
      'site:{TARGET} ("AWS_ACCESS_KEY_ID" OR "AWS_SECRET_ACCESS_KEY")',
      'site:{TARGET} ("password" OR "passwd" OR "secret_key")',
    ],
  },
  {
    id: "admin",
    path: "/admin_panels",
    dorks: [
      'site:{TARGET} inurl:admin',
      'site:{TARGET} intitle:"admin login"',
      'site:{TARGET} (inurl:dashboard OR inurl:cpanel)',
      'site:{TARGET} ("administrator" OR "control panel")',
    ],
  },
  {
    id: "logs",
    path: "/logs",
    dorks: [
      'site:{TARGET} ext:log',
      'site:{TARGET} ext:txt "error"',
      'site:{TARGET} ("stack trace" OR "exception")',
      'site:{TARGET} ("debug" OR "fatal error")',
    ],
  },
  {
    id: "backups",
    path: "/backups",
    dorks: [
      'site:{TARGET} ext:bak',
      'site:{TARGET} ext:zip',
      'site:{TARGET} ext:tar.gz',
      'site:{TARGET} ext:old',
    ],
  },
  {
    id: "dbdumps",
    path: "/database_dumps",
    dorks: [
      'site:{TARGET} ext:sql',
      'site:{TARGET} ext:db',
      'site:{TARGET} ext:sqlite',
      'site:{TARGET} ("INSERT INTO" OR "CREATE TABLE")',
    ],
  },
  {
    id: "cloud",
    path: "/cloud_exposure",
    dorks: [
      'site:{TARGET} ("s3.amazonaws.com" OR "amazonaws.com")',
      'site:{TARGET} ("storage.googleapis.com" OR "gcs")',
      'site:{TARGET} ("blob.core.windows.net")',
      'site:{TARGET} ("bucket" OR "aws" OR "cloudfront")',
    ],
  },
];
