import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="grid min-h-screen app-shell-grid">
      <Sidebar mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} />
      <div className="relative flex min-h-screen min-w-0 flex-col">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-25" aria-hidden>
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-accent/20 blur-[100px] dark:bg-accent/10" />
          <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-orange-500/15 blur-[90px] dark:bg-orange-400/10" />
        </div>
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="relative z-0 flex-1 p-4 sm:p-5 lg:p-8">
          <div className="animate-fade-in mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
