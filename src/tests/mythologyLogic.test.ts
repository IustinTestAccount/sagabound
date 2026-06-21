import { describe, expect, it } from 'vitest';
import { allEntries, mythologyDataset } from '../data/mythology';
import {
  calculateAverageMythRating,
  calculateCompletionPercentage,
  filterLibrary,
  filterRecommendations,
  getTopMythologyCategory,
  sortMyths
} from '../lib/mythologyLogic';

describe('mythology logic', () => {
  it('calculates the average myth rating with two decimal precision', () => {
    expect(calculateAverageMythRating(mythologyDataset.myths)).toBe(4.73);
    expect(calculateAverageMythRating([])).toBe(0);
  });

  it('selects a top mythology category using rating and discovery signals', () => {
    expect(getTopMythologyCategory(allEntries)).toBe('god');
    expect(getTopMythologyCategory([])).toBeNull();
  });

  it('filters library entries by realm, category, and discovery status', () => {
    const filtered = filterLibrary(allEntries, {
      realmId: 'asgard',
      category: 'artifact',
      discovered: true
    });

    expect(filtered.map((entry) => entry.id)).toEqual(['mjolnir']);
  });

  it('calculates completion percentage from discovered entries', () => {
    expect(calculateCompletionPercentage(allEntries)).toBe(62);
  });

  it('sorts myths by danger level and rating', () => {
    const byDanger = sortMyths(mythologyDataset.myths, 'dangerLevel');
    const byRating = sortMyths(mythologyDataset.myths, 'rating');

    expect(byDanger[0].id).toBe('ragnarok');
    expect(byRating[0].id).toBe('ragnarok');
  });

  it('filters recommendations using discovery tags, rating, and completion percentage', () => {
    const recommendations = filterRecommendations(
      mythologyDataset.recommendations,
      allEntries,
      mythologyDataset.userDiscoveries,
      calculateCompletionPercentage(allEntries)
    );

    expect(recommendations.map((recommendation) => recommendation.id)).toEqual([
      'rec-odin-runes',
      'rec-fenrir-binding',
      'rec-helheim-baldr'
    ]);
  });
});
