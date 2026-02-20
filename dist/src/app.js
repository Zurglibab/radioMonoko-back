"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });
    return app;
}
//# sourceMappingURL=app.js.map