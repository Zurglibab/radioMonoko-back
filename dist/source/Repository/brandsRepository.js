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
exports.BrandsRepository = void 0;
const ApiConnexion_1 = require("../Config/ApiConnexion");
const GET_ALL_BRANDS_QUERY = `
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
class BrandsRepository {
    getBrands() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = yield ApiConnexion_1.radioFrance.query(GET_ALL_BRANDS_QUERY);
                const brands = (_a = data === null || data === void 0 ? void 0 : data.brands) !== null && _a !== void 0 ? _a : [];
                return brands
                    .map((b) => {
                    var _a, _b;
                    return ({
                        id: b.id,
                        title: b.title,
                        baseline: b.baseline,
                        description: b.description,
                        websiteUrl: b.websiteUrl,
                        liveStream: b.liveStream,
                        playerUrl: b.playerUrl,
                        webRadios: (_a = b.webRadios) !== null && _a !== void 0 ? _a : [],
                        localRadios: (_b = b.localRadios) !== null && _b !== void 0 ? _b : []
                    });
                })
                    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            }
            catch (error) {
                console.error("[BrandsRepository] Failed to fetch brands:", error);
                throw error;
            }
        });
    }
}
exports.BrandsRepository = BrandsRepository;
//# sourceMappingURL=brandsRepository.js.map