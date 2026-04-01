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
exports.showApiService = exports.ShowApiService = void 0;
const showRepository_1 = require("../Repository/showRepository");
const showDAO_1 = require("../DAO/showDAO");
class ShowApiService {
    constructor() {
        this.apiRepository = new showRepository_1.ShowRepository();
        this.redisDao = new showDAO_1.ShowDAO();
    }
    /**
     * Récupère les shows depuis l'API et les stocke dans Redis
     */
    refreshShowsFromApiToRedis(station_1) {
        return __awaiter(this, arguments, void 0, function* (station, first = 10) {
            try {
                console.log(`[ShowApiService] Fetching shows from API for station ${station}...`);
                const shows = yield this.apiRepository.fetchShowsByStation(station, first);
                console.log(`[ShowApiService] Got ${shows.length} shows, storing in Redis...`);
                yield this.redisDao.saveAllByStation(station, shows);
                console.log("[ShowApiService] Shows successfully stored in Redis");
                return shows;
            }
            catch (error) {
                console.error("[ShowApiService] Failed to refresh shows:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère les shows depuis Redis
     */
    getShowsFromRedis(station) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[ShowApiService] Fetching shows from Redis for station ${station}...`);
                const shows = yield this.redisDao.getAllByStation(station);
                if (!shows) {
                    console.log(`[ShowApiService] No shows found in Redis for station ${station}`);
                    return null;
                }
                console.log(`[ShowApiService] Retrieved ${shows.length} shows from Redis for station ${station}`);
                return shows;
            }
            catch (error) {
                console.error("[ShowApiService] Failed to get shows from Redis:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère les shows depuis Redis, sinon les récupère depuis l'API
     */
    getShowsWithFallback(station_1) {
        return __awaiter(this, arguments, void 0, function* (station, first = 10) {
            try {
                const cachedShows = yield this.getShowsFromRedis(station);
                if (cachedShows && cachedShows.length > 0) {
                    return cachedShows;
                }
                console.log(`[ShowApiService] Cache miss, fetching from API...`);
                return yield this.refreshShowsFromApiToRedis(station, first);
            }
            catch (error) {
                console.error("[ShowApiService] Failed with fallback:", error);
                throw error;
            }
        });
    }
    /**
     * Supprime les shows de Redis pour une station
     */
    deleteShowsFromRedis(station) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[ShowApiService] Deleting shows from Redis for station ${station}...`);
                yield this.redisDao.deleteAllByStation(station);
                console.log("[ShowApiService] Shows successfully deleted from Redis");
            }
            catch (error) {
                console.error("[ShowApiService] Failed to delete shows:", error);
                throw error;
            }
        });
    }
}
exports.ShowApiService = ShowApiService;
exports.showApiService = new ShowApiService();
//# sourceMappingURL=showServices.js.map