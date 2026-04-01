"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSortedBrandDtos = exports.toBrandDto = void 0;
const toBrandDto = (brand) => {
    var _a, _b;
    return ({
        id: brand.id,
        title: brand.title,
        baseline: brand.baseline,
        description: brand.description,
        websiteUrl: brand.websiteUrl,
        liveStream: brand.liveStream,
        playerUrl: brand.playerUrl,
        webRadios: (_a = brand.webRadios) !== null && _a !== void 0 ? _a : [],
        localRadios: (_b = brand.localRadios) !== null && _b !== void 0 ? _b : []
    });
};
exports.toBrandDto = toBrandDto;
const toSortedBrandDtos = (brands) => brands
    .map(exports.toBrandDto)
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
exports.toSortedBrandDtos = toSortedBrandDtos;
//# sourceMappingURL=brandMapper.js.map