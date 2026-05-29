import { DiffusionDto } from "../DTO/diffusionDTO";
import { DiffusionApiNode } from "../entities/diffusionApiModel";

export const toDiffusionDto = (raw: DiffusionApiNode): DiffusionDto => {
  const taxonomyEdges = raw?.taxonomiesConnection?.edges ?? [];

  return {
    id: raw?.id ?? "",
    title: raw?.title ?? "",
    standFirst: raw?.standFirst ?? undefined,
    url: raw?.url ?? undefined,
    publishedDate: raw?.published_date ?? undefined,
    podcastEpisode: raw?.podcastEpisode ? {
      id: raw.podcastEpisode?.id ?? "",
      title: raw.podcastEpisode?.title ?? "",
      url: raw.podcastEpisode?.url ?? undefined,
      playerUrl: raw.podcastEpisode?.playerUrl ?? undefined
    } : undefined,
    taxonomies: taxonomyEdges.
    map((edge) => edge?.node).
    filter((node) => !!node).
    map((node) => ({
      id: node?.id ?? "",
      path: node?.path ?? "",
      title: node?.title ?? ""
    }))
  };
};