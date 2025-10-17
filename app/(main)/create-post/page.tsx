"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderIcon, SendIcon } from "@/components/icons/comment-icons";
import { apiClient } from "@/lib/api";
import { useUserSync } from "@/lib/hooks/useUserSync";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading, error: userError } = useUserSync();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url.trim()) {
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }

    if (!user) {
      setError("You must be signed in to create a post");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const post = await apiClient.createPost({
        title: title.trim(),
        body: body.trim(),
        author_id: user.id,
        image_url: imageUrl.trim() || undefined,
      });

      // Redirect to the new post
      router.push(`/post/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoaderIcon className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show backend connection error
  if (userError) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card className="p-8 border-destructive">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Backend Connection Error
          </h2>
          <p className="text-muted-foreground mb-6">{userError}</p>
          <div className="space-y-2 text-sm text-left bg-muted p-4 rounded-md">
            <p className="font-semibold">Troubleshooting steps:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Ensure your backend server is running</li>
              <li>Check if it&apos;s accessible at the configured URL</li>
              <li>Verify CORS settings on the backend</li>
              <li>Check browser console for more details</li>
            </ul>
          </div>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Please sign in to create a post
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
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      {/* Create Post Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
            <CardDescription>
              Share your thoughts, ideas, or start a discussion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title..."
                  disabled={isSubmitting}
                  maxLength={200}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {title.length}/200
                </p>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <label htmlFor="body" className="text-sm font-medium">
                  Content <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your post content here..."
                  disabled={isSubmitting}
                  rows={12}
                  className="resize-y"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {body.length} characters
                </p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label
                  htmlFor="imageUrl"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Cover Image (optional)
                </label>
                <div className="space-y-3">
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                  />

                  {/* Image Preview */}
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative rounded-lg overflow-hidden border h-48"
                    >
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover"
                        unoptimized
                        onError={() => {
                          setImagePreview("");
                          setError(
                            "Failed to load image. Please check the URL."
                          );
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageUrl("");
                          setImagePreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a direct URL to an image (jpg, png, gif, etc.)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex items-center gap-3 justify-end pt-4">
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !body.trim()}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-4 w-4" />
                      Publish Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Writing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use a clear and descriptive title</li>
              <li>• Break up long content into paragraphs</li>
              <li>• Add a relevant cover image to attract readers</li>
              <li>• Be respectful and constructive</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
