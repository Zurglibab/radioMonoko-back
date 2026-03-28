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
exports.getShowsByStation = getShowsByStation;
exports.getShowById = getShowById;
exports.searchShowsByTitle = searchShowsByTitle;
exports.refreshShows = refreshShows;
exports.getShowsCount = getShowsCount;
exports.clearShowsCache = clearShowsCache;
const showServices_1 = require("../Services/showServices");
const redisShowDAO_1 = require("../DAO/redisShowDAO");
const stationsEnum_1 = require("../Enums/stationsEnum");
/**
 * GET /api/shows/:station
 * Récupère tous les shows pour une station (Redis en priorité, fallback API)
 */
function getShowsByStation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { station } = req.params;
            const { first } = req.query;
            console.log(`[showController] GET /api/shows/${station}`);
            // Vérifier que la station est valide
            if (!Object.values(stationsEnum_1.StationsEnum).includes(station)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid station. Valid stations: ${Object.values(stationsEnum_1.StationsEnum).join(", ")}`
                });
            }
            const shows = yield showServices_1.showApiService.getShowsWithFallback(station, first ? parseInt(first) : 10);
            res.status(200).json({
                success: true,
                data: shows,
                count: shows.length,
                station
            });
        }
        catch (error) {
            console.error("[showController] getShowsByStation failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to fetch shows"
            });
        }
    });
}
/**
 * GET /api/shows/:station/:id
 * Récupère un show spécifique par son ID
 */
function getShowById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { station, id } = req.params;
            console.log(`[showController] GET /api/shows/${station}/${id}`);
            // Vérifier que la station est valide
            if (!Object.values(stationsEnum_1.StationsEnum).includes(station)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid station. Valid stations: ${Object.values(stationsEnum_1.StationsEnum).join(", ")}`
                });
            }
            const show = yield redisShowDAO_1.redisShowDao.getByIdAndStation(station, id);
            if (!show) {
                return res.status(404).json({
                    success: false,
                    error: `Show with id "${id}" not found for station "${station}"`
                });
            }
            res.status(200).json({
                success: true,
                data: show
            });
        }
        catch (error) {
            console.error("[showController] getShowById failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to fetch show"
            });
        }
    });
}
/**
 * GET /api/shows/:station/search/:title
 * Recherche les shows par titre (partiel)
 */
function searchShowsByTitle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { station, title } = req.params;
            console.log(`[showController] GET /api/shows/${station}/search/${title}`);
            // Vérifier que la station est valide
            if (!Object.values(stationsEnum_1.StationsEnum).includes(station)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid station. Valid stations: ${Object.values(stationsEnum_1.StationsEnum).join(", ")}`
                });
            }
            const allShows = yield showServices_1.showApiService.getShowsWithFallback(station);
            const filtered = allShows.filter((show) => show.title.toLowerCase().includes(title.toLowerCase()));
            res.status(200).json({
                success: true,
                data: filtered,
                count: filtered.length,
                query: title,
                station
            });
        }
        catch (error) {
            console.error("[showController] searchShowsByTitle failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Search failed"
            });
        }
    });
}
/**
 * POST /api/shows/:station/refresh
 * Force un refresh des shows depuis l'API vers Redis
 */
function refreshShows(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { station } = req.params;
            const { first } = req.query;
            console.log(`[showController] POST /api/shows/${station}/refresh`);
            // Vérifier que la station est valide
            if (!Object.values(stationsEnum_1.StationsEnum).includes(station)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid station. Valid stations: ${Object.values(stationsEnum_1.StationsEnum).join(", ")}`
                });
            }
            const shows = yield showServices_1.showApiService.refreshShowsFromApiToRedis(station, first ? parseInt(first) : 10);
            res.status(200).json({
                success: true,
                message: `Successfully refreshed ${shows.length} shows for station ${station}`,
                data: shows,
                count: shows.length,
                station,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error("[showController] refreshShows failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Refresh failed"
            });
        }
    });
}
/**
 * GET /api/shows/:station/stats/count
 * Récupère le nombre total de shows pour une station
 */
function getShowsCount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { station } = req.params;
            console.log(`[showController] GET /api/shows/${station}/stats/count`);
            // Vérifier que la station est valide
            if (!Object.values(stationsEnum_1.StationsEnum).includes(station)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid station. Valid stations: ${Object.values(stationsEnum_1.StationsEnum).join(", ")}`
                });
            }
            const count = yield redisShowDAO_1.redisShowDao.countByStation(station);
            res.status(200).json({
                success: true,
                data: {
                    total: count,
                    station
                },
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error("[showController] getShowsCount failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to count shows"
            });
        }
    });
}
/**
 * DELETE /api/shows/:station/cache
 * Vide le cache Redis des shows pour une station
 */
function clearShowsCache(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { station } = req.params;
            console.log(`[showController] DELETE /api/shows/${station}/cache`);
            // Vérifier que la station est valide
            if (!Object.values(stationsEnum_1.StationsEnum).includes(station)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid station. Valid stations: ${Object.values(stationsEnum_1.StationsEnum).join(", ")}`
                });
            }
            yield showServices_1.showApiService.deleteShowsFromRedis(station);
            res.status(200).json({
                success: true,
                message: `Shows cache cleared for station ${station}`,
                station,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error("[showController] clearShowsCache failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to clear cache"
            });
        }
    });
}
//# sourceMappingURL=showController.js.map