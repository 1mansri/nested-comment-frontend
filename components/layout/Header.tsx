"use client";

import { motion } from "framer-motion";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, User } from "lucide-react";

export function Header() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between ">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <h1 className="text-xl ml-5 font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              CoHub
            </h1>
          </motion.div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          {isLoaded && (
            <>
              {isSignedIn ? (
                <>
                  <Link href="/create-post">
                    <Button size="sm" variant="ghost" className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">New Post</span>
                    </Button>
                  </Link>

                  <Link href="/profile">
                    <Button size="sm" variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Profile</span>
                    </Button>
                  </Link>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-9 w-9",
                        },
                      }}
                    />
                  </motion.div>
                </>
              ) : (
                <SignInButton mode="modal">
                  <Button size="sm">Sign In</Button>
                </SignInButton>
              )}
            </>
          )}
        </nav>        
      </div>
    </motion.header>
  );
}
