import express from 'express';
import userRouter from './modules/user/user.routes';
import expressWinston from 'express-winston';
import logger from './config/logger';

export function createApp() {

    const app = express();

    app.use(expressWinston.logger({
        winstonInstance: logger,
        msg: "HTTP {{req.method}}",
        expressFormat: true,
        colorize: true,
        meta: false,
    }));

    app.use(express.json());
    app.use('/user', userRouter);

    app.use(expressWinston.errorLogger({
        winstonInstance: logger
    }));

    app.use((req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });

    return app;
}