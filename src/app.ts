import express from 'express';

export function createApp() {

    const app = express();

    app.use(express.json());

    app.use((req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });

    return app;
}