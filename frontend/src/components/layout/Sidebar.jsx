import { House, Layers, FolderKanban, WalletCards, ShieldCheck, Contact2 } from "lucide-react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "./BrandLogo";

const navItems = [
  { to: "/", label: "Home", icon: House },
  { to: "/materials", label: "Materials", icon: Layers },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/contact", label: "Contact", icon: Contact2 },
  { to: "/budget", label: "Budget Planner", icon: WalletCards, adminOnly: true },
  { to: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true }
];

function SidebarContent({ onNavigate }) {
  const { token } = useAuth();
  const visibleItems = navItems.filter((item) => !(item.adminOnly && !token));

  return (
    <>
      <div className="mb-8 rounded-2xl border border-sky-100 bg-[#ecf7ff] p-4">
        <BrandLogo />
        <p className="mt-2 text-xs text-slate-500">Interior and civil showcase platform</p>
      </div>
      <nav className="space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-soft"
                    : "text-slate-600 hover:bg-sky-50 hover:text-slate-900"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar({ mobileMenuOpen, onCloseMobileMenu }) {
  return (
    <>
      <aside className="hidden border-r border-sky-100 bg-[#f5faff] p-4 lg:block">
        <SidebarContent />
      </aside>

      <div
        className={clsx(
          "fixed inset-0 z-40 bg-slate-900/40 transition lg:hidden",
          mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
        onClick={onCloseMobileMenu}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-sky-100 bg-[#f5faff] p-4 shadow-soft transition-transform lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={onCloseMobileMenu} />
      </aside>
    </>
  );
}
