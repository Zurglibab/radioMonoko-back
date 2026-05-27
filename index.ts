import { createApp } from "./src/app";
import { config } from 'dotenv';
import { initializeDatabase } from './src/database/db';
import { startBrandsScheduler } from "./src/scedulers/brandsScheduler";
import { setupWebSockets } from "./src/websockets/message.socket";
import { setIO } from './src/websockets/socketRegistry';
import { MessageScheduler } from "./src/scedulers/messageScheduler";
import { connect as connectRedis } from './src/config/RedisConnexion';
import http from 'http';

config();

const app = createApp();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await initializeDatabase();
    await connectRedis();

        const io = await setupWebSockets(server);
        setIO(io);

        startBrandsScheduler();

        // Lancer le scheduler des messages
        const messageScheduler = new MessageScheduler();
        messageScheduler.start();

        server.listen(PORT, () => {
      console.log(`Server is running on port 'http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

startServer();