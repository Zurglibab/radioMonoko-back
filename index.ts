import {createApp} from "./src/app";
import {config} from 'dotenv';
import { initializeDatabase } from './src/database/db';

config();

const app = createApp();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port 'http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Impossible de démarrer le serveur:', error);
        process.exit(1);
    }
};

startServer();
