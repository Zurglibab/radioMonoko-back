import { radioFrance } from "../config/ApiConnexion";
import { BrandDto } from "../DTO/brandDTO";
import { BrandApiModel } from "../entities/brandApiModel";
import { toSortedBrandDtos } from "../mappers/brandMapper";

interface BrandsQueryResponse {
  brands?: BrandApiModel[];
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

      return toSortedBrandDtos(brands);
    } catch (error) {
      console.error("[BrandsRepository] Failed to fetch brands:", error);
      throw error;
    }
  }
}