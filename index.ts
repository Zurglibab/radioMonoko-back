import { config } from 'dotenv';
import { createApp } from "./source/app";
import { startBrandsScheduler } from "./source/Schedulers/brandsScheduler";

config();

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        console.log("[App] Initializing RadioMonoko Backend...\n");

        // Créer l'app Express avec routes
        const app = createApp();

        // Démarrer le scheduler cron pour refresh auto des brands
        startBrandsScheduler();

        // Lancer le serveur
        app.listen(PORT, () => {
            console.log(`\n[App] ✅ Server is running on http://localhost:${PORT}/`);
            console.log(`[App] API docs available at http://localhost:${PORT}/\n`);
        });
    } catch (error) {
        console.error("[App] Failed to initialize:", error);
        process.exit(1);
    }
}

main();


