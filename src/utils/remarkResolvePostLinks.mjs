import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const POSTS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../content/posts"
);
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const INVISIBLE_CHARACTERS = /[\u200B-\u200D\u2060\uFEFF]/g;

let cachedPostIndex;

function normalizeSlashes(value) {
  return String(value).replace(/\\/g, "/");
}

function normalizeLookupKey(value) {
  return normalizeSlashes(value)
    .normalize("NFKC")
    .replace(INVISIBLE_CHARACTERS, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.md$/i, "")
    .trim()
    .toLocaleLowerCase();
}

function withoutExtension(value) {
  return String(value).replace(/\.md$/i, "");
}

function stripQuotes(value) {
  const trimmed = String(value ?? "").trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readFrontmatter(markdown) {
  const match = String(markdown).match(FRONTMATTER_PATTERN);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) data[field[1]] = stripQuotes(field[2]);
  }
  return data;
}

function walkMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdownFiles(fullPath, files);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function addAlias(index, alias, post) {
  const normalized = normalizeLookupKey(alias);
  if (normalized && !index.aliases.has(normalized))
    index.aliases.set(normalized, post);
}

function buildPostIndex() {
  const index = {
    byPath: new Map(),
    aliases: new Map(),
  };

  for (const absolutePath of walkMarkdownFiles(POSTS_DIR)) {
    const markdown = fs.readFileSync(absolutePath, "utf8");
    const frontmatter = readFrontmatter(markdown);
    const relativePath = normalizeSlashes(
      path.relative(POSTS_DIR, absolutePath)
    );
    const basename = path.posix.basename(relativePath);
    const urlPath =
      frontmatter.slug ||
      frontmatter.legacySlug ||
      withoutExtension(relativePath);
    const post = {
      absolutePath: normalizeSlashes(path.resolve(absolutePath)),
      url: `/posts/${normalizeSlashes(urlPath).replace(/^\/+/, "")}/`,
      frontmatter,
      relativePath,
      basename,
    };

    index.byPath.set(post.absolutePath.toLocaleLowerCase(), post);

    for (const alias of [
      relativePath,
      withoutExtension(relativePath),
      basename,
      withoutExtension(basename),
      frontmatter.title,
      frontmatter.slug,
      frontmatter.legacySlug,
      frontmatter.legacySlug ? path.posix.basename(frontmatter.legacySlug) : "",
    ]) {
      addAlias(index, alias, post);
    }
  }

  return index;
}

function getPostIndex() {
  cachedPostIndex ??= buildPostIndex();
  return cachedPostIndex;
}

function isExternalOrSpecialUrl(url) {
  return (
    !url ||
    url.startsWith("#") ||
    url.startsWith("/") ||
    /^[a-z][a-z\d+.-]*:/i.test(url)
  );
}

function splitUrl(url) {
  const hashIndex = url.indexOf("#");
  const queryIndex = url.indexOf("?");
  const splitAt = [hashIndex, queryIndex]
    .filter(index => index >= 0)
    .sort((a, b) => a - b)[0];

  if (splitAt === undefined) return { pathname: url, suffix: "" };
  return { pathname: url.slice(0, splitAt), suffix: url.slice(splitAt) };
}

function decodePathname(pathname) {
  try {
    return decodeURI(pathname);
  } catch {
    return pathname;
  }
}

function resolvePostUrl(rawUrl, currentFilePath) {
  if (isExternalOrSpecialUrl(rawUrl)) return undefined;

  const { pathname, suffix } = splitUrl(rawUrl);
  if (!pathname.toLowerCase().endsWith(".md")) return undefined;

  const index = getPostIndex();
  const decodedPathname = decodePathname(pathname);
  const currentDir = currentFilePath
    ? path.dirname(currentFilePath)
    : POSTS_DIR;
  const absoluteTarget = normalizeSlashes(
    path.resolve(currentDir, decodedPathname)
  ).toLocaleLowerCase();
  const post =
    index.byPath.get(absoluteTarget) ??
    index.aliases.get(normalizeLookupKey(decodedPathname)) ??
    index.aliases.get(normalizeLookupKey(path.posix.basename(decodedPathname)));

  if (!post) return undefined;
  return `${post.url}${suffix}`;
}

function visitLinks(node, visitor) {
  if (!node || typeof node !== "object") return;
  if (node.type === "link") visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visitLinks(child, visitor);
  }
}

export function resetPostLinkIndexForTests() {
  cachedPostIndex = undefined;
}

export function resolvePostLinkForTests(url, currentFilePath) {
  return resolvePostUrl(url, currentFilePath);
}

export default function remarkResolvePostLinks() {
  return (tree, file) => {
    const currentFilePath = file?.path ? path.resolve(String(file.path)) : "";

    visitLinks(tree, node => {
      const resolvedUrl = resolvePostUrl(node.url, currentFilePath);
      if (resolvedUrl) node.url = resolvedUrl;
    });
  };
}
