import { RadioDto } from "./radioDTO";

export interface BrandDto {
    id: string;
    title: string;
    baseline?: string;
    description?: string;
    websiteUrl?: string;
    liveStream?: string;
    playerUrl?: string;
    webRadios: RadioDto[];
    localRadios: RadioDto[];
}