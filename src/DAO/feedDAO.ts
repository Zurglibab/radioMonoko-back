import { pool } from '../database/db';
import { FeedItem } from '../interfaces/feedInterface';
interface FeedRow {
  activity_id: string;
  activity_type: FeedItem['type'];
  created_at: Date;
  actor_id: string;
  actor_username: string;
  actor_avatar: string | null;
  collection_id: string | null;
  collection_name: string | null;
  content_id: string | null;
  content_title: string | null;
  comment: string | null;
  note: string | null;
  source_review_id: string | null;
}
export class FeedDAO {
  async findByFollowedUserIds(followedUserIds: string[], limit: number): Promise<FeedItem[]> {
    if (!followedUserIds.length) {
      return [];
    }
    const { rows } = await pool.query<FeedRow>(
      `WITH followed_users AS (
                SELECT user_id
                FROM (
                    SELECT DISTINCT UNNEST($1::uuid[]) AS user_id
                ) distinct_followed
                ORDER BY RANDOM()
                LIMIT 50
            ),
            activities AS (
                SELECT
                    CONCAT('collection:', ci.collection_id, ':', ci.content_id) AS activity_id,
                    'collection_item_added'::text AS activity_type,
                    ci.created_at AS created_at,
                    u.id AS actor_id,
                    u.username AS actor_username,
                    u.avatar AS actor_avatar,
                    c.id AS collection_id,
                    c.name AS collection_name,
                    ct.id AS content_id,
                    ct.title AS content_title,
                    NULL::text AS comment,
                    ci.note AS note,
                    NULL::uuid AS source_review_id
                FROM collection_items ci
                INNER JOIN collections c ON c.id = ci.collection_id AND c.is_public = true
                INNER JOIN users u ON u.id = c.user_id
                LEFT JOIN content ct ON ct.id = ci.content_id
                INNER JOIN followed_users fu ON fu.user_id = c.user_id
                UNION ALL
                SELECT
                    CONCAT('like:', lr.review_id, ':', lr.user_id) AS activity_id,
                    'content_liked'::text AS activity_type,
                    lr.created_at AS created_at,
                    u.id AS actor_id,
                    u.username AS actor_username,
                    u.avatar AS actor_avatar,
                    NULL::uuid AS collection_id,
                    NULL::text AS collection_name,
                    r.content_id AS content_id,
                    ct.title AS content_title,
                    NULL::text AS comment,
                    NULL::text AS note,
                    lr.review_id AS source_review_id
                FROM like_review lr
                INNER JOIN reviews r ON r.id = lr.review_id
                INNER JOIN users u ON u.id = lr.user_id
                LEFT JOIN content ct ON ct.id = r.content_id
                INNER JOIN followed_users fu ON fu.user_id = lr.user_id
                WHERE lr.is_like = true
                UNION ALL
                SELECT
                    CONCAT('comment:', r.id) AS activity_id,
                    'comment_posted'::text AS activity_type,
                    r.created_at AS created_at,
                    u.id AS actor_id,
                    u.username AS actor_username,
                    u.avatar AS actor_avatar,
                    NULL::uuid AS collection_id,
                    NULL::text AS collection_name,
                    r.content_id AS content_id,
                    ct.title AS content_title,
                    r.comment AS comment,
                    NULL::text AS note,
                    r.id AS source_review_id
                FROM reviews r
                INNER JOIN users u ON u.id = r.user_id
                LEFT JOIN content ct ON ct.id = r.content_id
                INNER JOIN followed_users fu ON fu.user_id = r.user_id
                WHERE COALESCE(NULLIF(BTRIM(r.comment), ''), '') <> ''
            ),
            ranked_activities AS (
                SELECT
                    activities.*,
                    ROW_NUMBER() OVER (PARTITION BY actor_id ORDER BY created_at DESC) AS activity_rank
                FROM activities
            )
            SELECT
                activity_id,
                activity_type,
                created_at,
                actor_id,
                actor_username,
                actor_avatar,
                collection_id,
                collection_name,
                content_id,
                content_title,
                comment,
                note,
                source_review_id
            FROM ranked_activities
            WHERE activity_rank <= 5
            ORDER BY created_at DESC
            LIMIT $2`,
      [followedUserIds, limit]
    );
    return rows.map((row) => ({
      id: row.activity_id,
      type: row.activity_type,
      created_at: row.created_at.toISOString(),
      actor: {
        id: row.actor_id,
        username: row.actor_username,
        avatar: row.actor_avatar
      },
      collection: row.collection_id ? { id: row.collection_id, name: row.collection_name ?? '' } : null,
      content: row.content_id ? { id: row.content_id, title: row.content_title } : null,
      comment: row.comment,
      note: row.note,
      source_review_id: row.source_review_id
    }));
  }
}
export const feedDAO = new FeedDAO();