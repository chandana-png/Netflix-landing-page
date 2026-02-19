export type TmdbTitle = {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

export type TmdbListResponse = {
  page: number;
  results: TmdbTitle[];
  total_pages: number;
  total_results: number;
};

