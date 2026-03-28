import express, { Express, Request, Response } from "express";
import apiRoutes from "./routes/apiRoutes";

export function createApp(): Express {
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

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
    app.use("/api", apiRoutes);

    // Health check endpoint racine
    app.get("/", (req: Request, res: Response) => {
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
    app.use((req: Request, res: Response) => {
        res.status(404).json({
            success: false,
            error: "Route not found",
            path: req.path
        });
    });

    return app;
}

