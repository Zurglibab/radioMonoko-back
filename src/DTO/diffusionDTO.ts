export interface DiffusionTaxonomyDto {
  id: string;
  path: string;
  title: string;
}

export interface DiffusionDto {
  id: string;
  title: string;
  standFirst?: string;
  url?: string;
  publishedDate?: string;
  taxonomies: DiffusionTaxonomyDto[];
}

export function toDiffusionDto(raw: any): DiffusionDto {
  const taxonomyEdges = raw?.taxonomiesConnection?.edges ?? [];

  return {
    id: raw?.id ?? "",
    title: raw?.title ?? "",
    standFirst: raw?.standFirst ?? undefined,
    url: raw?.url ?? undefined,
    publishedDate: raw?.published_date ?? undefined,
    taxonomies: taxonomyEdges.
    map((edge: any) => edge?.node).
    filter((node: any) => !!node).
    map((node: any) => ({
      id: node?.id ?? "",
      path: node?.path ?? "",
      title: node?.title ?? ""
    }))
  };
}