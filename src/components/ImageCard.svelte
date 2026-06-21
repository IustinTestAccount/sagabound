<script lang="ts">
  import type { MythologyEntry } from '../data/types';

  export let entry: MythologyEntry;
  export let featured = false;

  let imageFailed = false;

  function handleImageError(): void {
    imageFailed = true;
  }
</script>

<article class:featured class="image-card">
  <div class="image-shell" aria-label={entry.image.alt}>
    {#if imageFailed}
      <div class="image-fallback">
        <span>{entry.category}</span>
        <strong>{entry.name ?? entry.title}</strong>
      </div>
    {:else}
      <img src={entry.image.url} alt={entry.image.alt} loading={featured ? 'eager' : 'lazy'} on:error={handleImageError} />
    {/if}
    <div class="rune-mark">ᛟ</div>
  </div>

  <div class="card-body">
    <div class="card-kicker">
      <span>{entry.type}</span>
      <span>Danger {entry.dangerLevel}</span>
    </div>
    <h3>{entry.name ?? entry.title}</h3>
    <p>{entry.description}</p>
    <div class="tag-row">
      {#each entry.tags.slice(0, 3) as tag}
        <span>{tag}</span>
      {/each}
    </div>
  </div>
</article>
