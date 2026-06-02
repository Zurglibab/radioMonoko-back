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

// ── Static routes FIRST (before any :station parametric routes) ──

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

// ── Parametric routes (more specific patterns first) ──

/**
 * @openapi
 * /api/shows/{station}/search/{title}:
 *   get:
 *     tags: [Shows]
 *     summary: Rechercher des shows par titre
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la station (ex: FRANCEINTER, MOUV, FIP...)"
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: "Titre ou partie du titre a rechercher"
 *     responses:
 *       200:
 *         description: Resultats de recherche
 *       400:
 *         description: Station invalide
 */
router.get("/:station/search/:title", searchShowsByTitle);

/**
 * @openapi
 * /api/shows/{station}/stats/count:
 *   get:
 *     tags: [Shows]
 *     summary: Nombre de shows pour une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la station (ex: FRANCEINTER, MOUV, FIP...)"
 *     responses:
 *       200:
 *         description: Compteur des shows
 *       400:
 *         description: Station invalide
 */
router.get("/:station/stats/count", getShowsCount);

/**
 * @openapi
 * /api/shows/{station}/refresh:
 *   post:
 *     tags: [Shows]
 *     summary: Rafraichir les shows d'une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la station (ex: FRANCEINTER, MOUV, FIP...)"
 *       - in: query
 *         name: first
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Nombre de shows a recuperer (defaut: 10)"
 *     responses:
 *       200:
 *         description: Cache shows mis a jour
 *       400:
 *         description: Station invalide
 */
router.post("/:station/refresh", refreshShows);

/**
 * @openapi
 * /api/shows/{station}/cache:
 *   delete:
 *     tags: [Shows]
 *     summary: Vider le cache shows d'une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la station (ex: FRANCEINTER, MOUV, FIP...)"
 *     responses:
 *       200:
 *         description: Cache vide
 *       400:
 *         description: Station invalide
 */
router.delete("/:station/cache", clearShowsCache);

/**
 * @openapi
 * /api/shows/{station}/{id}:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer un show par ID
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la station (ex: FRANCEINTER, MOUV, FIP...)"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du show"
 *     responses:
 *       200:
 *         description: Show trouve
 *       400:
 *         description: Station invalide
 *       404:
 *         description: Show non trouve
 */
router.get("/:station/:id", getShowById);

/**
 * @openapi
 * /api/shows/{station}:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer les shows d'une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la station (ex: FRANCEINTER, MOUV, FIP...)"
 *       - in: query
 *         name: first
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Nombre de shows a recuperer (defaut: 10)"
 *     responses:
 *       200:
 *         description: Liste des shows de la station
 *       400:
 *         description: Station invalide
 */
router.get("/:station", getShowsByStation);

export default router;