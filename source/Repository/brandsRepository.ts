import { radioFrance } from "../Config/ApiConnexion";
import { BrandDto } from "../DTO/brandDTO";
import { RadioDto } from "../DTO/radioDTO";

interface BrandsQueryResponse {
    brands?: Array<{
        id: string;
        title: string;
        baseline?: string;
        description?: string;
        websiteUrl?: string;
        liveStream?: string;
        playerUrl?: string;
        webRadios?: RadioDto[];
        localRadios?: RadioDto[];
    }>;
}

const GET_ALL_BRANDS_QUERY = `
{
  brands {
    id
    title
    baseline
    description
    websiteUrl
    playerUrl
    liveStream
    localRadios {
      id
      title
      description
      liveStream
      playerUrl
    }
    webRadios {
      id
      title
      description
      liveStream
      playerUrl
    }
  }
}
`;

export interface IApiRepository {
    getBrands(): Promise<BrandDto[]>;
}

export class BrandsRepository implements IApiRepository {
    async getBrands(): Promise<BrandDto[]> {
        try {
            const data = await radioFrance.query<BrandsQueryResponse>(GET_ALL_BRANDS_QUERY);
            const brands = data?.brands ?? [];

            return brands
                .map((b) => ({
                    id: b.id,
                    title: b.title,
                    baseline: b.baseline,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    liveStream: b.liveStream,
                    playerUrl: b.playerUrl,
                    webRadios: b.webRadios ?? [],
                    localRadios: b.localRadios ?? []
                }))
                .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } catch (error) {
            console.error("[BrandsRepository] Failed to fetch brands:", error);
            throw error;
        }
    }
}