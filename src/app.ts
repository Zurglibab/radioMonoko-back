import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/apiRoutes";
import { swaggerSpec } from "./config/swagger";
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import passport from './config/passport';
import { authMiddleware } from './middlewares/auth.middleware';
import { adminMiddleware } from './middlewares/admin.middleware';
import adminRouter from './routes/adminRoutes';
import expressWinston from 'express-winston';
import logger from './config/logger';
import userRelationRouter from "./routes/userRelationRoutes";
import { createContentRouter } from './routes/contentRoutes';
import { createCollectionsRouter } from './routes/collectionsRoutes';
import { createCollectionItemsRouter } from './routes/collectionItemsRoutes';
import { createRatingContentRouter } from './routes/ratingContentRoutes';
import { createReviewRouter } from './routes/reviewRoutes';
import { createLikeReviewRouter } from './routes/likeReviewRoutes';
import { createNotificationRouter } from './routes/notificationRoutes';
import reportUsersRouter from './routes/reportUsersRoutes';


export function createApp(): Express {
  const app = express();


  app.use(expressWinston.logger({
    winstonInstance: logger,
    msg: "HTTP {{req.method}} : {{req.url}}",
    expressFormat: true,
    colorize: true,
    meta: false
  }));

  console.log("app.use");
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use((req, _res, next) => {
    if (req.headers['content-type']?.includes('application/json') && typeof req.body === 'string') {
      try {req.body = JSON.parse(req.body);} catch {}
    }
    next();
  });


  // CORS middleware: allow configurable origin via environment variable
  app.use((req, res, next) => {
    const allowedOrigin = process.env.CORS_ORIGIN || '*';

    // In production, set CORS_ORIGIN to a specific origin (ex: https://yourdomain.tld)
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use('/user', userRouter);
  app.use('/userRelation', userRelationRouter);
  app.use('/content', createContentRouter());
  app.use('/collections', createCollectionsRouter());
  app.use('/collectionItems', createCollectionItemsRouter());
  app.use('/ratingContent', createRatingContentRouter());
  app.use('/review', createReviewRouter());
  app.use('/review', createLikeReviewRouter());

  app.use('/notifications', createNotificationRouter());

  app.use('/reports', reportUsersRouter);

  app.use(expressWinston.errorLogger({
    winstonInstance: logger
  }));


  app.use(passport.initialize());


  app.use('/auth', authRouter);


  app.use('/admin', authMiddleware, adminMiddleware, adminRouter);



  app.use("/api", apiRoutes);


  app.get("/api/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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


  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
      path: req.path
    });
  });

  return app;
}