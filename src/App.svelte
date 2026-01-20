<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from './lib/supabase';
  import { fetchMovies } from './lib/api';
  import { movies } from './lib/stores';
  import type { Movie } from './lib/api';
  import MovieCard from './lib/MovieCard.svelte';
  import VotesRemaining from './lib/VotesRemaining.svelte';
  import Admin from './lib/Admin.svelte';
  import LiveView from './lib/LiveView.svelte';
  import MovieDetail from './lib/MovieDetail.svelte';

  type View = 'vote' | 'live' | 'admin' | 'detail';
  
  let currentView = $state<View>('vote');
  let selectedMovie = $state<Movie | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  onMount(() => {
    // Check for view mode via URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      currentView = 'admin';
    } else if (params.get('live') === 'true') {
      currentView = 'live';
    }

    // Load movies
    loadMovies();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('movies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'movies',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            movies.update(list => [payload.new as Movie, ...list]);
          } else if (payload.eventType === 'UPDATE') {
            movies.update(list => 
              list.map(m => m.id === payload.new.id ? payload.new as Movie : m)
            );
            // Update selected movie if viewing it
            if (selectedMovie && selectedMovie.id === payload.new.id) {
              selectedMovie = payload.new as Movie;
            }
          } else if (payload.eventType === 'DELETE') {
            movies.update(list => list.filter(m => m.id !== payload.old.id));
            // Go back if viewing deleted movie
            if (selectedMovie && selectedMovie.id === payload.old.id) {
              selectedMovie = null;
              currentView = 'live';
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  });

  async function loadMovies() {
    try {
      const data = await fetchMovies();
      movies.set(data);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load movies';
    } finally {
      isLoading = false;
    }
  }

  function navigateTo(view: View) {
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    url.searchParams.delete('live');
    
    if (view === 'admin') {
      url.searchParams.set('admin', 'true');
    } else if (view === 'live') {
      url.searchParams.set('live', 'true');
    }
    
    window.history.pushState({}, '', url);
    currentView = view;
    selectedMovie = null;
  }

  function handleSelectGenre(movie: Movie) {
    selectedMovie = movie;
    currentView = 'detail';
  }

  function handleBackFromDetail() {
    selectedMovie = null;
    currentView = 'live';
  }
</script>

<div class="min-h-screen bg-zinc-950">
  <!-- Header -->
  <header class="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
    <div class="max-w-4xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <span class="text-2xl">🎬</span>
          Which Movie?
        </h1>
        
        <div class="flex gap-2">
          <button
            onclick={() => navigateTo('vote')}
            class="text-sm px-3 py-1.5 rounded-lg transition-colors
              {currentView === 'vote' 
                ? 'bg-emerald-600/20 text-emerald-400' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}"
          >
            Vote
          </button>
          <button
            onclick={() => navigateTo('live')}
            class="text-sm px-3 py-1.5 rounded-lg transition-colors
              {currentView === 'live' || currentView === 'detail'
                ? 'bg-emerald-600/20 text-emerald-400' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}"
          >
            Live Results
          </button>
          <button
            onclick={() => navigateTo('admin')}
            class="text-sm px-3 py-1.5 rounded-lg transition-colors
              {currentView === 'admin' 
                ? 'bg-emerald-600/20 text-emerald-400' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 py-8">
    {#if isLoading}
      <div class="flex items-center justify-center py-20">
        <div class="flex items-center gap-3 text-zinc-400">
          <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading movies...</span>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
        <p class="text-red-400">{error}</p>
        <button
          onclick={loadMovies}
          class="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    {:else if currentView === 'admin'}
      <Admin />
    {:else if currentView === 'live'}
      <LiveView onSelectGenre={handleSelectGenre} />
    {:else if currentView === 'detail' && selectedMovie}
      <MovieDetail movie={selectedMovie} onBack={handleBackFromDetail} />
    {:else}
      <!-- Vote View -->
      {#if $movies.length === 0}
        <div class="text-center py-20 text-zinc-500">
          <p class="text-lg">No movies to vote on yet.</p>
          <p class="text-sm mt-2">Ask the admin to add some movies!</p>
        </div>
      {:else}
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-zinc-100 mb-2">Vote for a Genre</h2>
          <p class="text-zinc-500">Pick the genre you want to watch tonight</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each $movies as movie (movie.id)}
            <MovieCard {movie} showVotes={false} showDetails={false} />
          {/each}
        </div>
      {/if}
      
      <VotesRemaining />
    {/if}
  </main>
</div>
