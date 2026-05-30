import { disconnect } from '../config/RedisConnexion';
import { pool } from '../database/db';
import {logger} from "bs-logger";

afterAll(async () => {
  try {
    await disconnect();
  } catch (err) {
    logger.error(err);
  }

  try {
    await pool.end();
  } catch (err) {
    logger.error(err);
  }
});

