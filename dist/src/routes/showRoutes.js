"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const showController_1 = require("../controllers/showController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/shows/{station}/search/{title}:
 *   get:
 *     tags: [Shows]
 *     summary: Rechercher des shows par titre
 */
router.get("/:station/search/:title", showController_1.searchShowsByTitle);
/**
 * @openapi
 * /api/shows/{station}/stats/count:
 *   get:
 *     tags: [Shows]
 *     summary: Nombre de shows pour une station
 */
router.get("/:station/stats/count", showController_1.getShowsCount);
/**
 * @openapi
 * /api/shows/{station}/refresh:
 *   post:
 *     tags: [Shows]
 *     summary: Rafraichir les shows d'une station
 */
router.post("/:station/refresh", showController_1.refreshShows);
/**
 * @openapi
 * /api/shows/{station}/cache:
 *   delete:
 *     tags: [Shows]
 *     summary: Vider le cache shows d'une station
 */
router.delete("/:station/cache", showController_1.clearShowsCache);
/**
 * @openapi
 * /api/shows/{station}/{id}:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer un show par ID
 */
router.get("/:station/:id", showController_1.getShowById);
/**
 * @openapi
 * /api/shows/{station}:
 *   get:
 *     tags: [Shows]
 *     summary: Recuperer les shows d'une station
 */
router.get("/:station", showController_1.getShowsByStation);
exports.default = router;
//# sourceMappingURL=showRoutes.js.map