import {
    DiffusionDto,
    PersonalityDto,
    ShowDto,
    TaxonomyDto
} from "../DTO/showDTO";
import { ShowApiNode } from "../entities/showApiModel";

const toPersonalityDto = (raw?: { id?: string; name?: string }): PersonalityDto => ({
    id: raw?.id ?? "",
    name: raw?.name ?? ""
});

const toDiffusionDto = (raw?: {
    title?: string;
    url?: string;
    personalitiesConnection?: { edges?: Array<{ node?: { id?: string; name?: string } }> };
}): DiffusionDto => ({
    title: raw?.title ?? "",
    url: raw?.url ?? "",
    personalities: (raw?.personalitiesConnection?.edges ?? []).map((edge) =>
        toPersonalityDto(edge?.node)
    )
});

const toTaxonomyDto = (raw?: {
    id?: string;
    path?: string;
    type?: string;
    title?: string;
    standFirst?: string;
}): TaxonomyDto => ({
    id: raw?.id ?? "",
    path: raw?.path ?? "",
    type: raw?.type ?? "",
    title: raw?.title ?? "",
    standFirst: raw?.standFirst ?? ""
});

export const toShowDto = (showNode: ShowApiNode): ShowDto => ({
    id: showNode.id ?? "",
    title: showNode.title ?? "",
    diffusions: (showNode.diffusionsConnection?.edges ?? []).map((edge) =>
        toDiffusionDto(edge?.node)
    ),
    taxonomies: (showNode.taxonomiesConnection?.edges ?? []).map((edge) =>
        toTaxonomyDto(edge?.node)
    )
});

