export interface PersonalityNode {
  id: string;
  name: string;
}

export interface PersonalityEdge {
  relation: string;
  info: string;
  node: PersonalityNode;
}

export interface PersonalitiesConnection {
  edges: PersonalityEdge[];
}

export interface DiffusionNode {
  title: string;
  url: string;
  personalitiesConnection: PersonalitiesConnection;
}

export interface DiffusionEdge {
  node: DiffusionNode;
}

export interface DiffusionsConnection {
  edges: DiffusionEdge[];
}

export interface TaxonomyNode {
  id: string;
  path: string;
  type: string;
  title: string;
  standFirst: string;
}

export interface TaxonomyEdge {
  relation: string;
  info: string;
  node: TaxonomyNode;
}

export interface TaxonomiesConnection {
  edges: TaxonomyEdge[];
}

export interface ShowNode {
  id: string;
  title: string;
  diffusionsConnection: DiffusionsConnection;
  taxonomiesConnection: TaxonomiesConnection;
}

export interface ShowEdge {
  cursor: string;
  node: ShowNode;
}

export interface ShowsConnection {
  edges: ShowEdge[];
}

export interface ShowsQueryResponse {
  shows: ShowsConnection;
}