"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UpvoteIcon,
  ReplyIcon,
  DeleteIcon,
  MoreIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LoaderIcon,
} from "@/components/icons/comment-icons";
import { CommentForm } from "./CommentForm";
import type { Comment as CommentType } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { userCache } from "@/lib/userCache";

interface CommentProps {
  comment: CommentType;
  postId: string;
  currentUserId: string;
  isAdmin: boolean;
  depth?: number;
  onUpvote: (commentId: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onReplyAdded: (parentId: string, reply: CommentType) => void;
  onLoadReplies: (commentId: string) => Promise<void>;
  maxDepth?: number;
}

export function Comment({
  comment,
  postId,
  currentUserId,
  isAdmin,
  depth = 0,
  onUpvote,
  onDelete,
  onReplyAdded,
  onLoadReplies,
  maxDepth = 3, // Changed from 5 to 3 for Reddit-style nesting
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showContinueThread, setShowContinueThread] = useState(false);

  const isOwner = comment.user_id === currentUserId;
  const canDelete = isOwner || isAdmin;
  const hasReplies = (comment.reply_count || 0) > 0;
  const reachedMaxDepth = depth >= maxDepth;

  // Get user from comment object or cache
  const commentUser =
    comment.user || userCache.getOrPlaceholder(comment.user_id);

  const handleUpvote = async () => {
    if (isUpvoting) return;
    setIsUpvoting(true);
    try {
      await onUpvote(comment.id);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleReplies = async () => {
    if (!showReplies && (!comment.replies || comment.replies.length === 0)) {
      setIsLoadingReplies(true);
      try {
        await onLoadReplies(comment.id);
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleReplyAdded = (reply: CommentType) => {
    setShowReplyForm(false);
    onReplyAdded(comment.id, reply);
    setShowReplies(true);
  };

  if (comment.is_deleted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="py-4 text-sm text-muted-foreground italic"
      >
        [Comment deleted]
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative",
        depth > 0 && "ml-6 md:ml-8 pl-4 border-l-2 border-border/50"
      )}
    >
      <div className="flex px-4 gap-3 py-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarImage src={commentUser.avatar_url} alt={commentUser.name} />
          <AvatarFallback>
            {commentUser.name.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{commentUser.name}</span>
            {isAdmin && commentUser.role === "admin" && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.created_at)}
            </span>
          </div>

          <p className="text-sm mb-3 whitespace-pre-wrap break-words">
            {comment.text}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Upvote */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUpvote}
                disabled={isUpvoting}
                className={cn(
                  "gap-1.5 h-8 px-2 cursor-pointer ",
                  comment.hasUpvoted && "text-primary"
                )}
              >
                <motion.div
                  animate={comment.hasUpvoted ? { y: -2 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <UpvoteIcon className="h-4 w-4" />
                </motion.div>
                <span className="text-xs">{comment.upvotes}</span>
              </Button>
            </motion.div>

            {/* Reply */}
            {!reachedMaxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="gap-1.5 h-8 cursor-pointer px-2"
              >
                <ReplyIcon className="h-4 w-4" />
                <span className="text-xs">Reply</span>
              </Button>
            )}

            {/* Show/Hide Replies */}
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleReplies}
                disabled={isLoadingReplies}
                className="gap-1.5 cursor-pointer h-8 px-2"
              >
                {isLoadingReplies ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : showReplies ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
                <span className="text-xs">
                  {showReplies ? "Hide" : `${comment.reply_count}`}{" "}
                  {comment.reply_count === 1 ? "reply" : "replies"}
                </span>
              </Button>
            )}

            {/* More Options */}
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 cursor-pointer w-8 p-0 ml-auto"
                  >
                    <MoreIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive cursor-pointer focus:text-destructive"
                  >
                    <DeleteIcon className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <CommentForm
                  postId={postId}
                  parentCommentId={comment.id}
                  userId={currentUserId}
                  onCommentAdded={handleReplyAdded}
                  onCancel={() => setShowReplyForm(false)}
                  placeholder={`Reply to ${commentUser.name}...`}
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          <AnimatePresence>
            {showReplies && comment.replies && comment.replies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                {/* If at max depth, show "Continue thread" button instead of nesting further */}
                {reachedMaxDepth ? (
                  <div className="pl-4 border-l-2 border-border/50">
                    {!showContinueThread ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowContinueThread(true)}
                        className="text-primary hover:text-primary/80 text-xs gap-1"
                      >
                        <ChevronDownIcon className="h-3 w-3" />
                        Continue thread ({comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"})
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowContinueThread(false)}
                          className="text-primary hover:text-primary/80 text-xs gap-1 mb-2"
                        >
                          <ChevronUpIcon className="h-3 w-3" />
                          Collapse thread
                        </Button>
                        {/* Wrap deep threads in ScrollArea for horizontal overflow protection */}
                        <ScrollArea className="max-w-full max-h-[600px]">
                          <div className="pr-4 min-w-0">
                            {comment.replies.map((reply) => (
                              <Comment
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                currentUserId={currentUserId}
                                isAdmin={isAdmin}
                                depth={0} // Reset depth for continued thread
                                onUpvote={onUpvote}
                                onDelete={onDelete}
                                onReplyAdded={onReplyAdded}
                                onLoadReplies={onLoadReplies}
                                maxDepth={maxDepth}
                              />
                            ))}
                          </div>
                          {/* Enable horizontal scrollbar */}
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </>
                    )}
                  </div>
                ) : (
                  // Normal nested rendering when under max depth
                  comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      postId={postId}
                      currentUserId={currentUserId}
                      isAdmin={isAdmin}
                      depth={depth + 1}
                      onUpvote={onUpvote}
                      onDelete={onDelete}
                      onReplyAdded={onReplyAdded}
                      onLoadReplies={onLoadReplies}
                      maxDepth={maxDepth}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
