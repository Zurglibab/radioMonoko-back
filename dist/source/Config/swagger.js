"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "RadioMonoko Backend API",
        version: "1.0.0",
        description: "Documentation OpenAPI des endpoints RadioMonoko"
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local"
        }
    ],
    tags: [
        { name: "Health", description: "Etat de l'API" },
        { name: "Brands", description: "Gestion des brands" },
        { name: "Shows", description: "Gestion des shows" },
        { name: "Diffusions", description: "Gestion des diffusions" }
    ],
    components: {
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string", example: "Request failed" },
                    details: { type: "object", nullable: true }
                }
            },
            HealthResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "API is healthy" }
                }
            }
        }
    }
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: swaggerDefinition,
    apis: ["./source/routes/*.ts"]
});
//# sourceMappingURL=swagger.js.map