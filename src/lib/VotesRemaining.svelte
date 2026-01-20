<script lang="ts">
  import { votesRemaining, votedMovies } from './stores';

  interface Props {
    onToggleSecret?: () => void;
  }

  let { onToggleSecret }: Props = $props();

  function clearLocalVotes() {
    votedMovies.set([]);
  }
</script>

<div class="fixed bottom-6 right-6 z-50">
  <div class="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 shadow-2xl shadow-black/50">
    <div class="flex items-center gap-3">
      <div class="flex gap-1">
        {#each Array(2) as _, i}
          <div 
            class="w-3 h-3 rounded-full transition-all duration-300 {i < $votesRemaining ? 'bg-emerald-500' : 'bg-zinc-700'}"
          ></div>
        {/each}
      </div>
      <span class="text-sm font-medium {$votesRemaining > 0 ? 'text-zinc-300' : 'text-zinc-500'}">
        {$votesRemaining} <button onclick={() => onToggleSecret?.()} class="cursor-text hover:text-emerald-400 transition-colors">vote{$votesRemaining !== 1 ? 's' : ''}</button> <button onclick={clearLocalVotes} class="cursor-text hover:text-emerald-400 transition-colors">left</button>
      </span>
    </div>
  </div>
</div>
