"use client";

import Image from "next/image";
import type { TmdbTitle } from "@/app/_components/tmdbTypes";

const IMG_W500 = "https://image.tmdb.org/t/p/w500";

function displayTitle(t: TmdbTitle) {
  return t.title || t.name || "Untitled";
}

function subline(t: TmdbTitle) {
  const date = t.release_date || t.first_air_date;
  const year = date?.slice(0, 4);
  const kind = t.media_type === "tv" ? "TV" : "Movie";
  return [kind, year].filter(Boolean).join(" • ");
}

export default function Row({
  title,
  titles,
  size = "normal",
  onSelect
}: {
  title: string;
  titles: TmdbTitle[];
  size?: "normal" | "large";
  onSelect?: (t: TmdbTitle) => void;
}) {
  const show = titles.filter((t) => Boolean(t.poster_path)).slice(0, 20);
  const posterHeight = size === "large" ? 272 : 234;

  return (
    <section className="row">
      <div className="rowHeader">
        <h2 className="rowTitle">{title}</h2>
        <div className="rowHint">Scroll →</div>
      </div>

      <div className="slider">
        <div className="rail" role="list">
          {show.map((t) => (
            <div
              className="card"
              role="listitem"
              key={t.id}
              style={{ width: 156, cursor: onSelect ? "pointer" : "default" }}
              onClick={onSelect ? () => onSelect(t) : undefined}
            >
              <Image
                className="poster"
                src={`${IMG_W500}${t.poster_path}`}
                alt={displayTitle(t)}
                width={312}
                height={posterHeight * 2}
                priority={size === "large" && title.toLowerCase().includes("trending")}
              />
              <div className="cardMeta">
                <div className="cardTitle">{displayTitle(t)}</div>
                <div className="cardSub">{subline(t)}</div>
              </div>
            </div>
          ))}
          {!show.length ? (
            <div style={{ padding: "8px 0 18px", color: "rgba(255,255,255,.55)" }}>
              Loading…
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

