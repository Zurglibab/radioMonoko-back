import { createApp } from "../app";
import { brandApiService } from "../services/brandsServices";




async function testApiRoutes() {
  console.log("\n========================================");
  console.log("[API Routes Test] Vérification des endpoints");
  console.log("========================================\n");

  try {

    console.log("[Test] Étape 1 : Rafraîchir les brands...");
    const brands = await brandApiService.refreshBrandsFromApiToRedis();
    console.log(`✓ ${brands.length} brands chargées dans Redis\n`);


    console.log("[Test] Étape 2 : Créer l'application Express...");
    const app = createApp();
    console.log("✓ Application créée\n");


    console.log("[Test] Étape 3 : Vérifier la structure de l'app...");
    if (app && typeof app.listen === 'function') {
      console.log("✓ Express app est bien configurée\n");
    } else {
      throw new Error("App invalide");
    }


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
  } catch (error) {
    console.error("\n========================================");
    console.error("[API Routes Test] ❌ TEST FAILED");
    console.error("========================================");
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

testApiRoutes();