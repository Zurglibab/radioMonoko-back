export interface ShowApiPersonalityNode {
  id?: string;
  name?: string;
}

export interface ShowApiDiffusionNode {
  id?: string;
  title?: string;
  url?: string;
  published_date?: string;
  podcastEpisode?: {
    id?: string;
    title?: string;
    url?: string;
    playerUrl?: string;
  };
  personalitiesConnection?: {
    edges?: Array<{
      relation?: string;
      info?: string;
      node?: ShowApiPersonalityNode;
    }>;
  };
}

export interface ShowApiTaxonomyNode {
  id?: string;
  path?: string;
  type?: string;
  title?: string;
  standFirst?: string;
}

export interface ShowApiNode {
  id?: string;
  title?: string;
  url?: string;
  standFirst?: string;
  diffusionsConnection?: {
    edges?: Array<{
      node?: ShowApiDiffusionNode;
    }>;
  };
  taxonomiesConnection?: {
    edges?: Array<{
      node?: ShowApiTaxonomyNode;
    }>;
  };
}

export interface ShowsQueryResponse {
  shows?: {
    edges?: Array<{
      node?: ShowApiNode;
    }>;
  };
}