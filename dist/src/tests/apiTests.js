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
const brandsRepository_1 = require("../repository/brandsRepository");
(0, dotenv_1.config)();
function printAllBrandsWithRepository() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repository = new brandsRepository_1.BrandsRepository();
            const brands = yield repository.getBrands();
            console.log(`\n[apiRepositoryPrintBrands] Total brands: ${brands.length}\n`);
            brands.forEach((brand, index) => {
                console.log(`${index + 1}. ${brand.title} (id: ${brand.id})` +
                    `${brand.baseline ? ` - baseline: ${brand.baseline}` : ""}`);
            });
            console.log("\n[apiRepositoryPrintBrands] Done.");
            process.exit(0);
        }
        catch (error) {
            console.error("[apiRepositoryPrintBrands] Failed:", error);
            process.exit(1);
        }
    });
}
printAllBrandsWithRepository();
//# sourceMappingURL=apiTests.js.map