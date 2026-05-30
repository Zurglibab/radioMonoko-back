import { Router } from "express";
import {
  getShowsByStation,
  getShowById,
  getShowByUrl,
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
 * /api/shows/show-by-url:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer un show par son URL (ne nécessite pas la station)
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: first
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Show correspondant à l'URL
 */
router.get("/show-by-url", getShowByUrl);

/**
 * @openapi
 * /api/shows/{station}:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer les shows d'une station
 */
router.get("/:station", getShowsByStation);

export default router;