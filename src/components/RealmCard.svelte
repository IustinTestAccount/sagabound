<script lang="ts">
  import type { MythologyEntry } from '../data/types';

  export let realm: MythologyEntry;

  let imageFailed = false;
</script>

<article class="realm-card">
  <div class="realm-map">
    {#if imageFailed}
      <div class="map-fallback">
        <span>ᚱ</span>
      </div>
    {:else}
      <img src={realm.image.url} alt={realm.image.alt} loading="lazy" on:error={() => (imageFailed = true)} />
    {/if}
  </div>
  <div>
    <div class="realm-meta">
      <span>{realm.type}</span>
      <span>Risk {realm.dangerLevel}/10</span>
    </div>
    <h3>{realm.name}</h3>
    <p>{realm.description}</p>
  </div>
</article>
