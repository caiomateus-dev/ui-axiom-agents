import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importHelpers from "eslint-plugin-import-helpers";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "e2e"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      "import-helpers": importHelpers,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, allowExportNames: ["use*", "*Provider"] },
      ],
      "import-helpers/order-imports": [
        "warn",
        {
          newlinesBetween: "always",
          groups: [
            ["/^react/"],
            "module",
            "/^@/core/",
            "/^@/types/",
            "/^@/contexts/",
            "/^@/hooks/",
            "/^@/components/",
            "/^@/views/",
            "/^@/utils/",
            "/^@/constants/",
            "/^@/test/",
            ["parent", "sibling", "index"],
          ],
          alphabetize: { order: "asc", ignoreCase: true },
        },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "src/test/**", "src/contexts/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
]);
