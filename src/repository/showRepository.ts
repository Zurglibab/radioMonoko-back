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
            diffusionsConnection {
              edges {
                node {
                  title
                  url
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

export class ShowRepository {
    async fetchShowsByStation(station: StationsEnum, first: number = 10): Promise<ShowDto[]> {
        try {
            const variables = { station, first };
            const data = await radioFrance.query<ShowsQueryResponse>(
                GET_SHOWS_QUERY,
                variables as any
            );

            const edges = data?.shows?.edges ?? [];
            return edges
                .map((edge) => edge?.node)
                .filter((node) => !!node)
                .map((node) => toShowDto(node!));
        } catch (error) {
            console.error("[ShowRepository] Failed to fetch shows:", error);
            throw error;
        }
    }
}
