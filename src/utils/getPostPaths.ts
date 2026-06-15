import { getRelativeLocaleUrl } from "astro:i18n";
import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import config from "@/config";

function getPostPathSegments(filePath: string | undefined): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, "")
      .split("/")
      .filter(path => path !== "")
      .filter(path => !path.startsWith("_"))
      .slice(0, -1)
      .map(segment => slugifyStr(segment)) ?? []
  );
}

function getIdSlug(id: string): string {
  const postId = id.split("/");
  return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}

function getLegacyPostSlugPath(
  legacySlug: string | undefined,
  id: string,
  filePath: string | undefined
): string {
  if (legacySlug) return legacySlug;
  const pathSegments = getPostPathSegments(filePath);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

function getPostSlugPath(
  slug: string | undefined,
  id: string,
  filePath: string | undefined
): string {
  return slug || getLegacyPostSlugPath(undefined, id, filePath);
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 * No base prefix, no locale — Astro handles those at a higher level.
 * e.g. `/examples/my-post`
 */
export function getPostSlug(
  slug: string | undefined,
  id: string,
  filePath: string | undefined
): string {
  return `/${getPostSlugPath(slug, id, filePath)}`;
}

export function getLegacyPostSlug(
  legacySlug: string | undefined,
  id: string,
  filePath: string | undefined
): string {
  return `/${getLegacyPostSlugPath(legacySlug, id, filePath)}`;
}

export function getLegacyPostUrl(
  legacySlug: string | undefined,
  id: string,
  filePath: string | undefined,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(
    locale,
    `posts/${getLegacyPostSlugPath(legacySlug, id, filePath)}`
  );
}

/**
 * Returns a fully navigable URL for use in `<a href>` and RSS links.
 * Applies both locale routing and the configured Astro base via
 * `getRelativeLocaleUrl`.
 * e.g. `/posts/my-post` or `/en/posts/my-post`
 */
export function getPostUrl(
  slug: string | undefined,
  id: string,
  filePath: string | undefined,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(
    locale,
    `posts/${getPostSlugPath(slug, id, filePath)}`
  );
}
