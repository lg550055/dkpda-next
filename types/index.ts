export type User = {
  id: number;
  email: string;
  is_admin: boolean;
  created_at: string;
};

export type Article = {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  author_id: number;
  category: string; // e.g., "grift"
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  user_vote?: "upvote" | "downvote" | null;
};

export type Category = "crony" | "nonsense" | "ai-please-save-us" | "grift" | "graft";