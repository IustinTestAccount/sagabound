<script lang="ts">
  import EntryList from './components/EntryList.svelte';
  import ImageCard from './components/ImageCard.svelte';
  import RealmCard from './components/RealmCard.svelte';
  import SectionHeader from './components/SectionHeader.svelte';
  import type { MythologyCategory, MythologyEntry } from './data/types';
  import { allEntries, homepageGods, homepageRealms, mythologyDataset } from './data/mythology';
  import {
    calculateAverageMythRating,
    calculateCompletionPercentage,
    countEntriesByCategory,
    filterLibrary,
    filterRecommendations,
    getTopMythologyCategory,
    sortMyths
  } from './lib/mythologyLogic';

  let selectedRealm = 'all';
  let selectedCategory: MythologyCategory | 'all' = 'all';
  let selectedDiscovery: 'all' | 'discovered' | 'locked' = 'all';

  const mythologyEntries = allEntries;
  const categoryCounts = countEntriesByCategory(mythologyEntries);
  const averageRating = calculateAverageMythRating(mythologyDataset.myths);
  const completion = calculateCompletionPercentage(mythologyEntries);
  const topCategory = getTopMythologyCategory(mythologyEntries) ?? 'god';

  const nineWorlds = [
    'Asgard',
    'Vanaheim',
    'Alfheim',
    'Midgard',
    'Jotunheim',
    'Svartalfheim',
    'Nidavellir',
    'Muspelheim',
    'Helheim'
  ];

  $: discoveryFilter =
    selectedDiscovery === 'all' ? ('all' as const) : selectedDiscovery === 'discovered';

  $: filteredLibrary = sortMyths(
    filterLibrary(mythologyEntries, {
      realmId: selectedRealm,
      category: selectedCategory,
      discovered: discoveryFilter
    }),
    'rating'
  ).slice(0, 7);

  $: activeRecommendations = filterRecommendations(
    mythologyDataset.recommendations,
    mythologyEntries,
    mythologyDataset.userDiscoveries,
    completion
  );

  const sagaEntries: MythologyEntry[] = sortMyths(
    [...mythologyDataset.myths, ...mythologyDataset.sagaFragments],
    'dangerLevel'
  ).slice(0, 5);
</script>

<div class="app-shell">
  <header class="top-nav">
    <a class="brand" href="#discover" aria-label="Sagabound home">
      <span class="brand-mark">ᛋ</span>
      <span>Sagabound</span>
    </a>
    <nav aria-label="Primary navigation">
      <a href="#discover">Discover</a>
      <a href="#realms">Realms</a>
      <a href="#library">Saga Library</a>
      <a href="#recommendations">Recommendations</a>
    </nav>
    <div class="user-chip">Iustin Mitu</div>
  </header>

  <main>
    <section id="discover" class="opening-grid" aria-labelledby="opening-title">
      <div class="intro-panel tree-panel">
        <div class="tree-backdrop" aria-hidden="true">
          <div class="tree-aura"></div>
          <div class="tree-trunk"></div>
          <div class="tree-canopy canopy-1"></div>
          <div class="tree-canopy canopy-2"></div>
          <div class="tree-canopy canopy-3"></div>
          <div class="tree-root root-1"></div>
          <div class="tree-root root-2"></div>
          <div class="tree-root root-3"></div>
          <div class="tree-sigil">ᛉ</div>
          <div class="tree-core">
            <strong>Yggdrasil</strong>
            <span>The world tree</span>
          </div>

          {#each nineWorlds as world, index}
            <span class={`world-node node-${index + 1}`}>{world}</span>
          {/each}
        </div>

        <div class="tree-content">
          <span class="eyebrow">Norse discovery archive</span>
          <h2 id="opening-title">Yggdrasil and the Nine Realms</h2>
          <p>
            Explore how gods, creatures, relics, and prophecies move across the branches of the
            world tree. The archive is built for compact discovery, strong visuals, and mythology-focused navigation.
          </p>

          <div class="tree-stats">
            <div>
              <strong>{completion}%</strong>
              <span>Archive complete</span>
            </div>
            <div>
              <strong>{averageRating.toFixed(2)}</strong>
              <span>Average myth rating</span>
            </div>
            <div>
              <strong>{categoryCounts.realm}</strong>
              <span>Realms mapped</span>
            </div>
            <div>
              <strong>{topCategory}</strong>
              <span>Dominant category</span>
            </div>
          </div>

          <div class="tree-note">
            Current route: Odin's rune sequence. Crossings between Midgard, Jotunheim, and Helheim
            are currently the most active discovery paths.
          </div>

          <div class="intro-actions">
            <a href="#library">Open Saga Library</a>
            <a href="#realms">Trace Realms</a>
          </div>
        </div>
      </div>

      <div class="featured-grid" aria-label="Featured gods">
        {#each homepageGods as god}
          <ImageCard entry={god} featured />
        {/each}
      </div>
    </section>

    <section class="stats-strip" aria-label="Explorer statistics">
      <article>
        <span>{completion}%</span>
        <p>Discovery completion</p>
      </article>
      <article>
        <span>{averageRating.toFixed(2)}</span>
        <p>Average myth rating</p>
      </article>
      <article>
        <span>{categoryCounts.realm}</span>
        <p>Mapped realms</p>
      </article>
      <article>
        <span>{topCategory}</span>
        <p>Dominant path</p>
      </article>
    </section>

    <section id="realms" class="section-block">
      <SectionHeader
        eyebrow="World map"
        title="Mythic realms visible at first pass"
        description="Asgard, Midgard, Jotunheim, and Helheim anchor the main exploration routes."
      />
      <div class="realm-grid">
        {#each homepageRealms as realm}
          <RealmCard {realm} />
        {/each}
      </div>
    </section>

    <section class="profile-library-grid">
      <aside class="explorer-profile" aria-labelledby="profile-title">
        <span class="eyebrow">Explorer profile</span>
        <h2 id="profile-title">Iustin Mitu</h2>
        <p>
          Current path: Odin's rune sequence. The archive recommends high-signal entries based on discovered tags,
          completion percentage, and myth rating.
        </p>
        <div class="profile-meter">
          <div style={`width: ${completion}%`}></div>
        </div>
        <dl>
          <div>
            <dt>Saved artifacts</dt>
            <dd>{mythologyDataset.artifacts.filter((entry) => entry.discovered).length}</dd>
          </div>
          <div>
            <dt>Explored realms</dt>
            <dd>{homepageRealms.filter((entry) => entry.discovered).length}</dd>
          </div>
          <div>
            <dt>Active fragments</dt>
            <dd>{mythologyDataset.sagaFragments.filter((entry) => entry.discovered).length}</dd>
          </div>
        </dl>
      </aside>

      <section id="library" class="library-panel" aria-labelledby="library-title">
        <SectionHeader
          eyebrow="Saga library"
          title="Filter the archive"
          description="The same library can be filtered by realm, entry type, and discovery state."
        />
        <div class="filter-row" aria-label="Library filters">
          <label>
            Realm
            <select bind:value={selectedRealm}>
              <option value="all">All realms</option>
              {#each mythologyDataset.realms as realm}
                <option value={realm.id}>{realm.name}</option>
              {/each}
            </select>
          </label>
          <label>
            Type
            <select bind:value={selectedCategory}>
              <option value="all">All types</option>
              <option value="god">Gods</option>
              <option value="realm">Realms</option>
              <option value="creature">Creatures</option>
              <option value="artifact">Artifacts</option>
              <option value="myth">Myths</option>
              <option value="fragment">Fragments</option>
            </select>
          </label>
          <label>
            Status
            <select bind:value={selectedDiscovery}>
              <option value="all">All entries</option>
              <option value="discovered">Discovered</option>
              <option value="locked">Locked</option>
            </select>
          </label>
        </div>
        <EntryList entries={filteredLibrary} />
      </section>
    </section>

    <section class="section-block saga-panel">
      <SectionHeader
        eyebrow="Saga fragments"
        title="Compact myth entries"
        description="Short fragments make the page feel like a real discovery archive instead of a static landing screen."
      />
      <div class="saga-grid">
        {#each sagaEntries as entry}
          <article>
            <span>{entry.realmId}</span>
            <h3>{entry.title}</h3>
            <p>{entry.description}</p>
            <footer>
              <strong>Danger {entry.dangerLevel}</strong>
              <small>{entry.discovered ? 'Open' : 'Locked'}</small>
            </footer>
          </article>
        {/each}
      </div>
    </section>

    <section id="recommendations" class="recommendation-activity-grid">
      <div class="recommendation-panel">
        <SectionHeader
          eyebrow="Recommended paths"
          title="Next discoveries"
          description="Recommendations are filtered by discovered tags, rating thresholds, and current completion."
        />
        <div class="recommendation-list">
          {#each activeRecommendations as recommendation}
            <article>
              <span>{recommendation.type}</span>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.description}</p>
            </article>
          {/each}
        </div>
      </div>

      <div class="activity-panel">
        <SectionHeader
          eyebrow="Exploration activity"
          title="Archive movement"
          description="A compact activity feed replaces social noise with discovery-relevant events."
        />
        <div class="activity-list">
          {#each mythologyDataset.explorationActivity as item}
            <article>
              <span>{new Date(item.timestamp).toLocaleDateString('en-GB')}</span>
              <p><strong>{item.actor}</strong> {item.action}</p>
            </article>
          {/each}
        </div>
      </div>
    </section>

    <section class="credits-panel" aria-labelledby="credits-title">
      <SectionHeader
        eyebrow="Image credits"
        title="Replaceable public-source image metadata"
        description="Every visual entry points to credit metadata so remote URLs can be replaced without changing UI components."
      />
      <div class="credits-grid">
        {#each mythologyDataset.imageCredits as credit}
          <a href={credit.sourceUrl} target="_blank" rel="noreferrer">
            <strong>{credit.title}</strong>
            <span>{credit.author}</span>
            <small>{credit.sourceName}</small>
          </a>
        {/each}
      </div>
    </section>
  </main>
</div>

<style>
  .tree-panel {
    position: relative;
    overflow: hidden;
    min-height: 690px;
    padding: 1.5rem;
    border-radius: 2rem;
    border: 1px solid rgba(213, 175, 83, 0.18);
    background:
      radial-gradient(circle at top left, rgba(75, 128, 170, 0.16), transparent 35%),
      radial-gradient(circle at bottom, rgba(213, 175, 83, 0.08), transparent 28%),
      linear-gradient(180deg, rgba(8, 18, 31, 0.95), rgba(6, 14, 25, 0.98));
  }

  .tree-backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .tree-aura {
    position: absolute;
    inset: 6% 8%;
    border-radius: 1.8rem;
    background:
      radial-gradient(circle at center, rgba(106, 165, 212, 0.09), transparent 32%),
      radial-gradient(circle at center, rgba(213, 175, 83, 0.06), transparent 54%);
    border: 1px solid rgba(213, 175, 83, 0.08);
  }

  .tree-trunk {
    position: absolute;
    left: 50%;
    top: 22%;
    width: 14px;
    height: 40%;
    transform: translateX(-50%);
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(213, 175, 83, 0.18), rgba(89, 125, 150, 0.2));
    box-shadow: 0 0 22px rgba(213, 175, 83, 0.08);
  }

  .tree-canopy,
  .tree-root {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgba(213, 175, 83, 0.16);
    border-bottom: none;
    border-radius: 999px 999px 0 0;
  }

  .tree-canopy {
    top: 13%;
    height: 120px;
  }

  .canopy-1 {
    width: 310px;
  }

  .canopy-2 {
    width: 220px;
    top: 16%;
  }

  .canopy-3 {
    width: 130px;
    top: 19%;
  }

  .tree-root {
    bottom: 18%;
    height: 86px;
    border-top: none;
    border-bottom: 1px solid rgba(106, 165, 212, 0.16);
    border-radius: 0 0 999px 999px;
  }

  .root-1 {
    width: 250px;
  }

  .root-2 {
    width: 170px;
    bottom: 16%;
  }

  .root-3 {
    width: 95px;
    bottom: 14%;
  }

  .tree-sigil {
    position: absolute;
    left: 50%;
    top: 49%;
    transform: translate(-50%, -50%);
    font-size: 17rem;
    line-height: 1;
    color: rgba(213, 175, 83, 0.08);
    text-shadow: 0 0 28px rgba(213, 175, 83, 0.08);
  }

  .tree-core {
    position: absolute;
    left: 50%;
    top: 52%;
    transform: translate(-50%, -50%);
    display: grid;
    gap: 0.15rem;
    text-align: center;
    color: rgba(244, 238, 229, 0.82);
  }

  .tree-core strong {
    font-size: 1.1rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .tree-core span {
    font-size: 0.82rem;
    color: rgba(186, 198, 212, 0.8);
  }

  .world-node {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 92px;
    padding: 0.42rem 0.7rem;
    border-radius: 999px;
    background: rgba(10, 21, 35, 0.78);
    border: 1px solid rgba(213, 175, 83, 0.18);
    color: rgba(236, 228, 211, 0.92);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.22);
  }

  .node-1 { top: 10%; left: 50%; transform: translateX(-50%); }
  .node-2 { top: 18%; right: 15%; }
  .node-3 { top: 32%; right: 7%; }
  .node-4 { top: 52%; right: 9%; }
  .node-5 { bottom: 20%; right: 15%; }
  .node-6 { bottom: 10%; left: 50%; transform: translateX(-50%); }
  .node-7 { bottom: 20%; left: 15%; }
  .node-8 { top: 52%; left: 9%; }
  .node-9 { top: 18%; left: 15%; }

  .tree-content {
    position: relative;
    z-index: 2;
    display: grid;
    align-content: end;
    min-height: 660px;
    gap: 1rem;
  }

  .tree-content h2 {
    margin: 0;
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    line-height: 1.05;
  }

  .tree-content p {
    max-width: 34rem;
    margin: 0;
  }

  .tree-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    max-width: 34rem;
  }

  .tree-stats div {
    display: grid;
    gap: 0.2rem;
    padding: 0.9rem 1rem;
    border-radius: 1rem;
    background: rgba(9, 20, 33, 0.7);
    border: 1px solid rgba(213, 175, 83, 0.14);
    backdrop-filter: blur(6px);
  }

  .tree-stats strong {
    color: rgba(236, 197, 95, 0.98);
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tree-stats span {
    color: rgba(188, 198, 209, 0.88);
    font-size: 0.88rem;
  }

  .tree-note {
    max-width: 34rem;
    padding: 0.95rem 1rem;
    border-radius: 1rem;
    background: rgba(9, 20, 33, 0.72);
    border: 1px solid rgba(106, 165, 212, 0.16);
    color: rgba(214, 220, 228, 0.92);
  }

  @media (max-width: 1100px) {
    .tree-panel {
      min-height: auto;
    }

    .tree-content {
      min-height: 560px;
    }

    .world-node {
      min-width: 78px;
      font-size: 0.66rem;
    }
  }

  @media (max-width: 720px) {
    .tree-content {
      min-height: 580px;
      align-content: end;
    }

    .tree-stats {
      grid-template-columns: 1fr;
    }

    .world-node {
      min-width: 68px;
      padding: 0.35rem 0.5rem;
      font-size: 0.6rem;
    }

    .node-2 { right: 8%; }
    .node-3 { right: 2%; }
    .node-4 { right: 3%; }
    .node-5 { right: 8%; }
    .node-7 { left: 8%; }
    .node-8 { left: 3%; }
    .node-9 { left: 8%; }
  }
</style>