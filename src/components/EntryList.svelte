<script lang="ts">
  import type { MythologyEntry } from '../data/types';

  export let entries: MythologyEntry[];
</script>

<div class="entry-list">
  {#each entries as entry}
    <article class="entry-row">
      <div class="entry-glyph">{entry.category.slice(0, 1).toUpperCase()}</div>
      <div>
        <div class="entry-meta">
          <span>{entry.category}</span>
          <span>{entry.realmId}</span>
          <span>Rating {entry.rating.toFixed(1)}</span>
        </div>
        <h3>{entry.name ?? entry.title}</h3>
        <p>{entry.description}</p>
      </div>
      <strong>{entry.discovered ? 'Discovered' : 'Locked'}</strong>
    </article>
  {/each}
</div>
