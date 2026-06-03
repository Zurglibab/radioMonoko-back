export const CONTENT_STATUS_VALUES = ['abandonné', 'à voir', 'en cours', 'commencer', 'fini'] as const;

export type ContentStatus = (typeof CONTENT_STATUS_VALUES)[number];

export const DEFAULT_CONTENT_STATUS: ContentStatus = 'à voir';

export const isContentStatus = (value: string): value is ContentStatus =>
  (CONTENT_STATUS_VALUES as readonly string[]).includes(value);

