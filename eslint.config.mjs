import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// ESM-safe __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Compat helper for old-style "extends"
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Flat config export
export default [
  // Bring in Next.js defaults (core-web-vitals + typescript)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add your own overrides
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      // Example custom rule
      semi: ["error", "always"],
    },
  },
];
