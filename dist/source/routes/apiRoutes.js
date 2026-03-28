"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brandController_1 = require("../controllers/brandController");
const showRoutes_1 = __importDefault(require("./showRoutes"));
const router = (0, express_1.Router)();
// Health check
router.get("/health", brandController_1.health);
// Brands endpoints
router.get("/brands", brandController_1.getAllBrands);
router.get("/brands/:id", brandController_1.getBrandById);
router.get("/brands/search/:title", brandController_1.searchBrands);
router.post("/brands/refresh", brandController_1.refreshBrands);
// Stats endpoints
router.get("/brands/stats/count", brandController_1.getBrandsCount);
// Cache management
router.delete("/brands/cache", brandController_1.clearBrandsCache);
// Shows endpoints (montées sous /api/shows)
router.use("/shows", showRoutes_1.default);
exports.default = router;
//# sourceMappingURL=apiRoutes.js.map