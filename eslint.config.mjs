import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Patterns d'hydratation client (Zustand, Konva, Image()) : setState
      // dans useEffect est légitime ici, on garde en warning informatif.
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "no-empty-pattern": "off",
      "no-empty": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "supabase/**",
      "next-env.d.ts",
      ".next-env.d.ts",
    ],
  },
);
