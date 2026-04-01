"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toShowDto = toShowDto;
function toShowDto(showNode) {
    var _a, _b, _c, _d;
    return {
        id: showNode.id,
        title: showNode.title,
        diffusions: ((_b = (_a = showNode.diffusionsConnection) === null || _a === void 0 ? void 0 : _a.edges) !== null && _b !== void 0 ? _b : []).map((edge) => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                title: (_b = (_a = edge.node) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "",
                url: (_d = (_c = edge.node) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : "",
                personalities: ((_g = (_f = (_e = edge.node) === null || _e === void 0 ? void 0 : _e.personalitiesConnection) === null || _f === void 0 ? void 0 : _f.edges) !== null && _g !== void 0 ? _g : []).map((pEdge) => {
                    var _a, _b, _c, _d;
                    return ({
                        id: (_b = (_a = pEdge.node) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "",
                        name: (_d = (_c = pEdge.node) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : ""
                    });
                })
            });
        }),
        taxonomies: ((_d = (_c = showNode.taxonomiesConnection) === null || _c === void 0 ? void 0 : _c.edges) !== null && _d !== void 0 ? _d : []).map((edge) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return ({
                id: (_b = (_a = edge.node) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "",
                path: (_d = (_c = edge.node) === null || _c === void 0 ? void 0 : _c.path) !== null && _d !== void 0 ? _d : "",
                type: (_f = (_e = edge.node) === null || _e === void 0 ? void 0 : _e.type) !== null && _f !== void 0 ? _f : "",
                title: (_h = (_g = edge.node) === null || _g === void 0 ? void 0 : _g.title) !== null && _h !== void 0 ? _h : "",
                standFirst: (_k = (_j = edge.node) === null || _j === void 0 ? void 0 : _j.standFirst) !== null && _k !== void 0 ? _k : ""
            });
        })
    };
}
//# sourceMappingURL=showDTO.js.map