<script lang="ts">
  import type { Movie } from './api';
  import { createMovie, updateMovie, deleteMovie, resetAllVotes } from './api';
  import { movies } from './stores';

  let isAdding = $state(false);
  let editingId = $state<string | null>(null);
  let isSubmitting = $state(false);
  let isResetting = $state(false);

  // Form state
  let title = $state('');
  let genre = $state('');
  let trailer_url = $state('');
  let rotten_tomatoes_score = $state<string>('');
  let popcornmeter_score = $state<string>('');
  let imdb_score = $state<string>('');

  function resetForm() {
    title = '';
    genre = '';
    trailer_url = '';
    rotten_tomatoes_score = '';
    popcornmeter_score = '';
    imdb_score = '';
    isAdding = false;
    editingId = null;
  }

  function startEdit(movie: Movie) {
    editingId = movie.id;
    title = movie.title;
    genre = movie.genre;
    trailer_url = movie.trailer_url || '';
    rotten_tomatoes_score = movie.rotten_tomatoes_score?.toString() || '';
    popcornmeter_score = movie.popcornmeter_score?.toString() || '';
    imdb_score = movie.imdb_score?.toString() || '';
  }

  async function handleSubmit() {
    if (!title.trim() || !genre.trim()) return;
    
    isSubmitting = true;
    try {
      const movieData = {
        title: title.trim(),
        genre: genre.trim(),
        trailer_url: trailer_url.trim() || null,
        rotten_tomatoes_score: rotten_tomatoes_score ? parseInt(rotten_tomatoes_score) : null,
        popcornmeter_score: popcornmeter_score ? parseInt(popcornmeter_score) : null,
        imdb_score: imdb_score ? parseFloat(imdb_score) : null,
      };

      if (editingId) {
        const updated = await updateMovie({ id: editingId, ...movieData });
        movies.update(list => list.map(m => m.id === editingId ? updated : m));
      } else {
        const created = await createMovie(movieData);
        movies.update(list => [created, ...list]);
      }
      resetForm();
    } catch (error) {
      console.error('Submit failed:', error);
      alert(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await deleteMovie(id);
      movies.update(list => list.filter(m => m.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error instanceof Error ? error.message : 'Delete failed');
    }
  }

  async function handleResetVotes() {
    if (!confirm('Reset ALL votes to zero? This cannot be undone.')) return;
    
    isResetting = true;
    try {
      await resetAllVotes();
      movies.update(list => list.map(m => ({ ...m, votes: 0 })));
    } catch (error) {
      console.error('Reset failed:', error);
      alert(error instanceof Error ? error.message : 'Reset failed');
    } finally {
      isResetting = false;
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold text-zinc-100">Admin Panel</h2>
    {#if !isAdding && !editingId}
      <div class="flex gap-3">
        <button
          onclick={handleResetVotes}
          disabled={isResetting}
          class="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isResetting ? 'Resetting...' : 'Reset All Votes'}
        </button>
        <button
          onclick={() => isAdding = true}
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
        >
          + Add Movie
        </button>
      </div>
    {/if}
  </div>

  {#if isAdding || editingId}
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <h3 class="text-lg font-semibold text-zinc-200">
        {editingId ? 'Edit Movie' : 'Add New Movie'}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="title" class="block text-sm font-medium text-zinc-400 mb-1">Title *</label>
          <input
            id="title"
            type="text"
            bind:value={title}
            required
            class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Movie title"
          />
        </div>
        
        <div>
          <label for="genre" class="block text-sm font-medium text-zinc-400 mb-1">Genre *</label>
          <input
            id="genre"
            type="text"
            bind:value={genre}
            required
            class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="e.g. Action, Comedy, Drama"
          />
        </div>
        
        <div>
          <label for="trailer" class="block text-sm font-medium text-zinc-400 mb-1">Trailer URL</label>
          <input
            id="trailer"
            type="url"
            bind:value={trailer_url}
            class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>

      <div class="border-t border-zinc-800 pt-4">
        <h4 class="text-sm font-medium text-zinc-300 mb-3">Scores (optional)</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="rt_score" class="block text-sm font-medium text-zinc-400 mb-1">🍅 Tomatometer %</label>
            <input
              id="rt_score"
              type="number"
              min="0"
              max="100"
              bind:value={rotten_tomatoes_score}
              class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0-100"
            />
          </div>
          
          <div>
            <label for="pm_score" class="block text-sm font-medium text-zinc-400 mb-1">🍿 Popcornmeter %</label>
            <input
              id="pm_score"
              type="number"
              min="0"
              max="100"
              bind:value={popcornmeter_score}
              class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0-100"
            />
          </div>
          
          <div>
            <label for="imdb_score" class="block text-sm font-medium text-zinc-400 mb-1">⭐ IMDb Score</label>
            <input
              id="imdb_score"
              type="number"
              min="0"
              max="10"
              step="0.1"
              bind:value={imdb_score}
              class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0.0-10.0"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
        </button>
        <button
          type="button"
          onclick={resetForm}
          class="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  {/if}

  <div class="space-y-3">
    {#each $movies as movie (movie.id)}
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 flex-wrap">
            <h4 class="font-medium text-zinc-200 truncate">{movie.title}</h4>
            <span class="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">{movie.genre}</span>
            {#if movie.rotten_tomatoes_score !== null}
              <span class="text-xs text-zinc-500">🍅 {movie.rotten_tomatoes_score}%</span>
            {/if}
            {#if movie.imdb_score !== null}
              <span class="text-xs text-zinc-500">⭐ {movie.imdb_score}</span>
            {/if}
          </div>
          <div class="text-sm text-emerald-500 font-mono mt-1">{movie.votes} votes</div>
        </div>
        
        <div class="flex gap-2">
          <button
            onclick={() => startEdit(movie)}
            class="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Edit"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onclick={() => handleDelete(movie.id)}
            class="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Delete"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    {:else}
      <div class="text-center py-12 text-zinc-500">
        No movies yet. Add your first movie!
      </div>
    {/each}
  </div>
</div>
