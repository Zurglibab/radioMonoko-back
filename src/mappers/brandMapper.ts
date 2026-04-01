import { BrandDto } from "../DTO/brandDTO";
import { BrandApiModel } from "../entities/brandApiModel";

export const toBrandDto = (brand: BrandApiModel): BrandDto => ({
    id: brand.id,
    title: brand.title,
    baseline: brand.baseline,
    description: brand.description,
    websiteUrl: brand.websiteUrl,
    liveStream: brand.liveStream,
    playerUrl: brand.playerUrl,
    webRadios: brand.webRadios ?? [],
    localRadios: brand.localRadios ?? []
});

export const toSortedBrandDtos = (brands: BrandApiModel[]): BrandDto[] =>
    brands
        .map(toBrandDto)
        .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
