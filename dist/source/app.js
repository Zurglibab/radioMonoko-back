"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
const swagger_1 = require("./Config/swagger");
function createApp() {
    const app = (0, express_1.default)();
    // Middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // CORS (optionnel, à adapter selon tes besoins)
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next();
    });
    // Routes
    app.use("/api", apiRoutes_1.default);
    // Swagger docs
    app.get("/api/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swagger_1.swaggerSpec);
    });
    app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    // Health check endpoint racine
    app.get("/", (req, res) => {
        res.status(200).json({
            message: "RadioMonoko Backend API",
            version: "1.0.0",
            endpoints: {
                health: "GET /api/health",
                brands: {
                    getAll: "GET /api/brands",
                    getById: "GET /api/brands/:id",
                    search: "GET /api/brands/search/:title",
                    refresh: "POST /api/brands/refresh"
                },
                stats: {
                    count: "GET /api/brands/stats/count"
                },
                cache: {
                    clear: "DELETE /api/brands/cache"
                }
            }
        });
    });
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: "Route not found",
            path: req.path
        });
    });
    return app;
}
//# sourceMappingURL=app.js.map