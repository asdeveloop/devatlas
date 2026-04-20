import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import pluginBoundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/build/**",
      "**/*.d.ts",
      "packages/types/src/**/*.js",
      "**/*.lock"
    ]
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },

  {
    plugins: {
      import: pluginImport
    },
    settings: {
      "import/resolver": {
        typescript: true
      }
    },
    rules: {
      "import/no-unresolved": "error",
      "import/no-cycle": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always"
        }
      ]
    }
  },

  {
    plugins: {
      boundaries: pluginBoundaries
    },

    settings: {
      "boundaries/elements": [
        { type: "apps", pattern: "apps/*" },
        { type: "core", pattern: "packages/core/*" },
        { type: "infra", pattern: "packages/infra/*" },
        { type: "shared", pattern: "packages/shared/*" },
        { type: "ui", pattern: "packages/ui/*" }
      ]
    },

    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "apps",  allow: ["core", "infra", "shared", "ui"] },
            { from: "core",  allow: ["infra", "shared", "ui"] },
            { from: "infra", allow: ["shared", "ui"] },
            { from: "shared", allow: ["ui"] },
            { from: "ui", allow: ["shared"] }
          ]
        }
      ]
    }
  }
);
