import express from 'express';
import userRouter from './modules/user/user.routes';
import expressWinston from 'express-winston';
import logger from './config/logger';
import userRelationRouter from "./modules/userRelation/userRelation.routes";

export function createApp() {

    const app = express();

    app.use(expressWinston.logger({
        winstonInstance: logger,
        msg: "HTTP {{req.method}} : {{req.url}}",
        expressFormat: true,
        colorize: true,
        meta: false,
    }));

    console.log("app.use");
    app.use(express.json());
    app.use('/user', userRouter);
    app.use('/userRelation', userRelationRouter);

    app.use(expressWinston.errorLogger({
        winstonInstance: logger
    }));

    app.use((req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });

    return app;
}