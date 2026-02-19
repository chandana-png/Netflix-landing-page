"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/_components/Navbar";
import Hero from "@/app/_components/Hero";
import Row from "@/app/_components/Row";
import type { TmdbListResponse, TmdbTitle } from "@/app/_components/tmdbTypes";

type Category =
  | "trending"
  | "top_rated"
  | "popular"
  | "action"
  | "comedy"
  | "horror"
  | "romance"
  | "documentary";

const ROWS: Array<{ title: string; category: Category; size?: "normal" | "large" }> =
  [
    { title: "Trending Now", category: "trending", size: "large" },
    { title: "Top Rated", category: "top_rated" },
    { title: "Popular on Netflix", category: "popular" },
    { title: "Action Movies", category: "action" },
    { title: "Comedies", category: "comedy" },
    { title: "Horror", category: "horror" },
    { title: "Romance", category: "romance" },
    { title: "Documentaries", category: "documentary" }
  ];

async function fetchCategory(category: Category): Promise<TmdbListResponse> {
  const res = await fetch(`/api/tmdb/${category}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load ${category}: ${res.status} ${text}`);
  }
  return res.json();
}

export default function HomeClient() {
  const [data, setData] = useState<Partial<Record<Category, TmdbListResponse>>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [featured, setFeatured] = useState<TmdbTitle | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.allSettled(
        ROWS.map(async (r) => [r.category, await fetchCategory(r.category)] as const)
      );
      if (cancelled) return;

      const okEntries = results.filter(
        (r): r is PromiseFulfilledResult<readonly [Category, TmdbListResponse]> =>
          r.status === "fulfilled"
      );

      const failed = results.filter(
        (r): r is PromiseRejectedResult => r.status === "rejected"
      );

      if (okEntries.length) {
        setData(Object.fromEntries(okEntries.map((r) => r.value)));
      }

      if (failed.length) {
        const first = failed[0].reason;
        const msg =
          first instanceof Error
            ? first.message
            : typeof first === "string"
              ? first
              : "Some categories failed to load.";
        setError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const trending = useMemo(() => data.trending?.results ?? [], [data.trending]);

  // when trending loads for the first time, pick the first as default hero
  useEffect(() => {
    if (!featured && trending.length) {
      setFeatured(trending[0]);
    }
  }, [featured, trending]);

  return (
    <div className="container">
      <Navbar />
      <Hero title={featured} />

      <div className="rows">
        {error ? (
          <div style={{ padding: "0 42px", color: "rgba(255,255,255,.82)" }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              Couldn’t load TMDB data.
            </div>
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>
              {error}
            </div>
            <div style={{ height: 18 }} />
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>
              Make sure your <code>.env</code> has <code>TMDB_API_KEY=...</code>{" "}
              (your current <code>VITE_TMDB_API_KEY</code> also works).
            </div>
          </div>
        ) : null}

        {ROWS.map((row) => (
          <Row
            key={row.category}
            title={row.title}
            size={row.size}
            titles={data[row.category]?.results ?? []}
            onSelect={(t) => setFeatured(t)}
          />
        ))}
      </div>
    </div>
  );
}

