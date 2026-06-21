export type MythologyCategory = 'god' | 'realm' | 'creature' | 'artifact' | 'myth' | 'fragment';

export type DiscoveryStatus = 'new' | 'saved' | 'studied';

export type SortMode = 'rating' | 'dangerLevel' | 'name';

export interface ImageMetadata {
  url: string;
  alt: string;
  creditId: string;
}

export interface ImageCredit {
  id: string;
  title: string;
  author: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
}

export interface MythologyEntry {
  id: string;
  name?: string;
  title: string;
  category: MythologyCategory;
  type: string;
  realmId: string;
  description: string;
  rating: number;
  dangerLevel: number;
  discovered: boolean;
  tags: string[];
  image: ImageMetadata;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'recommendation';
  type: string;
  description: string;
  targetEntryId: string;
  requiredTags: string[];
  minRating: number;
  minCompletion: number;
}

export interface UserDiscovery {
  id: string;
  entryId: string;
  status: DiscoveryStatus;
  notes: string;
  lastOpened: string;
}

export interface ExplorationActivity {
  id: string;
  actor: string;
  action: string;
  entryId: string;
  timestamp: string;
}

export interface MythologyDataset {
  imageCredits: ImageCredit[];
  gods: MythologyEntry[];
  realms: MythologyEntry[];
  creatures: MythologyEntry[];
  artifacts: MythologyEntry[];
  myths: MythologyEntry[];
  sagaFragments: MythologyEntry[];
  recommendations: Recommendation[];
  userDiscoveries: UserDiscovery[];
  explorationActivity: ExplorationActivity[];
}

export interface LibraryFilters {
  realmId?: string;
  category?: MythologyCategory | 'all';
  discovered?: boolean | 'all';
}
