"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDiffusionDto = toDiffusionDto;
function toDiffusionDto(raw) {
    var _a, _b, _c, _d, _e, _f, _g;
    const taxonomyEdges = (_b = (_a = raw === null || raw === void 0 ? void 0 : raw.taxonomiesConnection) === null || _a === void 0 ? void 0 : _a.edges) !== null && _b !== void 0 ? _b : [];
    return {
        id: (_c = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _c !== void 0 ? _c : "",
        title: (_d = raw === null || raw === void 0 ? void 0 : raw.title) !== null && _d !== void 0 ? _d : "",
        standFirst: (_e = raw === null || raw === void 0 ? void 0 : raw.standFirst) !== null && _e !== void 0 ? _e : undefined,
        url: (_f = raw === null || raw === void 0 ? void 0 : raw.url) !== null && _f !== void 0 ? _f : undefined,
        publishedDate: (_g = raw === null || raw === void 0 ? void 0 : raw.published_date) !== null && _g !== void 0 ? _g : undefined,
        taxonomies: taxonomyEdges
            .map((edge) => edge === null || edge === void 0 ? void 0 : edge.node)
            .filter((node) => !!node)
            .map((node) => {
            var _a, _b, _c;
            return ({
                id: (_a = node === null || node === void 0 ? void 0 : node.id) !== null && _a !== void 0 ? _a : "",
                path: (_b = node === null || node === void 0 ? void 0 : node.path) !== null && _b !== void 0 ? _b : "",
                title: (_c = node === null || node === void 0 ? void 0 : node.title) !== null && _c !== void 0 ? _c : ""
            });
        })
    };
}
//# sourceMappingURL=diffusionDTO.js.map