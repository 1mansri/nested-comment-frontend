"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post/PostCard";
import { LoaderIcon } from "@/components/icons/comment-icons";
import { apiClient } from "@/lib/api";
import { useUserSync } from "@/lib/hooks/useUserSync";
import type { Post } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Shield } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const {
    user: dbUser,
    isLoading: isUserLoading,
    isAdmin,
    error: userError,
  } = useUserSync();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserPosts() {
      if (!dbUser) return;

      try {
        setIsLoadingPosts(true);
        const posts = await apiClient.getUserPosts(dbUser.id);
        setUserPosts(posts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setIsLoadingPosts(false);
      }
    }

    loadUserPosts();
  }, [dbUser]);

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

  if (!dbUser || !clerkUser) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Please sign in to view your profile
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
    <div className="max-w-4xl pt-14 mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 cursor-pointer  ">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6 flex-col sm:flex-row">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={dbUser.avatar_url} alt={dbUser.name} />
                <AvatarFallback className="text-2xl">
                  {dbUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-bold">{dbUser.name}</h1>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        <Shield className="h-4 w-4" />
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{dbUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(dbUser.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userPosts.length}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* User's Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Posts</h2>
          <Link  href="/create-post">
            <Button className="cursor-pointer">Create New Post</Button>
          </Link>
        </div>

        {isLoadingPosts ? (
          <div className="flex items-center justify-center py-12">
            <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card className="p-8">
            <p className="text-center text-destructive">{error}</p>
          </Card>
        ) : userPosts.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You haven&apos;t created any posts yet.
              </p>
              <Link passHref href="/create-post">
                <Button className="cursor-pointer " >Create Your First Post</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {userPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} author={dbUser} commentCount={0} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
