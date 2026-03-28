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
exports.ApiBrandDao = void 0;
const ApiConnexion_1 = require("../../config/ApiConnexion");
const getAllBrandQuery = `
  {
  brands {
    id
    title
    baseline
    description
    websiteUrl
    playerUrl
    liveStream
    localRadios {
      id
      title
      description
      liveStream
      playerUrl
    }
    webRadios {
      id
      title
      description
      liveStream
      playerUrl
    }
  }
}
`;
class ApiBrandDao {
    fetchBrands() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield ApiConnexion_1.radioFrance.query(getAllBrandQuery);
            const brands = (_a = data === null || data === void 0 ? void 0 : data.brands) !== null && _a !== void 0 ? _a : [];
            return [...brands].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        });
    }
}
exports.ApiBrandDao = ApiBrandDao;
//# sourceMappingURL=ApiBrandDao.js.map