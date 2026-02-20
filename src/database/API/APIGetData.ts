import {radioFrance} from "../../config/ApiConnexion";
import {allBrands, Brand} from "../../interface/brandInterface";
import { ShowsQueryResponse } from "../../interface/showInterface";
import {StationsEnum} from "../../enums/stationsEnum";
import { storeBrandsInRedis } from "../Redis/dataStockage";

const getAllBrandQuery = `
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

export async function getBrandAPI() {
    try {
        const data = await radioFrance.query(getAllBrandQuery) as allBrands;
        const brands: Brand[] = (data && data.brands) ? data.brands : [];
        brands.sort((a, b) => a.title.localeCompare(b.title || ""));
        console.log('Brands (structured & sorted):');
        console.log(JSON.stringify(brands, null, 2));

        // Stocker les brands dans Redis
        try {
            await storeBrandsInRedis(brands);
        } catch (redisErr) {
            console.error('Erreur lors du stockage des brands dans Redis:', redisErr);
        }

        return brands;
    } catch (err) {
        console.error('Erreur lors de la récupération des brands:', err);
    }
}

export async function getAllShowsAPI(station : StationsEnum, first: number = 10) {
    const getAllShowsQuery = `
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
    try {
        const variables = { station, first };
        const data = await radioFrance.query<ShowsQueryResponse>(getAllShowsQuery, variables);
        console.log('Shows (typed):');
        console.log(JSON.stringify(data, null, 2));
        return data;
    }
    catch (err) {
        console.error('Erreur lors de la récupération des shows:', err);
    }
}
