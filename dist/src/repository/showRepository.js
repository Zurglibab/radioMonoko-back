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
exports.ShowRepository = void 0;
const ApiConnexion_1 = require("../Config/ApiConnexion");
const showMapper_1 = require("../Mappers/showMapper");
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
class ShowRepository {
    fetchShowsByStation(station_1) {
        return __awaiter(this, arguments, void 0, function* (station, first = 10) {
            var _a, _b;
            try {
                const variables = { station, first };
                const data = yield ApiConnexion_1.radioFrance.query(GET_SHOWS_QUERY, variables);
                const edges = (_b = (_a = data === null || data === void 0 ? void 0 : data.shows) === null || _a === void 0 ? void 0 : _a.edges) !== null && _b !== void 0 ? _b : [];
                return edges
                    .map((edge) => edge === null || edge === void 0 ? void 0 : edge.node)
                    .filter((node) => !!node)
                    .map((node) => (0, showMapper_1.toShowDto)(node));
            }
            catch (error) {
                console.error("[ShowRepository] Failed to fetch shows:", error);
                throw error;
            }
        });
    }
}
exports.ShowRepository = ShowRepository;
//# sourceMappingURL=showRepository.js.map