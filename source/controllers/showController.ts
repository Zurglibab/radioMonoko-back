import { Request, Response } from "express";
import { showApiService } from "../Services/showServices";
import { redisShowDao } from "../DAO/showDAO";
import { StationsEnum } from "../Enums/stationsEnum";

/**
 * GET /api/shows/:station
 * Récupère tous les shows pour une station (Redis en priorité, fallback API)
 */
export async function getShowsByStation(req: Request, res: Response) {
    try {
        const { station } = req.params;
        const { first } = req.query;

        console.log(`[showController] GET /api/shows/${station}`);

        // Vérifier que la station est valide
        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        const shows = await showApiService.getShowsWithFallback(
            station as StationsEnum,
            first ? parseInt(first as string) : 10
        );

        res.status(200).json({
            success: true,
            data: shows,
            count: shows.length,
            station
        });
    } catch (error) {
        console.error("[showController] getShowsByStation failed:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch shows"
        });
    }
}

/**
 * GET /api/shows/:station/:id
 * Récupère un show spécifique par son ID
 */
export async function getShowById(req: Request, res: Response) {
    try {
        const { station, id } = req.params;
        console.log(`[showController] GET /api/shows/${station}/${id}`);
        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        const show = await redisShowDao.getByIdAndStation(station as StationsEnum, id);

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
    } catch (error) {
        console.error("[showController] getShowById failed:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch show"
        });
    }
}

/**
 * GET /api/shows/:station/search/:title
 * Recherche les shows par titre (partiel)
 */
export async function searchShowsByTitle(req: Request, res: Response) {
    try {
        const { station, title } = req.params;
        console.log(`[showController] GET /api/shows/${station}/search/${title}`);

        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        const allShows = await showApiService.getShowsWithFallback(station as StationsEnum);
        const filtered = allShows.filter((show) =>
            show.title.toLowerCase().includes(title.toLowerCase())
        );

        res.status(200).json({
            success: true,
            data: filtered,
            count: filtered.length,
            query: title,
            station
        });
    } catch (error) {
        console.error("[showController] searchShowsByTitle failed:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Search failed"
        });
    }
}

/**
 * POST /api/shows/:station/refresh
 * Force un refresh des shows depuis l'API vers Redis
 */
export async function refreshShows(req: Request, res: Response) {
    try {
        const { station } = req.params;
        const { first } = req.query;

        console.log(`[showController] POST /api/shows/${station}/refresh`);


        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        const shows = await showApiService.refreshShowsFromApiToRedis(
            station as StationsEnum,
            first ? parseInt(first as string) : 10
        );

        res.status(200).json({
            success: true,
            message: `Successfully refreshed ${shows.length} shows for station ${station}`,
            data: shows,
            count: shows.length,
            station,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("[showController] refreshShows failed:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Refresh failed"
        });
    }
}

/**
 * GET /api/shows/:station/stats/count
 * Récupère le nombre total de shows pour une station
 */
export async function getShowsCount(req: Request, res: Response) {
    try {
        const { station } = req.params;
        console.log(`[showController] GET /api/shows/${station}/stats/count`);


        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        const count = await redisShowDao.countByStation(station as StationsEnum);

        res.status(200).json({
            success: true,
            data: {
                total: count,
                station
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("[showController] getShowsCount failed:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to count shows"
        });
    }
}

/**
 * DELETE /api/shows/:station/cache
 * Vide le cache Redis des shows pour une station
 */
export async function clearShowsCache(req: Request, res: Response) {
    try {
        const { station } = req.params;
        console.log(`[showController] DELETE /api/shows/${station}/cache`);

        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        await showApiService.deleteShowsFromRedis(station as StationsEnum);

        res.status(200).json({
            success: true,
            message: `Shows cache cleared for station ${station}`,
            station,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("[showController] clearShowsCache failed:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to clear cache"
        });
    }
}

