// Genre color mappings - centralized for consistency

export const genreColors: Record<string, string> = {
  'drama': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'crime/drama': 'bg-red-500/20 text-red-400 border-red-500/30',
  'mystery/thriller': 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
  'romance/comedy': 'bg-pink-400/20 text-pink-300 border-pink-400/30',
};

export const genreBgColors: Record<string, string> = {
  'drama': 'bg-purple-500/10 border-purple-500/20',
  'crime/drama': 'bg-red-500/10 border-red-500/20',
  'mystery/thriller': 'bg-cyan-400/10 border-cyan-400/20',
  'romance/comedy': 'bg-pink-400/10 border-pink-400/20',
};

export const genreBarColors: Record<string, { bg: string; bar: string; text: string }> = {
  'drama': { bg: 'bg-purple-500/10', bar: 'bg-purple-500', text: 'text-purple-400' },
  'crime/drama': { bg: 'bg-red-500/10', bar: 'bg-red-500', text: 'text-red-400' },
  'mystery/thriller': { bg: 'bg-cyan-400/10', bar: 'bg-cyan-400', text: 'text-cyan-300' },
  'romance/comedy': { bg: 'bg-pink-400/10', bar: 'bg-pink-400', text: 'text-pink-300' },
};

export const genreGradients: Record<string, string> = {
  'drama': 'from-purple-600 to-purple-900',
  'crime/drama': 'from-red-600 to-red-900',
  'mystery/thriller': 'from-cyan-500 to-cyan-800',
  'romance/comedy': 'from-pink-500 to-pink-800',
};

// Helper functions
export function getGenreColor(genre: string): string {
  const key = genre.toLowerCase();
  return genreColors[key] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

export function getGenreBgColor(genre: string): string {
  const key = genre.toLowerCase();
  return genreBgColors[key] || 'bg-zinc-500/10 border-zinc-500/20';
}

export function getGenreBarColors(genre: string): { bg: string; bar: string; text: string } {
  const key = genre.toLowerCase();
  return genreBarColors[key] || { bg: 'bg-zinc-500/10', bar: 'bg-zinc-500', text: 'text-zinc-400' };
}

export function getGenreGradient(genre: string): string {
  const key = genre.toLowerCase();
  return genreGradients[key] || 'from-zinc-600 to-zinc-900';
}

