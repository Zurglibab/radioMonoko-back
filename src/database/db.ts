import { Pool, PoolClient } from 'pg';
import { config } from 'dotenv';
import logger from '../config/logger';
import { DEFAULT_COLLECTION_STATUS } from '../enums/collectionStatusEnum';

config({ override: true });

export const pool = new Pool({
  host: process.env.DB_HOST || process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    const isTestEnvironment = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
    if (isTestEnvironment) {
      await createUserTable(client);
      await createUserRelationTable(client);
      await createContentTable(client);
      await createCollectionsTable(client);
      await createCollectionItemsTable(client);
      await createRatingContentTable(client);
      await createReviewTable(client);
      await createLikeReviewTable(client);
      await createNotificationTable(client);
      await createReportUsersTable(client);
      logger.info('Database initialized successfully (test mode).');
    } else {
      logger.info('Skipping inline DDL on startup. Run migrations found in /migrations (recommended tool: node-pg-migrate or similar).');
    }
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
                role VARCHAR(255) DEFAULT 'user',  
                is_banned BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
  logger.info("Table 'users' created successfully.");
}

async function createUserRelationTable(client: PoolClient) {
  await client.query(`
            CREATE TABLE IF NOT EXISTS user_relations (
                followed_id UUID NOT NULL,
                follower_id UUID NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused', 'blocked')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (followed_id, follower_id)
            )
        `);
  logger.info("Table 'UserRelation' created successfully.");
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
  const collectionStatusColumn = `status VARCHAR(50) NOT NULL DEFAULT '${DEFAULT_COLLECTION_STATUS}'`;
  const collectionStatusCheck = `CHECK (status IN ('à voir', 'en cours', 'terminé', 'abandonné'))`;

  await client.query(`
        CREATE TABLE IF NOT EXISTS collections (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            is_public BOOLEAN DEFAULT true,
            ${collectionStatusColumn} ${collectionStatusCheck},
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

  await ensureCollectionStatusColumn(client, collectionStatusColumn, collectionStatusCheck);

  logger.info("Table 'collections' created successfully.");
}

async function ensureCollectionStatusColumn(client: PoolClient, columnDefinition: string, checkConstraint: string) {
  await client.query(`
        ALTER TABLE collections
        ADD COLUMN IF NOT EXISTS ${columnDefinition}
    `);

  await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'collections_status_check'
            ) THEN
                ALTER TABLE collections
                ADD CONSTRAINT collections_status_check ${checkConstraint};
            END IF;
        END $$;
    `);
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

async function createRatingContentTable(client: PoolClient) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS rating_content (
            content_id UUID NOT NULL,
            user_id UUID NOT NULL,
            average_rating NUMERIC(3, 2) DEFAULT 0,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            PRIMARY KEY (content_id, user_id)
        )
    `);
  logger.info("Table 'rating_content' created successfully.");
}

async function createReviewTable(client: PoolClient) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            content_id UUID NOT NULL,
            parent_review_id UUID,
            comment TEXT,
            is_featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_review_id) REFERENCES reviews(id) ON DELETE CASCADE
        )
    `);
  logger.info("Table 'reviews' created successfully.");
}

async function createLikeReviewTable(client: PoolClient) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS like_review (
            review_id UUID NOT NULL,
            user_id UUID NOT NULL,
            is_like BOOLEAN NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (review_id, user_id),
            FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
  logger.info("Table 'like_review' created successfully.");
}

async function createNotificationTable(client: PoolClient) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CHECK (type <> '')
        )
    `);

  await client.query(`
        CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
        ON notifications (user_id, created_at DESC)
    `);

  await client.query(`
        CREATE INDEX IF NOT EXISTS idx_notifications_unread
        ON notifications (user_id, is_read)
        WHERE is_read = false
    `);

  logger.info("Table 'notifications' created successfully.");
}

async function createReportUsersTable(client: PoolClient) {
  await client.query(`
            CREATE TABLE IF NOT EXISTS report_users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                reporter_id UUID NOT NULL,
                reported_user_id UUID NOT NULL,
                report_type VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

  await client.query(`
            CREATE INDEX IF NOT EXISTS idx_report_users_reported_user
            ON report_users (reported_user_id)
        `);

  logger.info("Table 'report_users' created successfully.");
}