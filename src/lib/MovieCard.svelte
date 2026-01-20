<script lang="ts">
  import type { Movie } from './api';
  import { voteForMovie } from './api';
  import { votedMovies, votesRemaining, votesForMovie, addVote } from './stores';
  import { getGenreColor, getGenreBgColor } from './genreColors';

  interface Props {
    movie: Movie;
    showVotes?: boolean;
    showDetails?: boolean;
  }

  let { movie, showVotes = false, showDetails = true }: Props = $props();

  let isVoting = $state(false);

  let myVotes = $derived(votesForMovie(movie.id, $votedMovies));
  let canVote = $derived($votesRemaining > 0);

  async function handleVote() {
    if (!canVote || isVoting) return;
    
    isVoting = true;
    try {
      await voteForMovie(movie.id);
      addVote(movie.id);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      isVoting = false;
    }
  }
</script>

{#if showDetails}
  <!-- Full detail view (for admin) -->
  <div class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-xl font-semibold text-zinc-100 leading-tight">{movie.title}</h3>
      {#if showVotes}
        <span class="text-sm font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
          {movie.votes} votes
        </span>
      {/if}
    </div>

    <span class="inline-block px-3 py-1 text-xs font-medium rounded-full border {getGenreColor(movie.genre)} mb-4">
      {movie.genre}
    </span>

    <div class="flex gap-3 mb-4">
      {#if movie.trailer_url}
        <a
          href={movie.trailer_url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Trailer
        </a>
      {/if}
    </div>

    <button
      onclick={handleVote}
      disabled={!canVote || isVoting}
      class="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 
        {canVote 
          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-[0.98]' 
          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'}"
    >
      {#if isVoting}
        <span class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Voting...
        </span>
      {:else if myVotes > 0}
        ✓ Voted
      {:else if $votesRemaining === 0}
        No votes left
      {:else}
        Vote for this movie
      {/if}
    </button>
  </div>
{:else}
  <!-- Genre-only view (for voting) - entire card is clickable -->
  <button
    onclick={handleVote}
    disabled={!canVote || isVoting}
    class="w-full text-left {getGenreBgColor(movie.genre)} border rounded-2xl p-10 transition-all duration-300 
      {canVote ? 'hover:scale-[1.02] cursor-pointer active:scale-[0.98]' : 'opacity-60 cursor-not-allowed'} 
      {myVotes > 0 ? 'ring-2 ring-emerald-500/50' : ''}"
  >
    <div class="text-center">
      {#if isVoting}
        <div class="flex items-center justify-center gap-2 text-zinc-300">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      {:else}
        <span class="text-2xl font-bold text-zinc-100 capitalize">
          {movie.genre}
        </span>
        
        {#if myVotes > 0}
          <div class="mt-2 text-emerald-400 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">{myVotes === 2 ? 'Voted twice!' : 'Voted'}</span>
          </div>
        {/if}
      {/if}
    </div>
  </button>
{/if}
