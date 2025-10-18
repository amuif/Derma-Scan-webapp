"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}
