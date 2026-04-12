import { House, Layers, FolderKanban, WalletCards, ShieldCheck, Contact2, Sparkles } from "lucide-react";
import clsx from "clsx";
import { NavLink, useNavigate } from "react-router-dom";
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
  const nav = useNavigate();
  const visibleItems = navItems.filter((item) => !(item.adminOnly && !token) || item.to === "/admin");

  const handleClick = (e, item) => {
    if (item.adminOnly && !token) {
      e.preventDefault();
      if (onNavigate) onNavigate();
      nav("/login");
    } else if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <>
      <div className="mb-8 rounded-2xl border border-sidebar-line bg-white/[0.04] p-4 backdrop-blur-sm">
        <BrandLogo variant="sidebar" />
        <p className="mt-3 text-xs leading-relaxed text-on-sidebar-muted">
          Interior and civil showcase — curated materials, projects, and client-ready galleries.
        </p>
      </div>
      <nav className="space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(e) => handleClick(e, item)}
              className={({ isActive }) =>
                clsx(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.1] text-on-sidebar shadow-glow"
                    : "text-on-sidebar-muted hover:bg-white/[0.05] hover:text-on-sidebar"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={clsx(
                      "absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-accent transition-opacity",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    )}
                  />
                  <span
                    className={clsx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      isActive
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : "border-sidebar-line bg-white/[0.03] text-on-sidebar-muted group-hover:border-white/10 group-hover:text-on-sidebar"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.to === "/admin" ? (
                    <Sparkles className="ml-auto h-3.5 w-3.5 shrink-0 text-accent/80 opacity-70" />
                  ) : null}
                </>
              )}
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
      <aside className="relative hidden border-r border-sidebar-line bg-sidebar p-5 lg:block">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, white 0%, transparent 55%)"
          }}
          aria-hidden
        />
        <div className="relative">
          <SidebarContent />
        </div>
      </aside>

      <div
        className={clsx(
          "fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileMenuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
        onClick={onCloseMobileMenu}
        role="presentation"
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-[min(20rem,88vw)] border-r border-sidebar-line bg-sidebar p-5 shadow-lift transition-transform duration-300 ease-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={onCloseMobileMenu} />
      </aside>
    </>
  );
}
