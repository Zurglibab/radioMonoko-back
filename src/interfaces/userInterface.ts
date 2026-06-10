export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  display_name: string;
  avatar: string;
  bio: string;
  website: string;
  privacy: string;
  is_banned: boolean;
  role?: string;
  notifications_email?: boolean;
  created_at: Date;
  updated_at: Date;
}