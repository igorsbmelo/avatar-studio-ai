import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "node_modules/**", "supabase/functions/**"],
    rules: {
      // Existing database rows are gradually being migrated to generated Supabase types.
      // Keep these as warnings so legacy annotations don't block production deployment.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
