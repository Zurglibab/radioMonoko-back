import { Pool } from 'pg';
import {config} from 'dotenv';

config();

export const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    });

export const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                username VARCHAR(255) UNIQUE,
                display_name VARCHAR(255),
                avatar VARCHAR(255),
                bio TEXT,
                website VARCHAR(255),
                is_banned BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('La table "users" a été vérifiée/créée avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la table "users":', error);
        throw error;
    } finally {
        client.release();
    }
};
