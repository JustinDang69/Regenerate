import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    /* Client-review artifacts are isolated from the app and include vendored
       minified libraries. Excluded from linting for the same reason `docs` is
       excluded from tsconfig — review material must never break a production check. */
    "docs/**",
  ]),
  {
    rules: {
      /* Allow the conventional `_`-prefix for intentionally-discarded bindings
         (e.g. destructuring to omit props before spreading the rest). */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);

export default eslintConfig;
