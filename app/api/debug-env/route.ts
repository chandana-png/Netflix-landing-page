import { NextResponse } from "next/server";

export async function GET() {
  const hasTmdb = Boolean(process.env.TMDB_API_KEY);
  const hasViteTmdb = Boolean(process.env.VITE_TMDB_API_KEY);

  return NextResponse.json({
    has_TMDB_API_KEY: hasTmdb,
    has_VITE_TMDB_API_KEY: hasViteTmdb,
    note: "These are just booleans, your actual key is not exposed."
  });
}

