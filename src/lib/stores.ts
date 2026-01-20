import { writable, derived } from 'svelte/store';
import type { Movie } from './api';

// Movies store
export const movies = writable<Movie[]>([]);

// LocalStorage key for voted movies
const VOTED_MOVIES_KEY = 'voted_movies';

// Get initial voted movies from localStorage
function getVotedMoviesFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(VOTED_MOVIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Voted movies store
export const votedMovies = writable<string[]>(getVotedMoviesFromStorage());

// Sync to localStorage whenever votedMovies changes
votedMovies.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(VOTED_MOVIES_KEY, JSON.stringify(value));
  }
});

// Derived store for votes remaining
export const votesRemaining = derived(votedMovies, ($votedMovies) => {
  return Math.max(0, 2 - $votedMovies.length);
});

// Helper to count votes for a movie
export function votesForMovie(movieId: string, votedList: string[]): number {
  return votedList.filter(id => id === movieId).length;
}

// Add a vote (allows voting for same movie twice)
export function addVote(movieId: string): void {
  votedMovies.update((current) => {
    if (current.length >= 2) {
      return current;
    }
    return [...current, movieId];
  });
}

