import { Router } from "express";
import {
  getAllBrands,
  getBrandById,
  searchBrands,
  refreshBrands,
  getBrandsCount,
  clearBrandsCache,
  health } from
"../controllers/brandController";
import showRoutes from "./showRoutes";
import diffusionRoutes from "./diffusionRoutes";
import liveRoutes from "./liveRoutes";


const router = Router();











router.get("/health", health);











router.get("/brands", getAllBrands);

















router.get("/brands/:id", getBrandById);

















router.get("/brands/search/:title", searchBrands);











router.post("/brands/refresh", refreshBrands);











router.get("/brands/stats/count", getBrandsCount);











router.delete("/brands/cache", clearBrandsCache);


router.use("/shows", showRoutes);
router.use("/diffusions", diffusionRoutes);
router.use("/live", liveRoutes);


export default router;