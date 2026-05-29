import { radioFrance } from "../config/ApiConnexion";
import { StationsEnum } from "../enums/stationsEnum";
import { DiffusionDto } from "../DTO/diffusionDTO";
import { toDiffusionDto } from "../mappers/diffusionMapper";
import { DiffusionApiNode, DiffusionsOfShowByUrlQueryResponse, DiffusionsQueryResponse } from "../entities/diffusionApiModel";

const GET_DIFFUSIONS_QUERY = `
query GetDiffusions($station: StationsEnum!, $themes: [String!], $first: Int) {
  diffusions(station: $station, themes: $themes, first: $first) {
    edges {
      cursor
      node {
        id
        title
        standFirst
        url
        published_date
        taxonomiesConnection {
          edges {
            node {
              id
              path
              title
            }
          }
        }
      }
    }
  }
}
`;

const GET_DIFFUSIONS_OF_SHOW_BY_URL_QUERY = `
query GetDiffusionsOfShowByUrl($url: String!, $first: Int) {
  diffusionsOfShowByUrl(url: $url, first: $first) {
    edges {
      cursor
      node {
        id
        title
        standFirst
        url
        published_date
        podcastEpisode {
          id
          title
          url
          playerUrl
        }
        taxonomiesConnection {
          edges {
            node {
              id
              path
              title
            }
          }
        }
      }
    }
  }
}
`;


export class DiffusionRepository {
  async fetchDiffusionsByStation(
  station: StationsEnum,
  themes?: string[],
  first: number = 20)
  : Promise<DiffusionDto[]> {
    try {
      const variables: Record<string, unknown> = { station };

      if (Array.isArray(themes) && themes.length > 0) {
        const cleanedThemes = themes.map((t) => t.trim()).filter(Boolean);
        if (cleanedThemes.length > 0) {
          variables.themes = cleanedThemes;
        }
      }

      if (Number.isFinite(first) && first > 0) {
        variables.first = Math.floor(first);
      }

      const response = await radioFrance.query<any>(
        GET_DIFFUSIONS_QUERY,
        variables
      );


      const root = response?.diffusions ? response : response?.data;
      const typedRoot = root as DiffusionsQueryResponse | undefined;
      const edges = typedRoot?.diffusions?.edges ?? [];

      return edges.
      map((edge) => edge?.node).
      filter((node): node is DiffusionApiNode => !!node).
      map(toDiffusionDto);
    } catch (error) {
      console.error("[DiffusionRepository] Failed to fetch diffusions:", error);
      throw error;
    }
  }

  async fetchDiffusionsOfShowByUrl(url: string, first: number = 10): Promise<DiffusionDto[]> {
    try {
      const variables: Record<string, unknown> = { url };

      if (Number.isFinite(first) && first > 0) {
        variables.first = Math.floor(first);
      }

      const response = await radioFrance.query<DiffusionsOfShowByUrlQueryResponse>(
        GET_DIFFUSIONS_OF_SHOW_BY_URL_QUERY,
        variables
      );

      const edges = response?.diffusionsOfShowByUrl?.edges ?? [];

      return edges.
      map((edge) => edge?.node).
      filter((node): node is DiffusionApiNode => !!node).
      map(toDiffusionDto);
    } catch (error) {
      console.error("[DiffusionRepository] Failed to fetch diffusions of show by url:", error);
      throw error;
    }
  }
}

export const diffusionRepository = new DiffusionRepository();