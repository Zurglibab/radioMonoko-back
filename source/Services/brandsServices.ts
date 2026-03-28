import { BrandsRepository } from "../Repository/brandsRepository";
import { BrandDAO } from "../DAO/brandDAO";
import { BrandDto } from "../DTO/brandDTO";

export class BrandApiService {
    private readonly apiRepository: BrandsRepository;
    private readonly redisDao: BrandDAO;

    constructor() {
        this.apiRepository = new BrandsRepository();
        this.redisDao = new BrandDAO();
    }

    /**
     * Récupère les brands depuis l'API et les stocke dans Redis
     */
    async refreshBrandsFromApiToRedis(): Promise<BrandDto[]> {
        try {
            console.log("[BrandApiService] Fetching brands from API...");
            const brands = await this.apiRepository.getBrands();

            console.log(`[BrandApiService] Got ${brands.length} brands, storing in Redis...`);
            await this.redisDao.saveAll(brands);

            console.log("[BrandApiService] Brands successfully stored in Redis");
            return brands;
        } catch (error) {
            console.error("[BrandApiService] Failed to refresh brands:", error);
            throw error;
        }
    }

    /**
     * Récupère les brands depuis Redis
     */
    async getBrandsFromRedis(): Promise<BrandDto[] | null> {
        try {
            console.log("[BrandApiService] Fetching brands from Redis...");
            const brands = await this.redisDao.getAll();

            if (!brands) {
                console.log("[BrandApiService] No brands found in Redis");
                return null;
            }

            console.log(`[BrandApiService] Retrieved ${brands.length} brands from Redis`);
            return brands;
        } catch (error) {
            console.error("[BrandApiService] Failed to get brands from Redis:", error);
            throw error;
        }
    }

    /**
     * Récupère les brands depuis Redis, sinon les récupère depuis l'API
     */
    async getBrandsWithFallback(): Promise<BrandDto[]> {
        try {
            // Essayer Redis d'abord
            const cachedBrands = await this.getBrandsFromRedis();
            if (cachedBrands && cachedBrands.length > 0) {
                return cachedBrands;
            }

            // Fallback sur API
            console.log("[BrandApiService] Cache miss, fetching from API...");
            return await this.refreshBrandsFromApiToRedis();
        } catch (error) {
            console.error("[BrandApiService] Failed with fallback:", error);
            throw error;
        }
    }

    /**
     * Supprime les brands de Redis
     */
    async deleteBrandsFromRedis(): Promise<void> {
        try {
            console.log("[BrandApiService] Deleting brands from Redis...");
            await this.redisDao.deleteAll();
            console.log("[BrandApiService] Brands successfully deleted from Redis");
        } catch (error) {
            console.error("[BrandApiService] Failed to delete brands:", error);
            throw error;
        }
    }
}

// Export singleton pour utilisation simplifiée
export const brandApiService = new BrandApiService();

