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
exports.diffusionRepository = exports.DiffusionRepository = void 0;
const ApiConnexion_1 = require("../Config/ApiConnexion");
const diffusionDTO_1 = require("../DTO/diffusionDTO");
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
class DiffusionRepository {
    fetchDiffusionsByStation(station_1, themes_1) {
        return __awaiter(this, arguments, void 0, function* (station, themes, first = 20) {
            var _a, _b;
            try {
                const variables = { station };
                if (Array.isArray(themes) && themes.length > 0) {
                    const cleanedThemes = themes.map((t) => t.trim()).filter(Boolean);
                    if (cleanedThemes.length > 0) {
                        variables.themes = cleanedThemes;
                    }
                }
                if (Number.isFinite(first) && first > 0) {
                    variables.first = Math.floor(first);
                }
                const response = yield ApiConnexion_1.radioFrance.query(GET_DIFFUSIONS_QUERY, variables);
                // Compat: certains appels renvoient { diffusions }, d'autres { data: { diffusions } }
                const root = (response === null || response === void 0 ? void 0 : response.diffusions) ? response : response === null || response === void 0 ? void 0 : response.data;
                const edges = (_b = (_a = root === null || root === void 0 ? void 0 : root.diffusions) === null || _a === void 0 ? void 0 : _a.edges) !== null && _b !== void 0 ? _b : [];
                return edges
                    .map((edge) => edge === null || edge === void 0 ? void 0 : edge.node)
                    .filter((node) => !!node)
                    .map(diffusionDTO_1.toDiffusionDto);
            }
            catch (error) {
                console.error("[DiffusionRepository] Failed to fetch diffusions:", error);
                throw error;
            }
        });
    }
}
exports.DiffusionRepository = DiffusionRepository;
exports.diffusionRepository = new DiffusionRepository();
//# sourceMappingURL=diffusionRepository.js.map