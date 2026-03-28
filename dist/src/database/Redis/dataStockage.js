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
exports.setData = setData;
exports.storeBrandsInRedis = storeBrandsInRedis;
exports.getBrandsFromRedis = getBrandsFromRedis;
exports.deleteBrandsFromRedis = deleteBrandsFromRedis;
const RedisBrandDao_1 = require("../../infrastructure/dao/RedisBrandDao");
const redisBrandDao = new RedisBrandDao_1.RedisBrandDao();
function setData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisBrandDao.saveAll(data.brands || []);
    });
}
function storeBrandsInRedis(brands) {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisBrandDao.saveAll(brands || []);
    });
}
function getBrandsFromRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield redisBrandDao.getAll();
    });
}
function deleteBrandsFromRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisBrandDao.deleteAll();
    });
}
//# sourceMappingURL=dataStockage.js.map