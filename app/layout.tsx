import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PCDA Recruit Intake",
  description: "Interactive intake, eligibility and financial planner for PCDA recruits.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <div className="text-xl font-bold">PCDA Recruit</div>
            <nav className="text-sm">
              <a className="mr-4" href="/">Home</a>
              <a className="mr-4" href="/presentation">Presentation</a>
              <a className="mr-4" href="/intake">Intake</a>
              <a className="mr-4" href="/summary">Summary</a>
              <a className="mr-4" href="/data/colleges">Colleges</a>
            </nav>
          </div>
        </header>
        <main className="container my-8">{children}</main>
        <footer className="border-t py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PCDA
        </footer>
      </body>
    </html>
  );
}
