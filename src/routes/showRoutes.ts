import { Router } from "express";
import {
  getShowsByStation,
  getShowById,
  searchShowsByTitle,
  refreshShows,
  getShowsCount,
  clearShowsCache
} from "../controllers/showController";

const router = Router();

/**
 * @openapi
 * /api/shows/{station}/search/{title}:
 *   get:
 *     tags: [Shows]
 *     summary: Rechercher des shows par titre
 */
router.get("/:station/search/:title", searchShowsByTitle);

/**
 * @openapi
 * /api/shows/{station}/stats/count:
 *   get:
 *     tags: [Shows]
 *     summary: Nombre de shows pour une station
 */
router.get("/:station/stats/count", getShowsCount);

/**
 * @openapi
 * /api/shows/{station}/refresh:
 *   post:
 *     tags: [Shows]
 *     summary: Rafraichir les shows d'une station
 */
router.post("/:station/refresh", refreshShows);

/**
 * @openapi
 * /api/shows/{station}/cache:
 *   delete:
 *     tags: [Shows]
 *     summary: Vider le cache shows d'une station
 */
router.delete("/:station/cache", clearShowsCache);

/**
 * @openapi
 * /api/shows/{station}/{id}:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer un show par ID
 */
router.get("/:station/:id", getShowById);

/**
 * @openapi
 * /api/shows/{station}:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer les shows d'une station
 */
router.get("/:station", getShowsByStation);

export default router;