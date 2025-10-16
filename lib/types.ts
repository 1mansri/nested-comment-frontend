// Type definitions based on backend API

export interface User {
  id: string;
  clerk_user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: "user" | "admin";
  is_deleted: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  author_id: string;
  is_deleted: boolean;
  created_at: string;
  author?: User; // Populated in frontend
}

export interface Comment {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  user_id: string;
  text: string;
  upvotes: number;
  is_deleted: boolean;
  created_at: string;
  user?: User; // Populated in frontend
  replies?: Comment[]; // For nested structure
  reply_count?: number; // For UI
  hasUpvoted?: boolean; // User's upvote status
}

export type SortOption = "upvotes" | "created_at" | "oldest";

export interface ApiError {
  error: string;
}

export interface CreateUserRequest {
  name: string;
  clerk_user_id: string;
  email: string;
  avatar_url?: string;
}

export interface CreatePostRequest {
  title: string;
  author_id: string;
  body: string;
  image_url?: string;
}

export interface CreateCommentRequest {
  post_id: string;
  parent_comment_id: string | null;
  user_id: string;
  text: string;
}

export interface GetCommentsRequest {
  post_id: string;
  sort_by?: SortOption;
}

export interface GetRepliesRequest {
  post_id: string;
  parent_comment_id: string;
  sort_by?: SortOption;
}

export interface UpvoteCommentRequest {
  comment_id: string;
  user_id: string;
}

export interface DeleteCommentRequest {
  comment_id: string;
  user_id: string;
}

export interface DeletePostRequest {
  post_id: string;
  user_id: string;
}
