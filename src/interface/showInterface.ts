// Interfaces pour la requête shows { ... } fournie

export interface ShowsQueryResponse {
  shows: ShowsConnection;
}

export interface ShowsConnection {
  edges: ShowEdge[];
}

export interface ShowEdge {
  cursor: string;
  node: ShowNode | null;
}

export interface ShowNode {
  id: string;
  title: string;
  diffusionsConnection?: DiffusionsConnection | null;
  taxonomiesConnection?: TaxonomiesConnection | null;
}

/* Diffusions */
export interface DiffusionsConnection {
  edges: DiffusionEdge[];
}

export interface DiffusionEdge {
  node: DiffusionNode | null;
}

export interface DiffusionNode {
  title: string;
  url?: string | null;
  personalitiesConnection?: PersonalitiesConnection | null;
}

/* Personalities */
export interface PersonalitiesConnection {
  edges: PersonalityEdge[];
}

export interface PersonalityEdge {
  relation?: string | null;
  info?: string | null;
  node: PersonalityNode | null;
}

export interface PersonalityNode {
  id: string;
  name: string;
}

/* Taxonomies */
export interface TaxonomiesConnection {
  edges: TaxonomyEdge[];
}

export interface TaxonomyEdge {
  relation?: string | null;
  info?: string | null;
  node: TaxonomyNode | null;
}

export interface TaxonomyNode {
  id: string;
  path?: string | null;
  type?: string | null;
  title?: string | null;
  standFirst?: string | null;
}

