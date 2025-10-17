"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentList } from "@/components/comments/CommentList";
import { LoaderIcon } from "@/components/icons/comment-icons";
import { apiClient } from "@/lib/api";
import { useUserSync } from "@/lib/hooks/useUserSync";
import { formatDate } from "@/lib/date-utils";
import type { Post, User } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const { user, isLoading: isUserLoading, isAdmin } = useUserSync();

  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        // Note: You might want to add a single post endpoint to your backend
        const posts = await apiClient.getRecentPosts();
        const foundPost = posts.find((p) => p.id === postId);

        if (!foundPost) {
          setError("Post not found");
          return;
        }

        setPost(foundPost);

        // Backend now includes author object with the post
        if (foundPost.author) {
          setAuthor(foundPost.author);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    }

    if (postId) {
      loadPost();
    }
  }, [postId]);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoaderIcon className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error || "Post not found"}</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Please sign in to view and comment on posts
        </p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl py-10 mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-accent hover:bg-accent/90 cursor-pointer "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Button>
        </Link>
      </motion.div>

      {/* Post Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          {post.image_url && (
            <div className="relative h-64 md:h-96 w-full overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={author?.avatar_url} alt={author?.name} />
                <AvatarFallback>
                  {author?.name.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{author?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
          </CardHeader>

          <CardContent>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-base leading-relaxed">
                {post.body}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CommentList
          postId={post.id}
          currentUserId={user.id}
          isAdmin={isAdmin}
        />
      </motion.div>
    </div>
  );
}
