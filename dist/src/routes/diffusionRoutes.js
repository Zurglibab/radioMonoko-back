"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const diffusionController_1 = require("../controllers/diffusionController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/diffusions/{station}:
 *   get:
 *     tags: [Diffusions]
 *     summary: Recuperer les diffusions d'une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: themes
 *         required: false
 *         schema:
 *           type: string
 *         description: Liste des themes separes par des virgules
 *       - in: query
 *         name: first
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Liste des diffusions
 */
router.get("/:station", diffusionController_1.getDiffusionsByStation);
exports.default = router;
//# sourceMappingURL=diffusionRoutes.js.map