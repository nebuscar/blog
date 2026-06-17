import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * Returns posts that are eligible to be shown to users, sorted by “last updated”
 * descending (uses `modDatetime` when present, otherwise `pubDatetime`).
 *
 * Note: filtering respects drafts and scheduled posts via `postFilter()`.
 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return posts.filter(postFilter).sort((a, b) => {
    const timeDifference =
      new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() -
      new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime();

    return timeDifference || a.data.title.localeCompare(b.data.title, "zh-CN");
  });
}

/**
 * Returns visible posts sorted by original publish time descending.
 */
export function getPostsByPublishedDate(posts: CollectionEntry<"posts">[]) {
  return posts.filter(postFilter).sort((a, b) => {
    const timeDifference =
      new Date(b.data.pubDatetime).getTime() -
      new Date(a.data.pubDatetime).getTime();

    return timeDifference || a.data.title.localeCompare(b.data.title, "zh-CN");
  });
}
