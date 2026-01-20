<script lang="ts">
  import { flip } from 'svelte/animate';
  import { movies } from './stores';
  import type { Movie } from './api';
  import { getGenreBarColors } from './genreColors';

  interface Props {
    onSelectGenre: (movie: Movie) => void;
  }

  let { onSelectGenre }: Props = $props();

  // Sort movies by votes (descending)
  let sortedMovies = $derived([...$movies].sort((a, b) => b.votes - a.votes));
  
  // Get max votes for bar scaling
  let maxVotes = $derived(Math.max(...$movies.map(m => m.votes), 1));
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-3xl font-bold text-zinc-100 mb-2">Live Results</h2>
    <p class="text-zinc-500">Click on a genre to see movie details</p>
  </div>

  {#if sortedMovies.length === 0}
    <div class="text-center py-12 text-zinc-500">
      <p>No votes yet. Be the first to vote!</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each sortedMovies as movie, index (movie.id)}
        {@const colors = getGenreBarColors(movie.genre)}
        {@const percentage = maxVotes > 0 ? (movie.votes / maxVotes) * 100 : 0}
        
        <div animate:flip={{ duration: 400 }}>
          <button
            onclick={() => onSelectGenre(movie)}
            class="w-full text-left group"
          >
          <div class="relative {colors.bg} border border-zinc-800 rounded-xl p-5 transition-all duration-300 hover:border-zinc-600 hover:scale-[1.01] overflow-hidden">
            <!-- Progress bar background -->
            <div class="absolute inset-0 opacity-20">
              <div 
                class="{colors.bar} h-full transition-all duration-700 ease-out"
                style="width: {percentage}%"
              ></div>
            </div>
            
            <!-- Content -->
            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-lg font-mono font-bold text-zinc-500">{index + 1}.</span>
                  <span class="text-lg font-bold {colors.text} capitalize group-hover:text-zinc-100 transition-colors">
                    {movie.genre}
                  </span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-3xl font-mono font-bold text-zinc-100">
                    {movie.votes}
                  </span>
                  <span class="text-sm text-zinc-500">
                    vote{movie.votes !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </button>
        </div>
      {/each}
    </div>

    <!-- Total votes -->
    <div class="text-center pt-6 border-t border-zinc-800">
      <span class="text-zinc-500">Total votes: </span>
      <span class="text-xl font-bold text-zinc-300">
        {$movies.reduce((sum, m) => sum + m.votes, 0)}
      </span>
    </div>
  {/if}
</div>

