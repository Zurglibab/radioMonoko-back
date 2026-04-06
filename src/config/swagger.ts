import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

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
        { name: "Diffusions", description: "Gestion des diffusions" },
        { name: "RatingContent", description: "Notation des contenus" },
        { name: "Collections", description: "Gestion des collections" },
        { name: "CollectionItems", description: "Gestion des elements de collections" },
        { name: "Content", description: "Gestion des contenus" },
        { name: "Review", description: "Gestion des reviews" },
        { name: "LikeReview", description: "Gestion des likes/dislikes des reviews" }
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

const isProduction = process.env.NODE_ENV === "production";

export const swaggerSpec = swaggerJSDoc({
    definition: swaggerDefinition,
    apis: isProduction
        ? [
            path.resolve(process.cwd(), "dist/src/routes/*.js"),
            path.resolve(process.cwd(), "dist/src/modules/**/*.js")
        ]
        : [
            path.resolve(process.cwd(), "src/routes/*.ts"),
            path.resolve(process.cwd(), "src/modules/**/*.ts")
        ]
});
