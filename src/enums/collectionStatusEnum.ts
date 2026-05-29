export const COLLECTION_STATUS_VALUES = ['à voir', 'en cours', 'terminé', 'abandonné'] as const;

export type CollectionStatus = (typeof COLLECTION_STATUS_VALUES)[number];

export const DEFAULT_COLLECTION_STATUS: CollectionStatus = 'à voir';

export const isCollectionStatus = (value: string): value is CollectionStatus =>
  (COLLECTION_STATUS_VALUES as readonly string[]).includes(value);

