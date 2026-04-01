import {Pool, PoolClient} from 'pg';
import {config} from 'dotenv';
import logger from '../config/logger';

config();

export const pool = new Pool({
    host: process.env.DB_HOST || process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

export const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
        await createUserTable(client);
        await createUserRelationTable(client);
        await createContentTable(client);
        await createCollectionsTable(client);
        await createCollectionItemsTable(client);
        logger.info('Database initialized successfully.');
    } catch (error) {
        logger.warn('Error initializing database:', error);
        throw error;
    } finally {
        client.release();
    }
};

async function createUserTable(client: PoolClient) {
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
                privacy VARCHAR(50) DEFAULT 'public',
                is_banned BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
    logger.info("Table 'users' created successfully.")
}

async function createUserRelationTable(client: PoolClient) {
    await client.query(`
            CREATE TABLE IF NOT EXISTS user_relations (
                followed_id INTEGER NOT NULL,
                follower_id INTEGER NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused', 'blocked')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (followed_id, follower_id)
            )
        `);
    logger.info("Table 'UserRelation' created successfully.")
}

async function createContentTable(client: PoolClient) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS content (
            id UUID PRIMARY KEY,
            api_id VARCHAR(255) UNIQUE NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            content_type VARCHAR(50) NOT NULL
                CHECK (content_type IN ('show', 'diffusion', 'live', 'podcast', 'article', 'other')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `);
    logger.info("Table 'content' created successfully.");
}

async function createCollectionsTable(client: PoolClient) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS collections (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            is_public BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    logger.info("Table 'collections' created successfully.");
}

async function createCollectionItemsTable(client: PoolClient) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS collection_items (
            collection_id UUID NOT NULL,
            content_id UUID NOT NULL,
            position INTEGER DEFAULT 0,
            note TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (collection_id, content_id),
            FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )
    `);
    logger.info("Table 'collection_items' created successfully.");
}