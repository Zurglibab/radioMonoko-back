"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const showController_1 = require("../controllers/showController");
const router = (0, express_1.Router)();
// Shows endpoints
router.get("/:station", showController_1.getShowsByStation);
router.get("/:station/:id", showController_1.getShowById);
router.get("/:station/search/:title", showController_1.searchShowsByTitle);
router.post("/:station/refresh", showController_1.refreshShows);
// Stats endpoints
router.get("/:station/stats/count", showController_1.getShowsCount);
// Cache management
router.delete("/:station/cache", showController_1.clearShowsCache);
exports.default = router;
//# sourceMappingURL=showRoutes.js.map