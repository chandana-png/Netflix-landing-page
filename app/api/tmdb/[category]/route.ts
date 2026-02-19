import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

const GENRES: Record<string, number> = {
  action: 28,
  comedy: 35,
  horror: 27,
  romance: 10749,
  documentary: 99
};

function getApiKey() {
  return process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
}

function buildTmdbUrl(category: string) {
  const common = new URLSearchParams({
    language: "en-US",
    include_adult: "false"
  });

  if (category === "trending") {
    return `${TMDB_BASE}/trending/all/week?${common.toString()}`;
  }
  if (category === "top_rated") {
    return `${TMDB_BASE}/movie/top_rated?${common.toString()}`;
  }
  if (category === "popular") {
    return `${TMDB_BASE}/movie/popular?${common.toString()}`;
  }

  if (category in GENRES) {
    const params = new URLSearchParams({
      ...Object.fromEntries(common.entries()),
      sort_by: "popularity.desc",
      with_genres: String(GENRES[category])
    });
    return `${TMDB_BASE}/discover/movie?${params.toString()}`;
  }

  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const baseUrl = buildTmdbUrl(category);
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Unknown category" },
      { status: 400 }
    );
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TMDB API key. Set TMDB_API_KEY or VITE_TMDB_API_KEY in .env" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("api_key", apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 * 30 }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reach TMDB",
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

