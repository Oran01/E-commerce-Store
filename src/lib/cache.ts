import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

type Callback = (...args: any[]) => Promise<any>;

/**
 * A caching utility that combines Next.js unstable_cache and React's cache functions.
 *
 * @template T A function that returns a Promise.
 * @param {T} cb - The callback function to be cached.
 * @param {string[]} keyParts - The unique key parts used to identify the cache entry.
 * @param {Object} [options] - Optional caching configuration.
 * @param {number | false} [options.revalidate] - The revalidation interval in seconds, or `false` to disable revalidation.
 * @param {string[]} [options.tags] - Tags for invalidating the cache.
 */
export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}
