export interface ShowApiPersonalityNode {
  id?: string;
  name?: string;
}

export interface ShowApiDiffusionNode {
  title?: string;
  url?: string;
  personalitiesConnection?: {
    edges?: Array<{
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