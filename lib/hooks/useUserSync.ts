// Hook to sync Clerk user with backend database
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { userCache } from "@/lib/userCache";
import type { User } from "@/lib/types";

export function useUserSync() {
  const { user: clerkUser, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function syncUser() {
      // Keep loading until Clerk is fully loaded
      if (!isLoaded) {
        setIsLoading(true);
        return;
      }

      // If Clerk is loaded but no user, stop loading
      if (!clerkUser) {
        console.log("useUserSync: No Clerk user found");
        setDbUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("useUserSync: Syncing user with ID:", clerkUser.id);

        // Try to get existing user
        let user: User;
        try {
          user = await apiClient.getUser(clerkUser.id);
          console.log("useUserSync: Found existing user:", user.name);
        } catch (err) {
          // User doesn't exist, create them
          console.log("useUserSync: Creating new user");
          user = await apiClient.createUser({
            clerk_user_id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || "Anonymous",
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            avatar_url: clerkUser.imageUrl,
          });
          console.log("useUserSync: Created user:", user.name);
        }

        setDbUser(user);
        // Cache the user for later use
        userCache.set(user.id, user);
        setError(null);
      } catch (err) {
        console.error("useUserSync: Error syncing user:", err);
        setError(err instanceof Error ? err.message : "Failed to sync user");
      } finally {
        setIsLoading(false);
      }
    }

    syncUser();
  }, [clerkUser, isLoaded]);

  return { user: dbUser, isLoading, error, isAdmin: dbUser?.role === "admin" };
}
