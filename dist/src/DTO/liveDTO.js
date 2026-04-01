"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLiveStepDto = toLiveStepDto;
exports.toLiveSongDto = toLiveSongDto;
exports.toLiveDto = toLiveDto;
function toPodcastEpisodeDto(raw) {
    var _a, _b, _c, _d, _e, _f;
    return {
        id: (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : "",
        title: (_b = raw === null || raw === void 0 ? void 0 : raw.title) !== null && _b !== void 0 ? _b : "",
        url: (_c = raw === null || raw === void 0 ? void 0 : raw.url) !== null && _c !== void 0 ? _c : undefined,
        playerUrl: (_d = raw === null || raw === void 0 ? void 0 : raw.playerUrl) !== null && _d !== void 0 ? _d : undefined,
        created: (_e = raw === null || raw === void 0 ? void 0 : raw.created) !== null && _e !== void 0 ? _e : undefined,
        duration: (_f = raw === null || raw === void 0 ? void 0 : raw.duration) !== null && _f !== void 0 ? _f : undefined
    };
}
function toLiveDiffusionDto(raw) {
    var _a, _b, _c, _d, _e;
    return {
        id: (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : "",
        title: (_b = raw === null || raw === void 0 ? void 0 : raw.title) !== null && _b !== void 0 ? _b : "",
        standFirst: (_c = raw === null || raw === void 0 ? void 0 : raw.standFirst) !== null && _c !== void 0 ? _c : undefined,
        url: (_d = raw === null || raw === void 0 ? void 0 : raw.url) !== null && _d !== void 0 ? _d : undefined,
        publishedDate: (_e = raw === null || raw === void 0 ? void 0 : raw.published_date) !== null && _e !== void 0 ? _e : undefined,
        podcastEpisode: (raw === null || raw === void 0 ? void 0 : raw.podcastEpisode) ? toPodcastEpisodeDto(raw.podcastEpisode) : undefined
    };
}
function toLiveStepDto(raw) {
    var _a, _b, _c;
    if (!raw) {
        return undefined;
    }
    const typename = raw === null || raw === void 0 ? void 0 : raw.__typename;
    if (typename === "DiffusionStep") {
        return {
            id: (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : "",
            type: "DiffusionStep",
            diffusion: (raw === null || raw === void 0 ? void 0 : raw.diffusion) ? toLiveDiffusionDto(raw.diffusion) : undefined
        };
    }
    return {
        id: (_b = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _b !== void 0 ? _b : "",
        type: "BlankStep",
        title: (_c = raw === null || raw === void 0 ? void 0 : raw.title) !== null && _c !== void 0 ? _c : undefined
    };
}
function toLiveSongDto(raw) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (!raw) {
        return undefined;
    }
    return {
        id: (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : "",
        start: (_b = raw === null || raw === void 0 ? void 0 : raw.start) !== null && _b !== void 0 ? _b : undefined,
        end: (_c = raw === null || raw === void 0 ? void 0 : raw.end) !== null && _c !== void 0 ? _c : undefined,
        track: (raw === null || raw === void 0 ? void 0 : raw.track)
            ? {
                id: (_e = (_d = raw.track) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : "",
                title: (_g = (_f = raw.track) === null || _f === void 0 ? void 0 : _f.title) !== null && _g !== void 0 ? _g : "",
                albumTitle: (_j = (_h = raw.track) === null || _h === void 0 ? void 0 : _h.albumTitle) !== null && _j !== void 0 ? _j : undefined,
                discNumber: (_l = (_k = raw.track) === null || _k === void 0 ? void 0 : _k.discNumber) !== null && _l !== void 0 ? _l : undefined,
                trackNumber: (_o = (_m = raw.track) === null || _m === void 0 ? void 0 : _m.trackNumber) !== null && _o !== void 0 ? _o : undefined
            }
            : undefined
    };
}
function toLiveDto(raw) {
    return {
        show: toLiveStepDto(raw === null || raw === void 0 ? void 0 : raw.show),
        program: toLiveStepDto(raw === null || raw === void 0 ? void 0 : raw.program),
        song: toLiveSongDto(raw === null || raw === void 0 ? void 0 : raw.song)
    };
}
//# sourceMappingURL=liveDTO.js.map