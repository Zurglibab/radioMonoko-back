import express from 'express';
import userRouter from './modules/user/user.routes';

export function createApp() {

    const app = express();


    app.use(express.json());
    app.use('/user', userRouter);

    app.use((req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });

    return app;
}