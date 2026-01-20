<script lang="ts">
  import type { Movie } from './api';
  import { getGenreGradient } from './genreColors';

  interface Props {
    movie: Movie;
    onBack: () => void;
  }

  let { movie, onBack }: Props = $props();
</script>

<div class="space-y-6">
  <!-- Back button -->
  <button
    onclick={onBack}
    class="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors group"
  >
    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    Back to results
  </button>

  <!-- Hero section -->
  <div class="bg-gradient-to-br {getGenreGradient(movie.genre)} rounded-3xl p-8 md:p-12">
    <div class="max-w-2xl">
      <span class="inline-block px-4 py-1.5 bg-black/30 backdrop-blur rounded-full text-sm font-medium text-white/80 mb-4 capitalize">
        {movie.genre}
      </span>
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
        {movie.title}
      </h1>
      <div class="flex items-center gap-4 text-white/70">
        <span class="text-2xl font-mono font-bold text-white">{movie.votes}</span>
        <span>vote{movie.votes !== 1 ? 's' : ''}</span>
      </div>
    </div>
  </div>

  <!-- Scores -->
  {#if movie.rotten_tomatoes_score || movie.popcornmeter_score || movie.imdb_score}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#if movie.rotten_tomatoes_score !== null}
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <div class="text-4xl mb-2">🍅</div>
          <div class="text-3xl font-bold text-zinc-100 mb-1">{movie.rotten_tomatoes_score}%</div>
          <div class="text-sm text-zinc-500">Tomatometer</div>
        </div>
      {/if}
      
      {#if movie.popcornmeter_score !== null}
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <div class="text-4xl mb-2">🍿</div>
          <div class="text-3xl font-bold text-zinc-100 mb-1">{movie.popcornmeter_score}%</div>
          <div class="text-sm text-zinc-500">Popcornmeter</div>
        </div>
      {/if}
      
      {#if movie.imdb_score !== null}
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <div class="text-4xl mb-2">⭐</div>
          <div class="text-3xl font-bold text-zinc-100 mb-1">{movie.imdb_score}</div>
          <div class="text-sm text-zinc-500">IMDb Score</div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Links -->
  <div class="flex flex-wrap gap-4">
    {#if movie.trailer_url}
      <a
        href={movie.trailer_url}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 hover:bg-zinc-800 transition-all group"
      >
        <span class="text-2xl">🎬</span>
        <div>
          <div class="font-medium text-zinc-200 group-hover:text-white transition-colors">Watch Trailer</div>
          <div class="text-sm text-zinc-500">On YouTube</div>
        </div>
        <svg class="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </a>
    {/if}
  </div>
</div>

