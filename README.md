# Netflix-style Landing Page (TMDB)

Frontend-only Netflix-style landing page that fetches movie data from TMDB and is deployable on Vercel.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure your `.env` contains a TMDB key:

```
TMDB_API_KEY=...
```

This project also supports your existing `VITE_TMDB_API_KEY` variable name.

3. Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Vercel

- Import the repo in Vercel
- Add the environment variable `TMDB_API_KEY` (recommended) or `VITE_TMDB_API_KEY`
- Build command: `npm run build`
- Output: Next.js (auto-detected)

