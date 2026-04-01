import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/apiRoutes";
import { swaggerSpec } from "./config/swagger";
import userRouter from './modules/user/user.routes';
import expressWinston from 'express-winston';
import logger from './config/logger';
import userRelationRouter from "./modules/userRelation/userRelation.routes";

export function createApp(): Express {
    const app = express();

    // Middleware
    app.use(expressWinston.logger({
        winstonInstance: logger,
        msg: "HTTP {{req.method}} : {{req.url}}",
        expressFormat: true,
        colorize: true,
        meta: false,
    }));

    console.log("app.use");
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

    app.use('/user', userRouter);
    app.use('/userRelation', userRelationRouter);

    app.use(expressWinston.errorLogger({
        winstonInstance: logger
    }));


    // Routes
    app.use("/api", apiRoutes);

    // Swagger docs
    app.get("/api/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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