import { ShowDto, toShowDto } from "../DTO/showDTO";
import { radioFrance } from "../Config/ApiConnexion";
import { StationsEnum } from "../Enums/stationsEnum";

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
            const data = await radioFrance.query<{ shows?: { edges: any[] } }>(
                GET_SHOWS_QUERY,
                variables as any
            );

            const edges = data?.shows?.edges ?? [];
            return edges
                .map((edge: any) => edge.node)
                .filter((node: any) => !!node)
                .map(toShowDto);
        } catch (error) {
            console.error("[ShowRepository] Failed to fetch shows:", error);
            throw error;
        }
    }
}

