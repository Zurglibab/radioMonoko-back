export interface UserRelation {
    followed_id: string;
    follower_id: string;
    status: 'pending' | 'accepted' | 'refused' | 'blocked';
    created_at: Date;
    updated_at: Date;
}
