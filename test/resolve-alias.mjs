/* =============================================================================
   Node module-resolution hook: maps the "@/…" tsconfig path alias to ./src/….
   -----------------------------------------------------------------------------
   Lets `node --test` run the booking logic straight from TypeScript source
   (via --experimental-strip-types) with no bundler and no test framework.
   Extensionless specifiers get ".ts" appended, matching how the app imports.
   ========================================================================== */
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

const SRC = new URL("../src/", import.meta.url);

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = new URL(specifier.slice(2), SRC);
    for (const candidate of [base.href, `${base.href}.ts`, `${base.href}/index.ts`]) {
      if (existsSync(new URL(candidate))) return { url: candidate, shortCircuit: true };
    }
    return { url: `${base.href}.ts`, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export { pathToFileURL };
