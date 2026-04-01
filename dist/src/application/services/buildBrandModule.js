"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBrandService = buildBrandService;
const BrandService_1 = require("./BrandService");
const ApiBrandDao_1 = require("../../infrastructure/dao/ApiBrandDao");
const RedisBrandDao_1 = require("../../infrastructure/dao/RedisBrandDao");
const BrandRepository_1 = require("../../infrastructure/repositories/BrandRepository");
function buildBrandService() {
    const apiDao = new ApiBrandDao_1.ApiBrandDao();
    const redisDao = new RedisBrandDao_1.RedisBrandDao();
    const repository = new BrandRepository_1.BrandRepository(apiDao, redisDao);
    return new BrandService_1.BrandService(repository);
}
//# sourceMappingURL=buildBrandModule.js.map