"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, LoaderIcon } from "@/components/icons/comment-icons";
import { apiClient } from "@/lib/api";
import type { Comment } from "@/lib/types";

interface CommentFormProps {
  postId: string;
  parentCommentId?: string | null;
  userId: string;
  onCommentAdded?: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  postId,
  parentCommentId = null,
  userId,
  onCommentAdded,
  onCancel,
  placeholder = "Write a comment...",
  autoFocus = false,
}: CommentFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const comment = await apiClient.createComment({
        post_id: postId,
        parent_comment_id: parentCommentId,
        user_id: userId,
        text: text.trim(),
      });

      setText("");
      onCommentAdded?.(comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        autoFocus={autoFocus}
        disabled={isSubmitting}
        className="resize-none"
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!text.trim() || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4" />
              {parentCommentId ? "Reply" : "Comment"}
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}
