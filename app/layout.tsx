import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { HeroHeader } from "@/components/header";
// import { Raleway, Space_Grotesk } from "next/font/google";
import { Michroma } from "next/font/google";


// ✅ Load Michroma font
const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-primary",
});

export const metadata: Metadata = {
  title: "CoHub - Beautiful Comment Threads",
  description: "A modern nested comment system with real-time interactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${michroma.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <HeroHeader />
            {children}
            {/* Theme Switcher - Fixed Bottom Right with responsive positioning */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 transition-all duration-300">
              <ThemeSwitcher size="sm" />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
