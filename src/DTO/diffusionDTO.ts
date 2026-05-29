export interface DiffusionTaxonomyDto {
  id: string;
  path: string;
  title: string;
}

export interface PodcastEpisodeDto {
  id: string;
  title: string;
  url?: string;
  playerUrl?: string;
}

export interface DiffusionDto {
  id: string;
  title: string;
  standFirst?: string;
  url?: string;
  publishedDate?: string;
  podcastEpisode?: PodcastEpisodeDto;
  taxonomies: DiffusionTaxonomyDto[];
}
