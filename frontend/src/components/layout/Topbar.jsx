import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onOpenMobileMenu }) {
  const { admin, token, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submitSearch = () => {
    const value = query.trim();
    if (!value) return;
    navigate(`/projects?search=${encodeURIComponent(value)}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-sky-100 bg-[#eef6ff]/90 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-6 lg:py-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-2xl border border-sky-100 bg-[#f8fdff] p-2 text-slate-600 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-3 rounded-full border border-sky-100 bg-[#f8fdff] px-4 py-2 shadow-soft sm:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Search projects or materials..."
              className="w-52 bg-transparent text-sm outline-none lg:w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
              }}
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button className="rounded-2xl border border-sky-100 bg-[#f8fdff] p-2 text-slate-500 transition hover:text-slate-800">
            <Bell className="h-4 w-4" />
          </button>
          <div className="max-w-28 truncate rounded-full border border-sky-100 bg-[#f8fdff] px-3 py-2 text-xs shadow-soft sm:max-w-none sm:text-sm">
            {admin?.email || "Guest User"}
          </div>
          {token ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-[#f8fdff] px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:text-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          ) : null}
        </div>
      </div>
      <div className="px-4 pb-3 sm:hidden">
        <div className="flex items-center gap-2 rounded-full border border-sky-100 bg-[#f8fdff] px-3 py-2 shadow-soft">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            placeholder="Search projects or materials..."
            className="w-full bg-transparent text-sm outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
          />
        </div>
      </div>
    </header>
  );
}
