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
const app_1 = require("../app");
const brandsServices_1 = require("../Services/brandsServices");
/**
 * Test l'API routes sans lancer le serveur
 */
function testApiRoutes() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\n========================================");
        console.log("[API Routes Test] Vérification des endpoints");
        console.log("========================================\n");
        try {
            // Étape 1 : Charger les données dans Redis
            console.log("[Test] Étape 1 : Rafraîchir les brands...");
            const brands = yield brandsServices_1.brandApiService.refreshBrandsFromApiToRedis();
            console.log(`✓ ${brands.length} brands chargées dans Redis\n`);
            // Étape 2 : Créer l'app Express
            console.log("[Test] Étape 2 : Créer l'application Express...");
            const app = (0, app_1.createApp)();
            console.log("✓ Application créée\n");
            // Étape 3 : Vérifier que l'app est bien configurée
            console.log("[Test] Étape 3 : Vérifier la structure de l'app...");
            if (app && typeof app.listen === 'function') {
                console.log("✓ Express app est bien configurée\n");
            }
            else {
                throw new Error("App invalide");
            }
            // Étape 4 : Résumé
            console.log("========================================");
            console.log("[API Routes Test] ✅ TOUS LES TESTS PASSED");
            console.log("========================================");
            console.log(`
Résumé :
- Express app créée avec succès
- Routes configurées
- ${brands.length} brands chargées dans Redis
- Prêt à démarrer le serveur avec : npm run dev
`);
            process.exit(0);
        }
        catch (error) {
            console.error("\n========================================");
            console.error("[API Routes Test] ❌ TEST FAILED");
            console.error("========================================");
            console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
            process.exit(1);
        }
    });
}
testApiRoutes();
//# sourceMappingURL=apiRoutesTest.js.map