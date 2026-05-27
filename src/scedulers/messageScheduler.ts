import cron from 'node-cron';
import logger from '../config/logger';

export class MessageScheduler {
    start() {
        cron.schedule('0 * * * *', async () => {
            logger.info('[Scheduler] Messages: aucune tâche à exécuter (persisté en PostgreSQL).');
        });
    }
}
