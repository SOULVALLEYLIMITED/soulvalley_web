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
  FiX,
  FiInfo,
  FiClock,
  FiUsers,
  FiImage,
  FiPlus,
} from "react-icons/fi";
import {
  ApiRequestError,
  Contact,
  CommunityUpdate,
  clearToken,
  createCommunityUpdate,
  deleteCommunityUpdate,
  deleteContact,
  fetchCommunityUpdates,
  fetchContacts,
  getToken,
  gmailComposeUrl,
  login,
  setToken,
  updateContactStatus,
  uploadCommunityImage,
  TERMS_AND_CONDITIONS,
} from "../lib/api";

type View = "contacts" | "community";

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
  const [view, setView] = useState<View>("contacts");

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

  // ✅ Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  // ✅ Check if user has accepted terms
  useEffect(() => {
    const accepted = window.localStorage.getItem("sv_terms_accepted");
    if (accepted === "true") {
      setHasAcceptedTerms(true);
    } else {
      setShowTermsModal(true);
    }
  }, []);

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
      setContacts(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 401) {
        clearToken();
        setAuthed(false);
        setContacts([]);
      } else {
        setError(
          e instanceof Error
            ? e.message
            : "Could not load messages. Is the API running?",
        );
        setContacts([]);
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

  /* ---------------- Delete Modal ---------------- */
  const handleDeleteClick = (c: Contact) => {
    setDeleteTarget(c);
    setDeleteCountdown(5);
    setShowDeleteModal(true);
  };

  const startDeleteCountdown = () => {
    if (deleteTimer) clearInterval(deleteTimer);
    
    const timer = setInterval(() => {
      setDeleteCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-delete when countdown reaches 0
          performDelete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setDeleteTimer(timer);
  };

  useEffect(() => {
    if (showDeleteModal) {
      startDeleteCountdown();
    }
    return () => {
      if (deleteTimer) clearInterval(deleteTimer);
    };
  }, [showDeleteModal]);

  const performDelete = async () => {
    if (!deleteTarget) return;
    
    const c = deleteTarget;
    setBusyId(c.id);
    const snapshot = contacts;
    setContacts((prev) => prev.filter((x) => x.id !== c.id));
    
    try {
      await deleteContact(c.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch {
      setContacts(snapshot);
      setError("Could not delete the message.");
    } finally {
      setBusyId(null);
      if (deleteTimer) clearInterval(deleteTimer);
      setDeleteCountdown(5);
    }
  };

  const cancelDelete = () => {
    if (deleteTimer) clearInterval(deleteTimer);
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteCountdown(5);
  };

  /* ---------------- Terms Modal ---------------- */
  const acceptTerms = () => {
    window.localStorage.setItem("sv_terms_accepted", "true");
    setHasAcceptedTerms(true);
    setShowTermsModal(false);
  };

  const declineTerms = () => {
    window.localStorage.setItem("sv_terms_accepted", "false");
    setShowTermsModal(false);
    // Optional: redirect or logout
    handleLogout();
  };

  /* ---------------- row actions ---------------- */
  const patchStatus = async (
    c: Contact,
    status: "new" | "read" | "replied",
  ) => {
    setBusyId(c.id);
    setContacts((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, status } : x)),
    );
    try {
      await updateContactStatus(c.id, status);
    } catch {
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

  /* ---------------- derived ---------------- */
  const counts = useMemo(() => {
    const c = { all: 0, new: 0, read: 0, replied: 0 };
    if (!Array.isArray(contacts)) return c;
    
    c.all = contacts.length;
    for (const x of contacts) {
      if (x.status === "new") c.new++;
      else if (x.status === "read") c.read++;
      else if (x.status === "replied") c.replied++;
    }
    return c;
  }, [contacts]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!Array.isArray(contacts)) return [];
    
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
    <div
      className={`text-slate-900 dark:text-slate-100 ${theme === "dark" ? "dark" : ""}`}
    >
      {/* ✅ Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiInfo className="text-blue-500" />
                Terms & Conditions
              </h2>
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                {TERMS_AND_CONDITIONS.content}
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700 pt-4">
              <button
                onClick={declineTerms}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Decline
              </button>
              <button
                onClick={acceptTerms}
                className="px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full dark:bg-red-900/30">
                  <FiTrash2 className="text-red-600 dark:text-red-400" size={20} />
                </div>
                <h2 className="text-lg font-bold">Delete Message?</h2>
              </div>
              <button
                onClick={cancelDelete}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete the message from{" "}
              <span className="font-medium text-slate-900 dark:text-white">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <FiClock className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">
                  Auto-deleting in{" "}
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {deleteCountdown}
                  </span>{" "}
                  seconds...
                </span>
              </div>
              <div className="mt-2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(deleteCountdown / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

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

        {authed && (
          <div className="px-4 pt-4 sm:px-6">
            <div className="flex w-fit gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={() => setView("contacts")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  view === "contacts"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <FiInbox size={15} className="mr-1.5 inline" />
                Contacts
              </button>
              <button
                onClick={() => setView("community")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  view === "community"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <FiUsers size={15} className="mr-1.5 inline" />
                Community
              </button>
            </div>
          </div>
        )}

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
          ) : view === "community" ? (
            <CommunityPanel />
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
                        onDelete={() => handleDeleteClick(c)}
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

/* ---------------- community panel ---------------- */
function CommunityPanel() {
  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUpdates(await fetchCommunityUpdates());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load community updates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadCommunityImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const created = await createCommunityUpdate({
        title: title.trim(),
        body: body.trim(),
        imageUrl: imageUrl || undefined,
      });
      setUpdates((prev) => [created, ...prev]);
      setTitle("");
      setBody("");
      setImageUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post the update.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this update? This cannot be undone.")) return;
    setBusyId(id);
    const snapshot = updates;
    setUpdates((prev) => prev.filter((u) => u.id !== id));
    try {
      await deleteCommunityUpdate(id);
    } catch {
      setUpdates(snapshot);
      setError("Could not delete the update.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* New update form */}
      <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <FiPlus size={16} />
          New community update
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-100"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's the update?"
            rows={5}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-100"
          />

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="community-image-input"
            />
            <label
              htmlFor="community-image-input"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:border-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-100"
            >
              <FiImage size={15} />
              {uploading ? "Uploading…" : imageUrl ? "Image attached — change" : "Attach an image (optional)"}
            </label>
            {imageUrl && !uploading && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 h-28 w-full rounded-lg object-cover"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || uploading || !title.trim() || !body.trim()}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {submitting ? "Posting…" : "Post update"}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {loading && updates.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading updates…
          </div>
        ) : updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
            <FiUsers className="mx-auto text-slate-300 dark:text-slate-600" size={40} />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No community updates yet. Post one to show up on the public community page.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {updates.map((u) => (
              <div
                key={u.id}
                className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${
                  busyId === u.id ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{u.title}</h3>
                    <time className="text-xs text-slate-400">{formatDate(u.createdAt)}</time>
                  </div>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={busyId === u.id}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
                {u.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.imageUrl}
                    alt={u.title}
                    className="mt-3 h-40 w-full rounded-lg object-cover"
                  />
                )}
                <p className="mt-2 whitespace-pre-wrap break-words wrap-anywhere text-sm text-slate-600 dark:text-slate-300">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        )}
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
            {c.source === "ai_chat" && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                🤖 AI
              </span>
            )}
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

      <p className="mt-3 text-sm font-medium break-words wrap-anywhere">{c.subject}</p>
      <p
        ref={messageRef}
        className={`mt-1 whitespace-pre-wrap break-words wrap-anywhere text-sm text-slate-600 dark:text-slate-300 ${
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