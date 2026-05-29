export interface DiffusionApiTaxonomyNode {
  id?: string;
  path?: string;
  title?: string;
}

export interface DiffusionApiPodcastEpisode {
  id?: string;
  title?: string;
  url?: string;
  playerUrl?: string;
}

export interface DiffusionApiNode {
  id?: string;
  title?: string;
  standFirst?: string;
  url?: string;
  published_date?: string;
  podcastEpisode?: DiffusionApiPodcastEpisode;
  taxonomiesConnection?: {
    edges?: Array<{
      node?: DiffusionApiTaxonomyNode;
    }>;
  };
}

export interface DiffusionsQueryResponse {
  diffusions?: {
    edges?: Array<{
      node?: DiffusionApiNode;
    }>;
  };
}

export interface DiffusionsOfShowByUrlQueryResponse {
  diffusionsOfShowByUrl?: {
    edges?: Array<{
      cursor?: string;
      node?: DiffusionApiNode;
    }>;
  };
}
