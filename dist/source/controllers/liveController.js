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
exports.getLiveByStation = getLiveByStation;
const stationsEnum_1 = require("../Enums/stationsEnum");
const liveServices_1 = require("../Services/liveServices");
function getLiveByStation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const { station } = req.params;
            if (!Object.values(stationsEnum_1.StationsEnum).includes(station)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid station. Valid stations: ${Object.values(stationsEnum_1.StationsEnum).join(", ")}`
                });
            }
            const live = yield liveServices_1.liveApiService.getLive(station);
            return res.status(200).json({
                success: true,
                station,
                data: live
            });
        }
        catch (error) {
            console.error("[liveController] getLiveByStation failed:", error);
            return res.status((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500).json({
                success: false,
                error: (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Failed to fetch live",
                details: (_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) !== null && _e !== void 0 ? _e : null
            });
        }
    });
}
//# sourceMappingURL=liveController.js.map