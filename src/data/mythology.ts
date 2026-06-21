import rawDataset from './mythology.json';
import type { MythologyDataset, MythologyEntry } from './types';

export const mythologyDataset = rawDataset as MythologyDataset;

export const allEntries: MythologyEntry[] = [
  ...mythologyDataset.gods,
  ...mythologyDataset.realms,
  ...mythologyDataset.creatures,
  ...mythologyDataset.artifacts,
  ...mythologyDataset.myths,
  ...mythologyDataset.sagaFragments
];

export const homepageGodIds = ['odin', 'thor', 'loki', 'freyja'];
export const homepageRealmIds = ['asgard', 'midgard', 'jotunheim', 'helheim'];

export const homepageGods = mythologyDataset.gods.filter((entry) => homepageGodIds.includes(entry.id));
export const homepageRealms = mythologyDataset.realms.filter((entry) => homepageRealmIds.includes(entry.id));
