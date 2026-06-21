import type { LibraryFilters, MythologyCategory, MythologyEntry, Recommendation, SortMode, UserDiscovery } from '../data/types';

export function calculateAverageMythRating(entries: MythologyEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }

  const total = entries.reduce((sum, entry) => sum + entry.rating, 0);
  return Math.round((total * 100) / entries.length + 1e-9) / 100;
}

export function getTopMythologyCategory(entries: MythologyEntry[]): MythologyCategory | null {
  if (entries.length === 0) {
    return null;
  }

  const scores = new Map<MythologyCategory, number>();

  entries.forEach((entry) => {
    const existing = scores.get(entry.category) ?? 0;
    const discoveryBonus = entry.discovered ? 2 : 0;
    scores.set(entry.category, existing + entry.rating + discoveryBonus);
  });

  return [...scores.entries()].sort((first, second) => second[1] - first[1])[0][0];
}

export function filterLibrary(entries: MythologyEntry[], filters: LibraryFilters): MythologyEntry[] {
  return entries.filter((entry) => {
    const matchesRealm = !filters.realmId || filters.realmId === 'all' || entry.realmId === filters.realmId;
    const matchesCategory = !filters.category || filters.category === 'all' || entry.category === filters.category;
    const matchesDiscovery = filters.discovered === undefined || filters.discovered === 'all' || entry.discovered === filters.discovered;

    return matchesRealm && matchesCategory && matchesDiscovery;
  });
}

export function calculateCompletionPercentage(entries: MythologyEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }

  const discovered = entries.filter((entry) => entry.discovered).length;
  return Math.round((discovered / entries.length) * 100);
}

export function sortMyths(entries: MythologyEntry[], sortMode: SortMode): MythologyEntry[] {
  const copy = [...entries];

  if (sortMode === 'rating') {
    return copy.sort((first, second) => second.rating - first.rating || first.title.localeCompare(second.title));
  }

  if (sortMode === 'dangerLevel') {
    return copy.sort((first, second) => second.dangerLevel - first.dangerLevel || first.title.localeCompare(second.title));
  }

  return copy.sort((first, second) => first.title.localeCompare(second.title));
}

export function filterRecommendations(
  recommendations: Recommendation[],
  entries: MythologyEntry[],
  discoveries: UserDiscovery[],
  completionPercentage: number
): Recommendation[] {
  const discoveredEntryIds = new Set(discoveries.map((discovery) => discovery.entryId));
  const discoveredEntries = entries.filter((entry) => discoveredEntryIds.has(entry.id) || entry.discovered);
  const discoveredTags = new Set(discoveredEntries.flatMap((entry) => entry.tags));
  const entryMap = new Map(entries.map((entry) => [entry.id, entry]));

  return recommendations.filter((recommendation) => {
    const targetEntry = entryMap.get(recommendation.targetEntryId);

    if (!targetEntry) {
      return false;
    }

    const hasRequiredSignal = recommendation.requiredTags.some((tag) => discoveredTags.has(tag));
    const hasRatingSignal = targetEntry.rating >= recommendation.minRating;
    const hasProgressSignal = completionPercentage >= recommendation.minCompletion;

    return hasRequiredSignal && hasRatingSignal && hasProgressSignal;
  });
}

export function getEntryById(entries: MythologyEntry[], id: string): MythologyEntry | undefined {
  return entries.find((entry) => entry.id === id);
}

export function countEntriesByCategory(entries: MythologyEntry[]): Record<MythologyCategory, number> {
  const initial: Record<MythologyCategory, number> = {
    god: 0,
    realm: 0,
    creature: 0,
    artifact: 0,
    myth: 0,
    fragment: 0
  };

  return entries.reduce((counts, entry) => {
    counts[entry.category] += 1;
    return counts;
  }, initial);
}
