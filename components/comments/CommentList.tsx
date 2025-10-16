"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import {
  LoaderIcon,
  SortIcon,
  TrendingIcon,
  ClockIcon,
} from "@/components/icons/comment-icons";
import { apiClient } from "@/lib/api";
import type { Comment as CommentType, SortOption } from "@/lib/types";

interface CommentListProps {
  postId: string;
  currentUserId: string;
  isAdmin: boolean;
}

export function CommentList({
  postId,
  currentUserId,
  isAdmin,
}: CommentListProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [upvotedComments, setUpvotedComments] = useState<Set<string>>(
    new Set()
  );

  // Recursive function to count all nested replies (children, grandchildren, etc.)
  const countAllReplies = useCallback(
    (commentId: string, allComments: CommentType[]): number => {
      // Find all direct children
      const directChildren = allComments.filter(
        (c) => c.parent_comment_id === commentId
      );

      // If no children, return 0
      if (directChildren.length === 0) return 0;

      // Count direct children + all their nested replies recursively
      let totalCount = directChildren.length;

      directChildren.forEach((child) => {
        totalCount += countAllReplies(child.id, allComments);
      });

      return totalCount;
    },
    []
  );

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedComments = await apiClient.getPostComments({
        post_id: postId,
        sort_by: sortBy,
      });

      // Filter to only show top-level comments (parent_comment_id is null)
      // Backend returns ALL comments, but we only want root-level ones here
      const topLevelComments = fetchedComments.filter(
        (comment) => comment.parent_comment_id === null
      );

      // Count ALL nested replies recursively (not just direct children)
      const commentsWithCounts = topLevelComments.map((comment) => {
        const totalReplyCount = countAllReplies(comment.id, fetchedComments);

        return {
          ...comment,
          reply_count: totalReplyCount,
          replies: [], // Replies loaded on demand
        };
      });

      setComments(commentsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [postId, sortBy, countAllReplies]);

  // Calculate total count of all comments including nested replies
  const getTotalCommentCount = useCallback(() => {
    let total = comments.length; // Top-level comments

    comments.forEach((comment) => {
      total += comment.reply_count || 0; // Add all nested replies
    });

    return total;
  }, [comments]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleCommentAdded = (newComment: CommentType) => {
    setComments((prev) => [
      { ...newComment, replies: [], reply_count: 0 },
      ...prev,
    ]);
  };

  const handleUpvote = async (commentId: string) => {
    try {
      const result = await apiClient.upvoteComment({
        comment_id: commentId,
        user_id: currentUserId,
      });

      const wasUpvoted = upvotedComments.has(commentId);
      const newUpvotedComments = new Set(upvotedComments);

      if (wasUpvoted) {
        newUpvotedComments.delete(commentId);
      } else {
        newUpvotedComments.add(commentId);
      }

      setUpvotedComments(newUpvotedComments);

      // Update comment upvote count
      const updateCommentUpvotes = (comments: CommentType[]): CommentType[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              upvotes: result.upvotes,
              hasUpvoted: !wasUpvoted,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentUpvotes(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateCommentUpvotes(comments));
    } catch (err) {
      console.error("Failed to upvote comment:", err);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await apiClient.deleteComment({
        comment_id: commentId,
        user_id: currentUserId,
      });

      // Mark comment as deleted
      const markAsDeleted = (comments: CommentType[]): CommentType[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, is_deleted: true };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: markAsDeleted(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(markAsDeleted(comments));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleReplyAdded = (parentId: string, reply: CommentType) => {
    const addReply = (comments: CommentType[]): CommentType[] => {
      return comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              { ...reply, replies: [], reply_count: 0 },
              ...(comment.replies || []),
            ],
            reply_count: (comment.reply_count || 0) + 1,
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReply(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments(addReply(comments));
  };

  const handleLoadReplies = async (commentId: string) => {
    try {
      const replies = await apiClient.getCommentReplies({
        post_id: postId,
        parent_comment_id: commentId,
        sort_by: sortBy,
      });

      // Fetch ALL comments for this post to count nested replies recursively
      const allComments = await apiClient.getPostComments({
        post_id: postId,
      });

      const addReplies = (comments: CommentType[]): CommentType[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: replies.map((r) => {
                // Count ALL nested replies recursively (not just direct children)
                const totalNestedReplyCount = countAllReplies(
                  r.id,
                  allComments
                );

                return {
                  ...r,
                  replies: [],
                  reply_count: totalNestedReplyCount,
                };
              }),
              reply_count: replies.length, // Keep original for this level
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplies(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(addReplies(comments));
    } catch (err) {
      console.error("Failed to load replies:", err);
    }
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case "upvotes":
        return <TrendingIcon className="h-4 w-4" />;
      case "oldest":
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "upvotes":
        return "Top";
      case "oldest":
        return "Oldest";
      default:
        return "Newest";
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form - Always visible */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
        <CommentForm
          postId={postId}
          userId={currentUserId}
          onCommentAdded={handleCommentAdded}
          placeholder="What are your thoughts?"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadComments} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Comments Section */}
      {!isLoading && !error && (
        <>
          {/* Sort Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {getTotalCommentCount()}{" "}
              {getTotalCommentCount() === 1 ? "Comment" : "Comments"}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {getSortIcon()}
                  <span className="hidden sm:inline">Sort by:</span>
                  <span>{getSortLabel()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <DropdownMenuRadioItem value="created_at">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    Newest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    Oldest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="upvotes">
                    <TrendingIcon className="mr-2 h-4 w-4" />
                    Most Upvoted
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Comments List */}
          <AnimatePresence mode="popLayout">
            {comments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-muted-foreground"
              >
                <p>No comments yet. Be the first to comment!</p>
              </motion.div>
            ) : (
              <ScrollArea className="w-full max-h-[800px]">
                <motion.div
                  layout
                  className="space-y-2 bg-card rounded-lg border divide-y min-w-0"
                >
                  {comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={{
                        ...comment,
                        hasUpvoted: upvotedComments.has(comment.id),
                      }}
                      postId={postId}
                      currentUserId={currentUserId}
                      isAdmin={isAdmin}
                      onUpvote={handleUpvote}
                      onDelete={handleDelete}
                      onReplyAdded={handleReplyAdded}
                      onLoadReplies={handleLoadReplies}
                    />
                  ))}
                </motion.div>
                {/* Enable horizontal scrollbar */}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
