import { radioFrance } from "../config/ApiConnexion";
import { StationsEnum } from "../enums/stationsEnum";
import { LiveDto } from "../DTO/liveDTO";
import { toLiveDto } from "../mappers/liveMapper";
import { LiveQueryResponse } from "../entities/liveApiModel";

const GET_LIVE_QUERY = `
query GetLive($station: StationsEnum!) {
  live(station: $station) {
    show {
      __typename
      id
      ... on DiffusionStep {
        diffusion {
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
            created
            duration
          }
        }
      }
      ... on BlankStep {
        title
      }
    }
    program {
      __typename
      id
      ... on DiffusionStep {
        diffusion {
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
            created
            duration
          }
        }
      }
      ... on BlankStep {
        title
      }
    }
    song {
      id
      start
      end
      track {
        id
        title
        albumTitle
        discNumber
        trackNumber
      }
    }
  }
}
`;

interface LiveQueryResult {
  live?: any;
}

export class LiveRepository {
  async fetchLiveByStation(station: StationsEnum): Promise<LiveDto> {
    try {
      const response = await radioFrance.query<LiveQueryResponse>(GET_LIVE_QUERY, { station });
      return toLiveDto(response?.live ?? null);
    } catch (error) {
      console.error("[LiveRepository] Failed to fetch live:", error);
      throw error;
    }
  }
}

export const liveRepository = new LiveRepository();