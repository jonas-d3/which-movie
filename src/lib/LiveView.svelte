<script lang="ts">
  import { movies } from './stores';
  import type { Movie } from './api';

  interface Props {
    onSelectGenre: (movie: Movie) => void;
  }

  let { onSelectGenre }: Props = $props();

  // Sort movies by votes (descending)
  let sortedMovies = $derived([...$movies].sort((a, b) => b.votes - a.votes));
  
  // Get max votes for bar scaling
  let maxVotes = $derived(Math.max(...$movies.map(m => m.votes), 1));

  const genreColors: Record<string, { bg: string; bar: string; text: string }> = {
    action: { bg: 'bg-red-500/10', bar: 'bg-red-500', text: 'text-red-400' },
    comedy: { bg: 'bg-yellow-500/10', bar: 'bg-yellow-500', text: 'text-yellow-400' },
    drama: { bg: 'bg-purple-500/10', bar: 'bg-purple-500', text: 'text-purple-400' },
    horror: { bg: 'bg-orange-500/10', bar: 'bg-orange-500', text: 'text-orange-400' },
    'sci-fi': { bg: 'bg-cyan-500/10', bar: 'bg-cyan-500', text: 'text-cyan-400' },
    romance: { bg: 'bg-pink-500/10', bar: 'bg-pink-500', text: 'text-pink-400' },
    thriller: { bg: 'bg-amber-500/10', bar: 'bg-amber-500', text: 'text-amber-400' },
    animation: { bg: 'bg-green-500/10', bar: 'bg-green-500', text: 'text-green-400' },
    documentary: { bg: 'bg-blue-500/10', bar: 'bg-blue-500', text: 'text-blue-400' },
  };

  function getColors(genre: string) {
    const key = genre.toLowerCase();
    return genreColors[key] || { bg: 'bg-zinc-500/10', bar: 'bg-zinc-500', text: 'text-zinc-400' };
  }
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
        {@const colors = getColors(movie.genre)}
        {@const percentage = maxVotes > 0 ? (movie.votes / maxVotes) * 100 : 0}
        
        <button
          onclick={() => onSelectGenre(movie)}
          class="w-full text-left group"
        >
          <div class="relative {colors.bg} border border-zinc-800 rounded-xl p-5 transition-all duration-300 hover:border-zinc-600 hover:scale-[1.01] overflow-hidden">
            <!-- Rank badge -->
            <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
              {index + 1}
            </div>
            
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
                <span class="text-2xl font-bold {colors.text} capitalize group-hover:text-zinc-100 transition-colors">
                  {movie.genre}
                </span>
                <div class="flex items-center gap-4">
                  <span class="text-3xl font-mono font-bold text-zinc-100">
                    {movie.votes}
                  </span>
                  <span class="text-sm text-zinc-500">
                    vote{movie.votes !== 1 ? 's' : ''}
                  </span>
                  <svg class="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </button>
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

