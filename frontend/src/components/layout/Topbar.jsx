import { Bell, CheckCheck, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeader } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ onOpenMobileMenu }) {
  const { admin, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const fetchUnread = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get("/notifications/unread-count", authHeader(token));
      setUnreadCount(data.count || 0);
    } catch {
      // silent
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get("/notifications", authHeader(token));
      setNotifications(data || []);
    } catch {
      // silent
    }
  }, [token]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    if (notifOpen) fetchNotifications();
  }, [notifOpen, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all", {}, authHeader(token));
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silent
    }
  };

  const markOneRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, {}, authHeader(token));
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch {
      // silent
    }
  };

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submitSearch = () => {
    const value = query.trim();
    if (!value) return;
    navigate(`/projects?search=${encodeURIComponent(value)}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/75 backdrop-blur-xl backdrop-saturate-150 dark:bg-surface/65">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-8 lg:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="rounded-xl border border-line bg-elevated/80 p-2.5 text-subtle shadow-soft transition hover:border-accent/30 hover:text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex sm:max-w-xl">
            <div className="relative flex w-full items-center gap-3 rounded-2xl border border-line bg-elevated/60 px-4 py-2.5 shadow-soft transition focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/15 dark:bg-elevated/40">
              <Search className="h-4 w-4 shrink-0 text-subtle" aria-hidden />
              <input
                placeholder="Search projects, materials…"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-subtle outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitSearch();
                }}
              />
              <kbd className="hidden rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-subtle lg:inline">
                ↵
              </kbd>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-line bg-elevated/80 p-2.5 text-subtle transition hover:border-accent/30 hover:text-ink dark:hover:text-accent"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((p) => !p)}
              className="relative rounded-xl border border-line bg-elevated/80 p-2.5 text-subtle transition hover:border-accent/30 hover:text-ink"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-surface shadow-lift sm:w-96">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <h4 className="text-sm font-bold text-ink">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-subtle">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n._id}
                        type="button"
                        onClick={() => { if (!n.read) markOneRead(n._id); }}
                        className={`block w-full border-b border-line/50 px-4 py-3 text-left transition hover:bg-elevated/60 ${
                          n.read ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink">{n.title}</p>
                            <p className="mt-0.5 text-xs text-subtle">{n.message}</p>
                            <p className="mt-1 text-[10px] text-subtle">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden max-w-[10rem] truncate rounded-xl border border-line bg-elevated/80 px-3 py-2 text-xs font-medium text-ink shadow-soft sm:block sm:max-w-xs sm:text-sm">
            {admin?.email || "Guest"}
          </div>
          {token ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-elevated/80 px-3 py-2 text-xs font-semibold text-ink shadow-soft transition hover:border-accent/35 hover:bg-accent-muted sm:text-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : null}
        </div>
      </div>
      <div className="border-t border-line/80 px-4 pb-3 pt-2 sm:hidden">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-elevated/60 px-3 py-2.5 shadow-soft focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/15">
          <Search className="h-4 w-4 shrink-0 text-subtle" />
          <input
            placeholder="Search…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
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
