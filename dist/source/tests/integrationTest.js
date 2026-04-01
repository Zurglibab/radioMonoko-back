"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const brandsServices_1 = require("../Services/brandsServices");
const brandDAO_1 = require("../DAO/brandDAO");
const RedisConnexion_1 = require("../Config/RedisConnexion");
(0, dotenv_1.config)();
function runIntegrationTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\n========================================");
        console.log("[IntegrationTest] Global Brands API → Redis Test");
        console.log("========================================\n");
        try {
            // Step 1: Refresh brands from API to Redis
            console.log("[Step 1] Fetching brands from API and storing in Redis...");
            const refreshedBrands = yield brandsServices_1.brandApiService.refreshBrandsFromApiToRedis();
            console.log(`✓ Successfully fetched and stored ${refreshedBrands.length} brands\n`);
            // Step 2: Retrieve all brands from Redis
            console.log("[Step 2] Retrieving all brands from Redis...");
            const cachedBrands = yield brandsServices_1.brandApiService.getBrandsFromRedis();
            if (!cachedBrands) {
                throw new Error("Failed to retrieve brands from Redis");
            }
            console.log(`✓ Retrieved ${cachedBrands.length} brands from Redis\n`);
            // Step 3: Verify count matches
            console.log("[Step 3] Verifying data consistency...");
            if (refreshedBrands.length !== cachedBrands.length) {
                throw new Error(`Brand count mismatch: API=${refreshedBrands.length}, Redis=${cachedBrands.length}`);
            }
            console.log(`✓ Brand counts match: ${refreshedBrands.length} brands\n`);
            // Step 4: Verify each brand's data
            console.log("[Step 4] Verifying individual brand data...");
            let verifiedCount = 0;
            for (const brand of refreshedBrands) {
                const redisVersion = yield brandDAO_1.redisDao.getById(brand.id);
                if (!redisVersion) {
                    throw new Error(`Brand ${brand.id} not found in Redis after refresh`);
                }
                if (redisVersion.title !== brand.title) {
                    throw new Error(`Brand ${brand.id} title mismatch`);
                }
                verifiedCount++;
            }
            console.log(`✓ All ${verifiedCount} brands verified in Redis\n`);
            // Step 5: Test count and exists methods
            console.log("[Step 5] Testing DAO methods...");
            const totalCount = yield brandDAO_1.redisDao.count();
            console.log(`✓ Total brands in Redis: ${totalCount}`);
            const firstBrandId = refreshedBrands[0].id;
            const exists = yield brandDAO_1.redisDao.exists(firstBrandId);
            console.log(`✓ Brand ${firstBrandId} exists in Redis: ${exists}`);
            const allIds = yield brandDAO_1.redisDao.getAllIds();
            console.log(`✓ Retrieved ${allIds.length} brand IDs from Redis\n`);
            // Step 6: Display sample brands
            console.log("[Step 6] Sample brands from Redis:");
            const sampleSize = Math.min(3, cachedBrands.length);
            cachedBrands.slice(0, sampleSize).forEach((brand, index) => {
                console.log(`  ${index + 1}. "${brand.title}" (${brand.id})` +
                    `${brand.baseline ? ` - ${brand.baseline}` : ""}`);
            });
            if (cachedBrands.length > sampleSize) {
                console.log(`  ... and ${cachedBrands.length - sampleSize} more`);
            }
            console.log();
            // Step 7: Test fallback mechanism
            console.log("[Step 7] Testing fallback mechanism (Redis first, then API)...");
            const fallbackBrands = yield brandsServices_1.brandApiService.getBrandsWithFallback();
            console.log(`✓ Fallback returned ${fallbackBrands.length} brands (from cache)\n`);
            // Success summary
            console.log("========================================");
            console.log("[IntegrationTest] ✅ ALL TESTS PASSED");
            console.log("========================================");
            console.log(`
Summary:
- API Brands: ${refreshedBrands.length}
- Redis Brands: ${cachedBrands.length}
- All brands verified and accessible
- DAO operations working correctly
- Fallback mechanism functional
`);
            process.exit(0);
        }
        catch (error) {
            console.error("\n========================================");
            console.error("[IntegrationTest] ❌ TEST FAILED");
            console.error("========================================");
            console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
            process.exit(1);
        }
        finally {
            yield (0, RedisConnexion_1.disconnect)();
        }
    });
}
runIntegrationTest();
//# sourceMappingURL=integrationTest.js.map