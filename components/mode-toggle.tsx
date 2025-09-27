"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  function handleThemeChange(checked: boolean) {
    setTheme(checked ? "dark" : "light");
  }

  return (
    <div className="flex justify-between items-center">
      <p>Night mode</p>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleThemeChange}
        className="hover:cursor-pointer"
      />
    </div>
  );
}
