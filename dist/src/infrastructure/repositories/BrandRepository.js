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
exports.BrandRepository = void 0;
function toEntity(brand) {
    var _a, _b;
    return {
        id: brand.id,
        title: brand.title,
        baseline: brand.baseline,
        description: brand.description,
        websiteUrl: brand.websiteUrl,
        liveStream: brand.liveStream,
        playerUrl: brand.playerUrl,
        webRadios: (_a = brand.webRadios) !== null && _a !== void 0 ? _a : [],
        localRadios: (_b = brand.localRadios) !== null && _b !== void 0 ? _b : []
    };
}
function toBrand(entity) {
    var _a, _b;
    return Object.assign(Object.assign({}, entity), { webRadios: (_a = entity.webRadios) !== null && _a !== void 0 ? _a : [], localRadios: (_b = entity.localRadios) !== null && _b !== void 0 ? _b : [] });
}
class BrandRepository {
    constructor(apiDao, redisDao) {
        this.apiDao = apiDao;
        this.redisDao = redisDao;
    }
    refreshFromApiToRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            const brands = yield this.apiDao.fetchBrands();
            yield this.redisDao.saveAll(brands);
            return brands.map(toEntity);
        });
    }
    getAllFromRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            const brands = yield this.redisDao.getAll();
            return brands ? brands.map(toEntity) : null;
        });
    }
    deleteAllFromRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redisDao.deleteAll();
        });
    }
    saveToRedis(brands) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redisDao.saveAll(brands.map(toBrand));
        });
    }
}
exports.BrandRepository = BrandRepository;
//# sourceMappingURL=BrandRepository.js.map