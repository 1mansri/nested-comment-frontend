"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, GearSixIcon } from "./icons/theme-icons";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "light" | "dark" | "system";
type Size = "sm" | "md" | "lg";

interface ThemeSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTheme?: Theme;
  themes?: Theme[];
  size?: Size;
  includeSystem?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className,
  defaultTheme = "system",
  themes = ["light", "dark", "system"],
  size = "sm",
  includeSystem = false,
  ...props
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [hoveredTheme, setHoveredTheme] = React.useState<Theme | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredThemes = includeSystem
    ? themes
    : themes.filter((t) => t !== "system");

  React.useEffect(() => {
    if (!includeSystem && theme === "system") {
      setTheme("light");
    }
  }, [includeSystem, theme, setTheme]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex gap-1 rounded-full h-fit w-fit bg-card border border-border",
          size === "sm" ? "p-1" : size === "md" ? "p-1.5" : "p-2",
          className
        )}
      >
        {filteredThemes.map((t) => (
          <div
            key={t}
            className={cn(
              size === "sm"
                ? "h-8 w-8"
                : size === "md"
                ? "h-10 w-10"
                : "h-12 w-12",
              "rounded-full bg-muted/50 animate-pulse"
            )}
          />
        ))}
      </div>
    );
  }

  const getIcon = (t: Theme) => {
    const iconSize = size === "sm" ? 18 : size === "md" ? 22 : 28;
    switch (t) {
      case "light":
        return <SunIcon size={iconSize} />;
      case "dark":
        return <MoonIcon size={iconSize} />;
      case "system":
        return <GearSixIcon size={iconSize} />;
    }
  };

  const getLabel = (t: Theme) => {
    switch (t) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative flex gap-1 rounded-full h-fit w-fit shadow-lg backdrop-blur-sm",
        "bg-card/95 border border-border/50",
        size === "sm" ? "p-1" : size === "md" ? "p-1.5" : "p-2",
        className
      )}
      style={props.style}
    >
      {/* Background highlight indicator */}
      <AnimatePresence mode="wait">
        {theme && (
          <motion.div
            key={theme}
            layoutId="theme-indicator"
            className={cn(
              "absolute rounded-full bg-primary/10 dark:bg-primary/20",
              "shadow-sm border border-primary/20"
            )}
            initial={false}
            animate={{
              left:
                filteredThemes.indexOf(theme as Theme) *
                  (size === "sm" ? 36 : size === "md" ? 44 : 56) +
                (size === "sm" ? 4 : size === "md" ? 6 : 8),
              width: size === "sm" ? 32 : size === "md" ? 40 : 48,
              height: size === "sm" ? 32 : size === "md" ? 40 : 48,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}
      </AnimatePresence>

      {filteredThemes.map((t, index) => {
        const isActive = theme === t;
        const isHovered = hoveredTheme === t;

        return (
          <motion.button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            onMouseEnter={() => setHoveredTheme(t)}
            onMouseLeave={() => setHoveredTheme(null)}
            className={cn(
              size === "sm"
                ? "h-8 w-8"
                : size === "md"
                ? "h-10 w-10"
                : "h-12 w-12",
              "relative inline-flex items-center justify-center whitespace-nowrap",
              "text-sm font-medium rounded-full transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? "text-primary dark:text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={{
                rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                scale: isActive ? 1.1 : isHovered ? 1.05 : 1,
              }}
              transition={{
                rotate: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 0.2,
                },
              }}
            >
              {getIcon(t)}
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute -top-10 left-1/2 -translate-x-1/2",
                    "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap",
                    "bg-popover text-popover-foreground shadow-md border border-border",
                    "pointer-events-none z-50"
                  )}
                >
                  {getLabel(t)}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-popover border-r border-b border-border" />
                </motion.div>
              )}
            </AnimatePresence>

            <span className="sr-only">{getLabel(t)} theme</span>
          </motion.button>
        );
      })}

      {/* Ambient glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/5 blur-xl -z-10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
