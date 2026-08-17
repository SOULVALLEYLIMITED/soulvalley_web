"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiSun,
  FiMoon,
  FiLogOut,
  FiSearch,
  FiMail,
  FiTrash2,
  FiCheck,
  FiRefreshCw,
  FiInbox,
  FiLock,
} from "react-icons/fi";
import {
  ApiRequestError,
  Contact,
  clearToken,
  deleteContact,
  fetchContacts,
  getToken,
  gmailComposeUrl,
  login,
  setToken,
  updateContactStatus,
} from "../lib/api";

type Tab = "all" | "new" | "read" | "replied";
type Theme = "light" | "dark";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
];

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // login form
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // data
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  /* ---------------- theme ---------------- */
  useEffect(() => {
    const stored = window.localStorage.getItem("sv_theme") as Theme | null;
    const initial: Theme =
      stored ??
      (window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sv_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ---------------- data loading ---------------- */
  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 401) {
        clearToken();
        setAuthed(false);
      } else {
        setError(
          e instanceof Error
            ? e.message
            : "Could not load messages. Is the API running?",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthed(true);
      loadContacts();
    }
    setCheckingAuth(false);
  }, [loadContacts]);

  /* ---------------- auth actions ---------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const token = await login(password);
      setToken(token);
      setAuthed(true);
      setPassword("");
      await loadContacts();
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 401) {
        setLoginError("Incorrect password. Try again.");
      } else {
        setLoginError(
          e instanceof Error ? e.message : "Login failed. Try again.",
        );
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
    setContacts([]);
    setActiveTab("all");
    setSearch("");
  };

  /* ---------------- row actions ---------------- */
  const patchStatus = async (
    c: Contact,
    status: "new" | "read" | "replied",
  ) => {
    setBusyId(c.id);
    // optimistic update
    setContacts((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, status } : x)),
    );
    try {
      await updateContactStatus(c.id, status);
    } catch {
      // revert on failure
      setContacts((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, status: c.status } : x)),
      );
      setError("Could not update the message status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReply = (c: Contact) => {
    window.open(gmailComposeUrl(c), "_blank", "noopener,noreferrer");
    if (c.status !== "replied") patchStatus(c, "replied");
  };

  const handleToggleRead = (c: Contact) =>
    patchStatus(c, c.status === "new" ? "read" : "new");

  const handleDelete = async (c: Contact) => {
    if (
      !window.confirm(
        `Delete the message from ${c.name}? This cannot be undone.`,
      )
    )
      return;
    setBusyId(c.id);
    const snapshot = contacts;
    setContacts((prev) => prev.filter((x) => x.id !== c.id));
    try {
      await deleteContact(c.id);
    } catch {
      setContacts(snapshot);
      setError("Could not delete the message.");
    } finally {
      setBusyId(null);
    }
  };

  /* ---------------- derived ---------------- */
  const counts = useMemo(() => {
    const c = { all: contacts.length, new: 0, read: 0, replied: 0 };
    for (const x of contacts) {
      if (x.status === "new") c.new++;
      else if (x.status === "read") c.read++;
      else if (x.status === "replied") c.replied++;
    }
    return c;
  }, [contacts]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (activeTab !== "all" && c.status !== activeTab) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q)
      );
    });
  }, [contacts, activeTab, search]);

  /* ---------------- render ---------------- */
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className=" flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <FiInbox size={18} />
              </span>
              <div>
                <h1 className="text-base font-semibold leading-tight">
                  Soul Valley
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Contact Inbox
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              {authed && (
                <button
                  onClick={handleLogout}
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className=" px-4 py-6 sm:px-6">
          {checkingAuth ? null : !authed ? (
            /* -------- Login -------- */
            <div className="mx-auto mt-16 w-[350px]">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <FiLock size={20} />
                </span>
                <h2 className="mt-4 text-xl font-semibold">Admin login</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter your password to view contact messages.
                </p>
                <form onSubmit={handleLogin} className="mt-6 space-y-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-100 dark:focus:ring-white/10"
                  />
                  {loginError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {loginError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loggingIn || !password}
                    className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    {loggingIn ? "Signing in…" : "Sign in"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* -------- Inbox -------- */
            <>
              {/* Tabs + controls */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        activeTab === t.key
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      {t.label}
                      <span
                        className={`rounded-full px-1.5 text-xs ${
                          activeTab === t.key
                            ? "bg-white/20 dark:bg-slate-900/20"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        {counts[t.key]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-56">
                    <FiSearch
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search messages"
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-slate-100"
                    />
                  </div>
                  <button
                    onClick={loadContacts}
                    aria-label="Refresh"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FiRefreshCw
                      size={16}
                      className={loading ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* List */}
              <div className="mt-4 space-y-3">
                {loading && contacts.length === 0 ? (
                  <div className="py-20 text-center text-sm text-slate-500 dark:text-slate-400">
                    Loading messages…
                  </div>
                ) : visible.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
                    <FiInbox
                      className="mx-auto text-slate-300 dark:text-slate-600"
                      size={40}
                    />
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      {contacts.length === 0
                        ? "No messages yet. Submissions from the website will appear here."
                        : "No messages match this filter."}
                    </p>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
                    {visible.map((c) => (
                      <ContactCard
                        key={c.id}
                        contact={c}
                        busy={busyId === c.id}
                        onReply={() => handleReply(c)}
                        onToggleRead={() => handleToggleRead(c)}
                        onDelete={() => handleDelete(c)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- card ---------------- */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    read: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    replied: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        map[status] ?? map.read
      }`}
    >
      {status}
    </span>
  );
}

function ContactCard({
  contact: c,
  busy,
  onReply,
  onToggleRead,
  onDelete,
}: {
  contact: Contact;
  busy: boolean;
  onReply: () => void;
  onToggleRead: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const check = () => {
      const el = messageRef.current;
      if (!el || expanded) return;
      setCanExpand(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [c.message, expanded]);

  return (
    <div
      className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${
        busy ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{c.name}</h3>
            <StatusBadge status={c.status} />
          </div>
          <a
            href={`mailto:${c.email}`}
            className="text-sm text-slate-500 hover:underline dark:text-slate-400"
          >
            {c.email}
          </a>
        </div>
        <time className="shrink-0 text-xs text-slate-400">
          {formatDate(c.createdAt)}
        </time>
      </div>

      <p className="mt-3 text-sm font-medium">{c.subject}</p>
      <p
        ref={messageRef}
        className={`mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300 ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {c.message}
      </p>
      {canExpand && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 self-start text-xs font-medium text-slate-500 hover:underline dark:text-slate-400"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      <div className="mt-4 flex flex-wrap gap-2 pt-1 sm:mt-auto">
        <button
          onClick={onReply}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <FiMail size={15} />
          Reply via Gmail
        </button>
        <button
          onClick={onToggleRead}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <FiCheck size={15} />
          {c.status === "new" ? "Mark read" : "Mark unread"}
        </button>
        <button
          onClick={onDelete}
          disabled={busy}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          <FiTrash2 size={15} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}
