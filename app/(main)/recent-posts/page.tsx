"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import { PostCard } from "@/components/post/PostCard";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "@/components/icons/comment-icons";
import { apiClient } from "@/lib/api";
import { useUserSync } from "@/lib/hooks/useUserSync";
import type { Post, User } from "@/lib/types";


export default function HomePage() {
  const { user, isLoading: isUserLoading } = useUserSync();
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Map<string, User>>(new Map());
  const [commentCounts, setCommentCounts] = useState<Map<string, number>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const fetchedPosts = await apiClient.getRecentPosts();
        setPosts(fetchedPosts);

        // Backend now includes author object with each post
        const authorMap = new Map<string, User>();
        fetchedPosts.forEach((post) => {
          if (post.author && !authorMap.has(post.author_id)) {
            authorMap.set(post.author_id, post.author);
          }
        });

        setAuthors(authorMap);

        // Fetch comment counts for each post
        const commentCountMap = new Map<string, number>();
        await Promise.all(
          fetchedPosts.map(async (post) => {
            try {
              const comments = await apiClient.getPostComments({
                post_id: post.id,
              });
              // Count ALL comments (including nested replies)
              commentCountMap.set(post.id, comments.length);
            } catch (err) {
              console.error(
                `Failed to load comments for post ${post.id}:`,
                err
              );
              commentCountMap.set(post.id, 0);
            }
          })
        );

        setCommentCounts(commentCountMap);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoaderIcon className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <h1 className="text-4xl font-bold">Welcome to NestedComments</h1>
          <p className="text-lg text-muted-foreground">
            A beautiful, nested comment system with real-time interactions.
          </p>
          <SignInButton mode="modal">
            <Button size="lg">Get Started</Button>
          </SignInButton>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-1 md:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold">Recent Posts</h1>
        <p className="text-muted-foreground">
          Explore the latest discussions and join the conversation
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <p>No posts yet. Check back soon!</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard
                post={post}
                author={authors.get(post.author_id)}
                commentCount={commentCounts.get(post.id) || 0}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
