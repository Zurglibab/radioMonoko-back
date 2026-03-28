"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBrandDto = toBrandDto;
function toBrandDto(entity) {
    var _a, _b;
    return Object.assign(Object.assign({}, entity), { webRadios: (_a = entity.webRadios) !== null && _a !== void 0 ? _a : [], localRadios: (_b = entity.localRadios) !== null && _b !== void 0 ? _b : [] });
}
//# sourceMappingURL=BrandDto.js.map