export interface PersonalityDto {
  id: string;
  name: string;
}

export interface DiffusionDto {
  id?: string;
  title: string;
  url: string;
  publishedDate?: string;
  podcastEpisode?: {
    id?: string;
    title?: string;
    url?: string;
    playerUrl?: string;
  } | null;
  personalities: Array<{
    relation?: string | null;
    info?: string | null;
    node: PersonalityDto;
  }>;
}

export interface TaxonomyDto {
  id: string;
  path: string;
  type: string;
  title: string;
  standFirst: string;
}

export interface ShowDto {
  id: string;
  title: string;
  url?: string;
  standFirst?: string;
  diffusions: DiffusionDto[];
  taxonomies: Array<{
    relation?: string | null;
    info?: string | null;
    node: TaxonomyDto;
  }>;
}

export function toShowDto(showNode: any): ShowDto {
  return {
    id: showNode.id,
    title: showNode.title,
    url: showNode.url ?? undefined,
    standFirst: showNode.standFirst ?? undefined,
    diffusions: (showNode.diffusionsConnection?.edges ?? []).map((edge: any) => ({
      id: edge.node?.id ?? undefined,
      title: edge.node?.title ?? "",
      url: edge.node?.url ?? "",
      publishedDate: edge.node?.published_date ?? edge.node?.publishedDate ?? undefined,
      podcastEpisode: edge.node?.podcastEpisode ? {
        id: edge.node?.podcastEpisode?.id ?? undefined,
        title: edge.node?.podcastEpisode?.title ?? undefined,
        url: edge.node?.podcastEpisode?.url ?? undefined,
        playerUrl: edge.node?.podcastEpisode?.playerUrl ?? undefined
      } : null,
      personalities: (edge.node?.personalitiesConnection?.edges ?? []).map(
        (pEdge: any) => ({
          relation: pEdge?.relation ?? null,
          info: pEdge?.info ?? null,
          node: {
            id: pEdge.node?.id ?? "",
            name: pEdge.node?.name ?? ""
          }
        })
      )
    })),
    taxonomies: (showNode.taxonomiesConnection?.edges ?? []).map((edge: any) => ({
      relation: edge?.relation ?? null,
      info: edge?.info ?? null,
      node: {
        id: edge.node?.id ?? "",
        path: edge.node?.path ?? "",
        type: edge.node?.type ?? "",
        title: edge.node?.title ?? "",
        standFirst: edge.node?.standFirst ?? ""
      }
    }))
  };
}