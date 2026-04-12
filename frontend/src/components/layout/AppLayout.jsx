import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="grid min-h-screen app-shell-grid">
      <Sidebar mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} />
      <div className="min-w-0 lg:bg-gradient-to-b lg:from-[#edf7ff] lg:to-bg">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="p-4 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
