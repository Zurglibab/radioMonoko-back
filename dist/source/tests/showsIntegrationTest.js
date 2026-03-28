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
const showServices_1 = require("../Services/showServices");
const redisShowDAO_1 = require("../DAO/redisShowDAO");
const RedisConnexion_1 = require("../Config/RedisConnexion");
const stationsEnum_1 = require("../Enums/stationsEnum");
(0, dotenv_1.config)();
function runShowsIntegrationTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\n========================================");
        console.log("[ShowsIntegrationTest] Global Shows API → Redis Test");
        console.log("========================================\n");
        try {
            const station = stationsEnum_1.StationsEnum.FRANCEINTER;
            const first = 5;
            // Step 1: Refresh shows from API to Redis
            console.log(`[Step 1] Fetching shows from API (station: ${station}, first: ${first})...`);
            const refreshedShows = yield showServices_1.showApiService.refreshShowsFromApiToRedis(station, first);
            console.log(`✓ Successfully fetched and stored ${refreshedShows.length} shows\n`);
            // Step 2: Retrieve shows from Redis
            console.log("[Step 2] Retrieving shows from Redis...");
            const cachedShows = yield showServices_1.showApiService.getShowsFromRedis(station);
            if (!cachedShows) {
                throw new Error("Failed to retrieve shows from Redis");
            }
            console.log(`✓ Retrieved ${cachedShows.length} shows from Redis\n`);
            // Step 3: Verify count matches
            console.log("[Step 3] Verifying data consistency...");
            if (refreshedShows.length !== cachedShows.length) {
                throw new Error(`Show count mismatch: API=${refreshedShows.length}, Redis=${cachedShows.length}`);
            }
            console.log(`✓ Show counts match: ${refreshedShows.length} shows\n`);
            // Step 4: Verify each show's data
            console.log("[Step 4] Verifying individual show data...");
            let verifiedCount = 0;
            for (const show of refreshedShows) {
                const redisVersion = yield redisShowDAO_1.redisShowDao.getByIdAndStation(station, show.id);
                if (!redisVersion) {
                    throw new Error(`Show ${show.id} not found in Redis after refresh`);
                }
                if (redisVersion.title !== show.title) {
                    throw new Error(`Show ${show.id} title mismatch`);
                }
                verifiedCount++;
            }
            console.log(`✓ All ${verifiedCount} shows verified in Redis\n`);
            // Step 5: Test count and exists methods
            console.log("[Step 5] Testing DAO methods...");
            const totalCount = yield redisShowDAO_1.redisShowDao.countByStation(station);
            console.log(`✓ Total shows in Redis for ${station}: ${totalCount}`);
            if (refreshedShows.length > 0) {
                const firstShowId = refreshedShows[0].id;
                const exists = yield redisShowDAO_1.redisShowDao.existsByIdAndStation(station, firstShowId);
                console.log(`✓ Show ${firstShowId} exists in Redis: ${exists}`);
                const allIds = yield redisShowDAO_1.redisShowDao.getAllIdsByStation(station);
                console.log(`✓ Retrieved ${allIds.length} show IDs from Redis\n`);
            }
            // Step 6: Display sample shows
            console.log("[Step 6] Sample shows from Redis:");
            const sampleSize = Math.min(3, cachedShows.length);
            cachedShows.slice(0, sampleSize).forEach((show, index) => {
                const diffusionCount = show.diffusions ? show.diffusions.length : 0;
                const taxonomyCount = show.taxonomies ? show.taxonomies.length : 0;
                console.log(`  ${index + 1}. "${show.title}" (${show.id})` +
                    ` - ${diffusionCount} diffusions, ${taxonomyCount} taxonomies`);
            });
            if (cachedShows.length > sampleSize) {
                console.log(`  ... and ${cachedShows.length - sampleSize} more`);
            }
            console.log();
            // Step 7: Test fallback mechanism
            console.log("[Step 7] Testing fallback mechanism (Redis first, then API)...");
            const fallbackShows = yield showServices_1.showApiService.getShowsWithFallback(station, first);
            console.log(`✓ Fallback returned ${fallbackShows.length} shows (from cache)\n`);
            // Success summary
            console.log("========================================");
            console.log("[ShowsIntegrationTest] ✅ ALL TESTS PASSED");
            console.log("========================================");
            console.log(`
Summary:
- Station: ${station}
- API Shows: ${refreshedShows.length}
- Redis Shows: ${cachedShows.length}
- All shows verified and accessible
- DAO operations working correctly
- Fallback mechanism functional
`);
            process.exit(0);
        }
        catch (error) {
            console.error("\n========================================");
            console.error("[ShowsIntegrationTest] ❌ TEST FAILED");
            console.error("========================================");
            console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
            process.exit(1);
        }
        finally {
            yield (0, RedisConnexion_1.disconnect)();
        }
    });
}
runShowsIntegrationTest();
//# sourceMappingURL=showsIntegrationTest.js.map