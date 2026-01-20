<script lang="ts">
  import type { Movie } from './api';
  import { voteForMovie } from './api';
  import { votedMovies, votesRemaining, votesForMovie, addVote } from './stores';

  interface Props {
    movie: Movie;
    showVotes?: boolean;
    showDetails?: boolean;
  }

  let { movie, showVotes = false, showDetails = true }: Props = $props();

  let isVoting = $state(false);

  const genreColors: Record<string, string> = {
    action: 'bg-red-500/20 text-red-400 border-red-500/30',
    comedy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    drama: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    horror: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'sci-fi': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    romance: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    thriller: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    animation: 'bg-green-500/20 text-green-400 border-green-500/30',
    documentary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const genreBgColors: Record<string, string> = {
    action: 'from-red-500/10 to-red-900/20 border-red-500/20',
    comedy: 'from-yellow-500/10 to-yellow-900/20 border-yellow-500/20',
    drama: 'from-purple-500/10 to-purple-900/20 border-purple-500/20',
    horror: 'from-orange-500/10 to-orange-900/20 border-orange-500/20',
    'sci-fi': 'from-cyan-500/10 to-cyan-900/20 border-cyan-500/20',
    romance: 'from-pink-500/10 to-pink-900/20 border-pink-500/20',
    thriller: 'from-amber-500/10 to-amber-900/20 border-amber-500/20',
    animation: 'from-green-500/10 to-green-900/20 border-green-500/20',
    documentary: 'from-blue-500/10 to-blue-900/20 border-blue-500/20',
  };

  function getGenreColor(genre: string): string {
    const key = genre.toLowerCase();
    return genreColors[key] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }

  function getGenreBgColor(genre: string): string {
    const key = genre.toLowerCase();
    return genreBgColors[key] || 'from-zinc-500/10 to-zinc-900/20 border-zinc-500/20';
  }

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
      {:else if alreadyVoted}
        ✓ Voted
      {:else if $votesRemaining === 0}
        No votes left
      {:else}
        Vote for this movie
      {/if}
    </button>
  </div>
{:else}
  <!-- Genre-only view (for voting) -->
  <div class="bg-gradient-to-br {getGenreBgColor(movie.genre)} border rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] {myVotes > 0 ? 'ring-2 ring-emerald-500/50' : ''}">
    <div class="text-center">
      <span class="text-3xl font-bold text-zinc-100 capitalize">
        {movie.genre}
      </span>
      
      {#if myVotes > 0}
        <div class="mt-3 text-emerald-400 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">{myVotes === 2 ? 'You voted twice!' : 'You voted for this'}</span>
        </div>
      {/if}
      
      {#if canVote}
        <button
          onclick={handleVote}
          disabled={!canVote || isVoting}
          class="mt-6 w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 
            {canVote 
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-[0.98] shadow-lg shadow-emerald-500/20' 
              : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'}"
        >
          {#if isVoting}
            <span class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Voting...
            </span>
          {:else}
            Vote
          {/if}
        </button>
      {:else if myVotes === 0}
        <div class="mt-6 py-4 px-6 text-zinc-500 text-base">
          No votes left
        </div>
      {/if}
    </div>
  </div>
{/if}
