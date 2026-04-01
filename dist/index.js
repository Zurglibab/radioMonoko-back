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
const app_1 = require("./src/app");
const brandsScheduler_1 = require("./src/scedulers/brandsScheduler");
(0, dotenv_1.config)();
const PORT = process.env.PORT || 3000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("[App] Initializing RadioMonoko Backend...\n");
            // Créer l'app Express avec routes
            const app = (0, app_1.createApp)();
            // Démarrer le scheduler cron pour refresh auto des brands
            (0, brandsScheduler_1.startBrandsScheduler)();
            // Lancer le serveur
            app.listen(PORT, () => {
                console.log(`\n[App] ✅ Server is running on http://localhost:${PORT}/`);
                console.log(`[App] API docs available at http://localhost:${PORT}/api/docs\n`);
            });
        }
        catch (error) {
            console.error("[App] Failed to initialize:", error);
            process.exit(1);
        }
    });
}
main();
//# sourceMappingURL=index.js.map