"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import logo from "@/public/images/soul_valley_logo.png";
import { CommunityUpdate, fetchCommunityUpdates } from "../lib/api";

const PAGE_SIZE = 6;

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function readTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function excerpt(body: string, max = 140): string {
  const clean = body.trim().replace(/\s+/g, " ");
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

export default function CommunityPage() {
  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchCommunityUpdates()
      .then(setUpdates)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Could not load updates.")
      )
      .finally(() => setLoading(false));
  }, []);

  const featured = updates[0];
  const sidebarItems = updates.slice(1, 5);
  const gridItems = updates.slice(5);
  const pageCount = Math.max(1, Math.ceil(gridItems.length / PAGE_SIZE));
  const pagedItems = useMemo(
    () => gridItems.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [gridItems, page]
  );

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] px-6 lg:px-[3rem] py-5 flex items-center justify-between">
        <Link href="/">
          <Image src={logo} alt="Soulvalley" width={120} height={36} className="object-contain" />
        </Link>
        <Link
          href="/"
          className="text-sm text-dark/50 hover:text-dark transition-colors flex items-center gap-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          ← Back to site
        </Link>
      </div>

      <div className="px-6 lg:px-[3rem] py-16 lg:py-24">
        {/* Header */}
        <div className="border-b border-[var(--color-border)] pb-12 mb-14">
          <span
            className="rounded-full border border-dark/30 px-4 py-1 text-sm text-dark/50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Community
          </span>
          <h1
            className="mt-6 text-4xl lg:text-6xl font-bold text-dark leading-[1.05]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What we're building
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg text-[var(--mid)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Updates, milestones, and news from the Soul Valley team.
          </p>
        </div>

        {loading ? (
          <p className="text-[var(--mid)]" style={{ fontFamily: "var(--font-body)" }}>
            Loading updates…
          </p>
        ) : error ? (
          <p className="text-red-600" style={{ fontFamily: "var(--font-body)" }}>
            {error}
          </p>
        ) : updates.length === 0 ? (
          <p className="text-[var(--mid)]" style={{ fontFamily: "var(--font-body)" }}>
            No updates yet — check back soon.
          </p>
        ) : (
          <>
            {/* Latest update — featured + sidebar list */}
            <section className="grid gap-10 lg:grid-cols-[1fr_380px]">
              <div>
                <h2
                  className="mb-5 text-2xl font-bold text-dark lg:hidden"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Latest update
                </h2>
                {featured.imageUrl && (
                  <div className="relative h-64 w-full overflow-hidden rounded-[20px] sm:h-80 lg:h-[420px]">
                    <Image
                      src={featured.imageUrl}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  </div>
                )}
                <div className="mt-5">
                  <p
                    className="text-xs uppercase tracking-wide text-[var(--light)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {formatDate(featured.createdAt)} · {readTime(featured.body)}
                  </p>
                  <h3
                    className="mt-2 text-2xl lg:text-3xl font-bold text-dark leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {featured.title}
                  </h3>
                  <p
                    className="mt-3 text-[var(--mid)] leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {excerpt(featured.body, 260)}
                  </p>
                </div>
              </div>

              {sidebarItems.length > 0 && (
                <div>
                  <h2
                    className="mb-5 text-lg font-bold text-dark"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    More from the team
                  </h2>
                  <div className="flex flex-col gap-5">
                    {sidebarItems.map((u) => (
                      <div key={u.id} className="flex gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[var(--color-surface)]">
                          {u.imageUrl && (
                            <Image
                              src={u.imageUrl}
                              alt={u.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4
                            className="text-sm font-semibold text-dark leading-snug line-clamp-2"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {u.title}
                          </h4>
                          <p
                            className="mt-1 text-xs text-[var(--light)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {formatDate(u.createdAt)} · {readTime(u.body)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* All other updates — card grid with pagination */}
            {gridItems.length > 0 && (
              <section className="mt-20">
                <div className="mb-8 flex items-center justify-between">
                  <h2
                    className="text-2xl font-bold text-dark"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    All updates
                  </h2>
                  {pageCount > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        aria-label="Previous page"
                        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border)] text-dark transition hover:bg-[var(--color-surface)] disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                        disabled={page >= pageCount - 1}
                        aria-label="Next page"
                        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border)] text-dark transition hover:bg-[var(--color-surface)] disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {pagedItems.map((u) => (
                    <article
                      key={u.id}
                      className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden flex flex-col"
                    >
                      {u.imageUrl && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={u.imageUrl}
                            alt={u.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col gap-3">
                        <p
                          className="text-xs uppercase tracking-wide text-[var(--light)]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {formatDate(u.createdAt)} · {readTime(u.body)}
                        </p>
                        <h3
                          className="text-xl font-bold text-dark"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {u.title}
                        </h3>
                        <p
                          className="text-sm text-[var(--mid)] leading-relaxed"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {excerpt(u.body)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                {pageCount > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                          i === page
                            ? "bg-dark text-white"
                            : "text-dark/60 hover:bg-[var(--color-surface)]"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
