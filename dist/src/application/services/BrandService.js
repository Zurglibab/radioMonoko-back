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
exports.BrandService = void 0;
const BrandDto_1 = require("../dto/BrandDto");
class BrandService {
    constructor(repository) {
        this.repository = repository;
    }
    refreshBrandsInRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshed = yield this.repository.refreshFromApiToRedis();
            return refreshed.map(BrandDto_1.toBrandDto);
        });
    }
    getBrandsFromRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            const brands = yield this.repository.getAllFromRedis();
            return brands ? brands.map(BrandDto_1.toBrandDto) : null;
        });
    }
}
exports.BrandService = BrandService;
//# sourceMappingURL=BrandService.js.map