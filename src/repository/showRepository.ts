import { ShowDto } from "../DTO/showDTO";
import { radioFrance } from "../config/ApiConnexion";
import { StationsEnum } from "../enums/stationsEnum";
import { toShowDto } from "../mappers/showMapper";
import { ShowsQueryResponse } from "../entities/showApiModel";

const GET_SHOWS_QUERY = `
    query GetShows($station: StationsEnum!, $first: Int) {
      shows(station: $station, first: $first) {
        edges {
          cursor
          node {
            id
            title
            url
            standFirst
            diffusionsConnection {
              edges {
                node {
                  id
                  title
                  url
                  published_date
                  podcastEpisode {
                    id
                    title
                    url
                    playerUrl
                  }
                  personalitiesConnection {
                    edges {
                      relation
                      info
                      node {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
            taxonomiesConnection {
              edges {
                relation
                info
                node {
                  id
                  path
                  type
                  title
                  standFirst
                }
              }
            }
          }
        }
      }
    }
`;

const GET_SHOW_BY_URL_QUERY = `
  query GetShowByUrl($url: String!) {
    showByUrl(url: $url) {
      id
      title
      url
      standFirst
      diffusionsConnection {
        edges {
          node {
            id
            title
            url
            published_date
            podcastEpisode {
              id
              title
              url
              playerUrl
            }
            personalitiesConnection {
              edges {
                relation
                info
                node {
                  id
                  name
                }
              }
            }
            taxonomiesConnection {
              edges {
                relation
                info
                node {
                  id
                  path
                  type
                  title
                  standFirst
                }
              }
            }
          }
        }
      }
      taxonomiesConnection {
        edges {
          relation
          info
          node {
            id
            path
            type
            title
            standFirst
          }
        }
      }
    }
  }
`;

export class ShowRepository {
  async fetchShowByUrl(url: string): Promise<ShowDto | null> {
    try {
      const variables = { url };
      const data = await radioFrance.query<any>(GET_SHOW_BY_URL_QUERY, variables as any);
      const node = data?.showByUrl ?? null;
      if (!node) return null;
      return toShowDto(node);
    } catch (error) {
      console.error("[ShowRepository] Failed to fetch show by url:", error);
      throw error;
    }
  }

  async fetchShowsByStation(station: StationsEnum, first: number = 10): Promise<ShowDto[]> {
    try {
      const variables = { station, first };
      const data = await radioFrance.query<ShowsQueryResponse>(
        GET_SHOWS_QUERY,
        variables as any
      );

      const edges = data?.shows?.edges ?? [];
      return edges.
      map((edge) => edge?.node).
      filter((node) => !!node).
      map((node) => toShowDto(node!));
    } catch (error) {
      console.error("[ShowRepository] Failed to fetch shows:", error);
      throw error;
    }
  }
}