"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toShowDto = void 0;
const toPersonalityDto = (raw) => {
    var _a, _b;
    return ({
        id: (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : "",
        name: (_b = raw === null || raw === void 0 ? void 0 : raw.name) !== null && _b !== void 0 ? _b : ""
    });
};
const toDiffusionDto = (raw) => {
    var _a, _b, _c, _d;
    return ({
        title: (_a = raw === null || raw === void 0 ? void 0 : raw.title) !== null && _a !== void 0 ? _a : "",
        url: (_b = raw === null || raw === void 0 ? void 0 : raw.url) !== null && _b !== void 0 ? _b : "",
        personalities: ((_d = (_c = raw === null || raw === void 0 ? void 0 : raw.personalitiesConnection) === null || _c === void 0 ? void 0 : _c.edges) !== null && _d !== void 0 ? _d : []).map((edge) => toPersonalityDto(edge === null || edge === void 0 ? void 0 : edge.node))
    });
};
const toTaxonomyDto = (raw) => {
    var _a, _b, _c, _d, _e;
    return ({
        id: (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : "",
        path: (_b = raw === null || raw === void 0 ? void 0 : raw.path) !== null && _b !== void 0 ? _b : "",
        type: (_c = raw === null || raw === void 0 ? void 0 : raw.type) !== null && _c !== void 0 ? _c : "",
        title: (_d = raw === null || raw === void 0 ? void 0 : raw.title) !== null && _d !== void 0 ? _d : "",
        standFirst: (_e = raw === null || raw === void 0 ? void 0 : raw.standFirst) !== null && _e !== void 0 ? _e : ""
    });
};
const toShowDto = (showNode) => {
    var _a, _b, _c, _d, _e, _f;
    return ({
        id: (_a = showNode.id) !== null && _a !== void 0 ? _a : "",
        title: (_b = showNode.title) !== null && _b !== void 0 ? _b : "",
        diffusions: ((_d = (_c = showNode.diffusionsConnection) === null || _c === void 0 ? void 0 : _c.edges) !== null && _d !== void 0 ? _d : []).map((edge) => toDiffusionDto(edge === null || edge === void 0 ? void 0 : edge.node)),
        taxonomies: ((_f = (_e = showNode.taxonomiesConnection) === null || _e === void 0 ? void 0 : _e.edges) !== null && _f !== void 0 ? _f : []).map((edge) => toTaxonomyDto(edge === null || edge === void 0 ? void 0 : edge.node))
    });
};
exports.toShowDto = toShowDto;
//# sourceMappingURL=showMapper.js.map