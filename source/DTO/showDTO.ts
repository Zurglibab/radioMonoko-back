export interface PersonalityDto {
    id: string;
    name: string;
}

export interface DiffusionDto {
    title: string;
    url: string;
    personalities: PersonalityDto[];
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
    diffusions: DiffusionDto[];
    taxonomies: TaxonomyDto[];
}

export function toShowDto(showNode: any): ShowDto {
    return {
        id: showNode.id,
        title: showNode.title,
        diffusions: (showNode.diffusionsConnection?.edges ?? []).map((edge: any) => ({
            title: edge.node?.title ?? "",
            url: edge.node?.url ?? "",
            personalities: (edge.node?.personalitiesConnection?.edges ?? []).map(
                (pEdge: any) => ({
                    id: pEdge.node?.id ?? "",
                    name: pEdge.node?.name ?? ""
                })
            )
        })),
        taxonomies: (showNode.taxonomiesConnection?.edges ?? []).map((edge: any) => ({
            id: edge.node?.id ?? "",
            path: edge.node?.path ?? "",
            type: edge.node?.type ?? "",
            title: edge.node?.title ?? "",
            standFirst: edge.node?.standFirst ?? ""
        }))
    };
}

