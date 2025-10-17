"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Post, User } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/date-utils";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface PostCardProps {
  post: Post;
  author?: User;
  commentCount?: number;
  isLoadingComments?: boolean;
}

export function PostCard({
  post,
  author,
  commentCount = 0,
  isLoadingComments = false,
}: PostCardProps) {
  return (
    <Link href={`/post/${post.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer h-full flex flex-col">

            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <motion.img
                src={post.image_url ?? "/placeholder.png"}
                alt={post.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

          <CardHeader className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarImage src={author?.avatar_url} alt={author?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {author?.name.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate hover:text-primary transition-colors">
                  {author?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(post.created_at)}
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold line-clamp-2 hover:text-primary transition-colors">
              {post.title}
            </h2>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
              {post.body}
            </p>

            {/* Comment Count with Animation */}
            <div className="flex items-center gap-2 text-sm">
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                <AnimatePresence mode="wait">
                  {isLoadingComments ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse" />
                      <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse [animation-delay:0.4s]" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="count"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="font-medium tabular-nums"
                    >
                      {commentCount}{" "}
                      {commentCount === 1 ? "comment" : "comments"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
