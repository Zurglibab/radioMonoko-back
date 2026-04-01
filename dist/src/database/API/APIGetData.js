"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandAPI = getBrandAPI;
exports.getAllShowsAPI = getAllShowsAPI;
const ApiConnexion_1 = require("../../config/ApiConnexion");
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
function getBrandAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield ApiConnexion_1.radioFrance.query(getAllBrandQuery);
            const brands = (data && data.brands) ? data.brands : [];
            brands.sort((a, b) => a.title.localeCompare(b.title || ""));
            console.log('Brands (structured & sorted):');
            console.log(JSON.stringify(brands, null, 2));
            return brands;
        }
        catch (err) {
            console.error('Erreur lors de la récupération des brands:', err);
        }
    });
}
function getAllShowsAPI(station_1) {
    return __awaiter(this, arguments, void 0, function* (station, first = 10) {
        const getAllShowsQuery = `
    query GetShows($station: String!, $first: Int) {
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
            const data = yield ApiConnexion_1.radioFrance.query(getAllShowsQuery, variables);
            console.log('Shows (typed):');
            console.log(JSON.stringify(data, null, 2));
            return data;
        }
        catch (err) {
            console.error('Erreur lors de la récupération des shows:', err);
        }
    });
}
//# sourceMappingURL=APIGetData.js.map