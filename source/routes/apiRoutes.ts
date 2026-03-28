import { Router } from "express";
import {
    getAllBrands,
    getBrandById,
    searchBrands,
    refreshBrands,
    getBrandsCount,
    clearBrandsCache,
    health
} from "../controllers/brandController";
import showRoutes from "./showRoutes";

const router = Router();

// Health check
router.get("/health", health);

// Brands endpoints
router.get("/brands", getAllBrands);
router.get("/brands/:id", getBrandById);
router.get("/brands/search/:title", searchBrands);
router.post("/brands/refresh", refreshBrands);

// Stats endpoints
router.get("/brands/stats/count", getBrandsCount);

// Cache management
router.delete("/brands/cache", clearBrandsCache);

// Shows endpoints (montées sous /api/shows)
router.use("/shows", showRoutes);

export default router;
