// User cache to avoid refetching user data
// This is a workaround since the backend doesn't populate user details in posts/comments

import type { User } from "./types";

class UserCache {
  private cache: Map<string, User> = new Map(); // userId -> User
  private clerkIdToDbId: Map<string, string> = new Map(); // clerkUserId -> userId
  private fetchPromises: Map<string, Promise<User>> = new Map();

  set(userId: string, user: User) {
    this.cache.set(userId, user);
    // Also map clerk_user_id to database id for reverse lookup
    if (user.clerk_user_id) {
      this.clerkIdToDbId.set(user.clerk_user_id, userId);
    }
  }

  get(userId: string): User | undefined {
    return this.cache.get(userId);
  }

  has(userId: string): boolean {
    return this.cache.has(userId);
  }

  // Get user by clerk ID
  getByClerkId(clerkUserId: string): User | undefined {
    const dbId = this.clerkIdToDbId.get(clerkUserId);
    if (dbId) {
      return this.cache.get(dbId);
    }
    return undefined;
  }

  // Get or create a placeholder user
  getOrPlaceholder(userId: string): User {
    const cached = this.cache.get(userId);
    if (cached) return cached;

    // Return placeholder
    const placeholder: User = {
      id: userId,
      clerk_user_id: "",
      name: "Loading...",
      email: "",
      role: "user",
      is_deleted: false,
      created_at: new Date().toISOString(),
    };

    return placeholder;
  }

  // Populate user cache from posts/comments
  populateFromPosts(posts: Array<{ author_id: string; author?: User }>) {
    posts.forEach((post) => {
      if (post.author && post.author_id) {
        this.set(post.author_id, post.author);
      }
    });
  }

  populateFromComments(comments: Array<{ user_id: string; user?: User }>) {
    comments.forEach((comment) => {
      if (comment.user && comment.user_id) {
        this.set(comment.user_id, comment.user);
      }
    });
  }

  clear() {
    this.cache.clear();
    this.clerkIdToDbId.clear();
    this.fetchPromises.clear();
  }
}

export const userCache = new UserCache();
