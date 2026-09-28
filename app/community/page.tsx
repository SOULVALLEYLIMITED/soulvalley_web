"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/public/images/soul_valley_logo.png";
import { CommunityUpdate, fetchCommunityUpdates } from "../lib/api";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function CommunityPage() {
  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCommunityUpdates()
      .then(setUpdates)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Could not load updates.")
      )
      .finally(() => setLoading(false));
  }, []);

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
        <div className="border-b border-[var(--color-border)] pb-12 mb-12">
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {updates.map((u) => (
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
                  <time
                    className="text-xs uppercase tracking-wide text-[var(--light)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {formatDate(u.createdAt)}
                  </time>
                  <h2
                    className="text-xl font-bold text-dark"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {u.title}
                  </h2>
                  <p
                    className="text-sm text-[var(--mid)] whitespace-pre-wrap leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {u.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
