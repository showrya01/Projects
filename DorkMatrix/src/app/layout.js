import "./globals.css";

export const metadata = {
  title: "DorkMatrix",
  description: "Search Beyond Search Engines — multi-engine recon platform for bug hunters.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-zinc-100 font-mono antialiased">{children}</body>
    </html>
  );
}
