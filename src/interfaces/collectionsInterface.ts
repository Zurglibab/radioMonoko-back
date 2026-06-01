export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public: boolean;
  status: string;
  created_at: Date;
}