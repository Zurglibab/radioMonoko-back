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
exports.liveRepository = exports.LiveRepository = void 0;
const ApiConnexion_1 = require("../Config/ApiConnexion");
const liveDTO_1 = require("../DTO/liveDTO");
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
class LiveRepository {
    fetchLiveByStation(station) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield ApiConnexion_1.radioFrance.query(GET_LIVE_QUERY, { station });
                return (0, liveDTO_1.toLiveDto)((_a = response === null || response === void 0 ? void 0 : response.live) !== null && _a !== void 0 ? _a : null);
            }
            catch (error) {
                console.error("[LiveRepository] Failed to fetch live:", error);
                throw error;
            }
        });
    }
}
exports.LiveRepository = LiveRepository;
exports.liveRepository = new LiveRepository();
//# sourceMappingURL=liveRepository.js.map