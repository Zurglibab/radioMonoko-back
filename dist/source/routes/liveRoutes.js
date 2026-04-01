"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const liveController_1 = require("../controllers/liveController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/live/{station}:
 *   get:
 *     tags: [Live]
 *     summary: Recuperer le live d'une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live de la station
 */
router.get("/:station", liveController_1.getLiveByStation);
exports.default = router;
//# sourceMappingURL=liveRoutes.js.map