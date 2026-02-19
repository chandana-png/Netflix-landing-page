"use client";

import type { TmdbTitle } from "@/app/_components/tmdbTypes";

const IMG_BASE = "https://image.tmdb.org/t/p/original";

function titleName(t: TmdbTitle) {
  return t.title || t.name || "Untitled";
}

function yearOf(t: TmdbTitle) {
  const date = t.release_date || t.first_air_date;
  return date?.slice(0, 4) || "—";
}

function clampOverview(s: string | undefined, max = 170) {
  const text = (s || "").trim();
  if (!text) return "No overview available.";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export default function Hero({ title }: { title: TmdbTitle | null }) {
  const featured = title;

  const bg = featured?.backdrop_path
    ? `${IMG_BASE}${featured.backdrop_path}`
    : featured?.poster_path
      ? `${IMG_BASE}${featured.poster_path}`
      : null;

  return (
    <section className="hero" id="home">
      <div
        className="heroBg"
        style={{
          backgroundImage: bg ? `url(${bg})` : "linear-gradient(135deg,#2a2a2a,#111)"
        }}
        aria-hidden="true"
      />
      <div className="heroShade" aria-hidden="true" />

      <div className="heroContent">
        <h1 className="heroTitle">{featured ? titleName(featured) : "Netflix"}</h1>
        <div className="heroMeta">
          <span className="badge">Top 10</span>
          <span>{featured ? yearOf(featured) : "—"}</span>
          <span style={{ opacity: 0.65 }}>•</span>
          <span>{featured?.media_type === "tv" ? "TV" : "Movie"}</span>
          {typeof featured?.vote_average === "number" ? (
            <>
              <span style={{ opacity: 0.65 }}>•</span>
              <span>{featured.vote_average.toFixed(1)} rating</span>
            </>
          ) : null}
        </div>
        <p className="heroOverview">
          {featured ? clampOverview(featured.overview) : "Loading movies…"}
        </p>
        <div className="heroActions">
          <button className="btn btnPrimary" type="button">
            Play
          </button>
          <button className="btn btnSecondary" type="button">
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}

