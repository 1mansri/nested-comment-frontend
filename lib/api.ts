// API utilities for backend integration

import type {
  User,
  Post,
  Comment,
  CreateUserRequest,
  CreatePostRequest,
  CreateCommentRequest,
  GetCommentsRequest,
  GetRepliesRequest,
  UpvoteCommentRequest,
  DeleteCommentRequest,
  DeletePostRequest,
  ApiError,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      // Check if response has content
      const contentType = response.headers.get("content-type");
      const hasJson = contentType && contentType.includes("application/json");

      // If no content or not JSON, handle appropriately
      if (!hasJson) {
        if (!response.ok) {
          throw new Error(
            `Backend error: ${response.status} ${response.statusText}. Is the backend server running at ${API_BASE_URL}?`
          );
        }
        throw new Error(
          `Invalid response from backend. Expected JSON but got ${contentType}. Is the backend server running at ${API_BASE_URL}?`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "An error occurred");
      }

      return data as T;
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error(
          `Backend connection failed. Please ensure the backend server is running at ${API_BASE_URL}`
        );
      }
      throw err;
    }
  }

  // User Management
  async createUser(data: CreateUserRequest): Promise<User> {
    return this.request<User>("/create-user", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUser(clerk_user_id: string): Promise<User> {
    return this.request<User>("/get-user", {
      method: "POST",
      body: JSON.stringify({ clerk_user_id }),
    });
  }

  // Get user by database ID
  async getUserById(id: string): Promise<User> {
    return this.request<User>("/get-user", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  }

  // Post Management
  async createPost(data: CreatePostRequest): Promise<Post> {
    return this.request<Post>("/create-post", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRecentPosts(): Promise<Post[]> {
    return this.request<Post[]>("/get-recent-post", {
      method: "GET",
    });
  }

  async getUserPosts(author_id: string): Promise<Post[]> {
    return this.request<Post[]>("/get-user-post", {
      method: "POST",
      body: JSON.stringify({ author_id }),
    });
  }

  async deletePost(
    data: DeletePostRequest
  ): Promise<{ message: string; post_id: string }> {
    return this.request("/delete-post", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Comment Management
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    return this.request<Comment>("/create-comment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPostComments(data: GetCommentsRequest): Promise<Comment[]> {
    return this.request<Comment[]>("/get-post-comments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCommentReplies(data: GetRepliesRequest): Promise<Comment[]> {
    return this.request<Comment[]>("/get-comment-reply", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async upvoteComment(data: UpvoteCommentRequest): Promise<{
    comment_id: string;
    upvotes: number;
    message: string;
  }> {
    return this.request("/upvote-comment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteComment(data: DeleteCommentRequest): Promise<{
    message: string;
    comment_id: string;
  }> {
    return this.request("/delete-comment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
