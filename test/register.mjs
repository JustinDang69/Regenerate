/* Registers the "@/…" path-alias resolver for `npm test`. */
import { register } from "node:module";
register("./resolve-alias.mjs", import.meta.url);
