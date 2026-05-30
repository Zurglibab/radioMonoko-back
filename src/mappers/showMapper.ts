import {
  DiffusionDto,
  PersonalityDto,
  ShowDto,
  TaxonomyDto } from
"../DTO/showDTO";
import { ShowApiNode } from "../entities/showApiModel";

const toPersonalityDto = (raw?: {id?: string;name?: string;}): PersonalityDto => ({
  id: raw?.id ?? "",
  name: raw?.name ?? ""
});

const toDiffusionDto = (raw?: any): DiffusionDto => ({
  id: raw?.id ?? undefined,
  title: raw?.title ?? "",
  url: raw?.url ?? "",
  publishedDate: raw?.published_date ?? raw?.publishedDate ?? undefined,
  podcastEpisode: raw?.podcastEpisode ? {
    id: raw?.podcastEpisode?.id ?? undefined,
    title: raw?.podcastEpisode?.title ?? undefined,
    url: raw?.podcastEpisode?.url ?? undefined,
    playerUrl: raw?.podcastEpisode?.playerUrl ?? undefined
  } : null,
  personalities: (raw?.personalitiesConnection?.edges ?? []).map((pEdge: any) => ({
    relation: pEdge?.relation ?? null,
    info: pEdge?.info ?? null,
    node: toPersonalityDto(pEdge?.node)
  }))
});

const toTaxonomyDto = (raw?: any): TaxonomyDto => ({
  id: raw?.id ?? "",
  path: raw?.path ?? "",
  type: raw?.type ?? "",
  title: raw?.title ?? "",
  standFirst: raw?.standFirst ?? ""
});

export const toShowDto = (showNode: ShowApiNode): ShowDto => ({
  id: showNode.id ?? "",
  title: showNode.title ?? "",
  url: (showNode as any).url ?? undefined,
  standFirst: (showNode as any).standFirst ?? undefined,
  diffusions: (showNode.diffusionsConnection?.edges ?? []).map((edge: any) =>
    toDiffusionDto(edge?.node)
  ),
  taxonomies: (showNode.taxonomiesConnection?.edges ?? []).map((edge: any) => ({
    relation: edge?.relation ?? null,
    info: edge?.info ?? null,
    node: toTaxonomyDto(edge?.node)
  }))
});