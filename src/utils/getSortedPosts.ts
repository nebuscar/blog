import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * Returns visible posts sorted by original publish/create time descending.
 *
 * The sync script maps Obsidian `date created` to `pubDatetime`, so this keeps
 * article lists aligned with the note creation timeline instead of update time.
 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return posts.filter(postFilter).sort((a, b) => {
    const timeDifference =
      new Date(b.data.pubDatetime).getTime() -
      new Date(a.data.pubDatetime).getTime();

    return timeDifference || a.data.title.localeCompare(b.data.title, "zh-CN");
  });
}
