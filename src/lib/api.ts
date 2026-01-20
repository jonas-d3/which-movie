const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface Movie {
  id: string;
  title: string;
  genre: string;
  votes: number;
  trailer_url: string | null;
  rotten_tomatoes_score: number | null;
  popcornmeter_score: number | null;
  imdb_score: number | null;
  created_at: string;
}

export async function fetchMovies(): Promise<Movie[]> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/movies`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
}

export async function fetchMovie(id: string): Promise<Movie> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/movies?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie');
  }
  return response.json();
}

export async function createMovie(movie: Omit<Movie, 'id' | 'votes' | 'created_at'>): Promise<Movie> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create movie');
  }
  return response.json();
}

export async function updateMovie(movie: Partial<Movie> & { id: string }): Promise<Movie> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/movies`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update movie');
  }
  return response.json();
}

export async function deleteMovie(id: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/movies?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete movie');
  }
}

export async function voteForMovie(movieId: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movie_id: movieId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to vote');
  }
}

export async function resetAllVotes(): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/reset-votes`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reset votes');
  }
}

