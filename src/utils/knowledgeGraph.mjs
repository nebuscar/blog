import path from "node:path";

const WIKILINK_PATTERN = /(?<!!)\[\[([^\]\n]+)\]\]/g;
const INVISIBLE_CHARACTERS = /[\u200B-\u200D\u2060\uFEFF]/g;

function normalizeLookupKey(value) {
  return String(value)
    .normalize("NFKC")
    .replace(INVISIBLE_CHARACTERS, "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.md$/i, "")
    .trim()
    .toLocaleLowerCase();
}

function withoutExtension(value) {
  return String(value).replace(/\.md$/i, "");
}

function basename(value) {
  return path.posix.basename(String(value).replace(/\\/g, "/"));
}

function getWikiLinkTarget(rawLink) {
  return rawLink.split("|", 1)[0].split("#", 1)[0].trim();
}

export function extractWikiLinks(markdown) {
  const links = [];

  for (const match of String(markdown).matchAll(WIKILINK_PATTERN)) {
    const target = getWikiLinkTarget(match[1]);
    if (target) links.push(target);
  }

  return [...new Set(links)];
}

function getPostAliases(post) {
  const aliases = new Set();
  const filePath = String(post.filePath ?? post.id ?? "").replace(/\\/g, "/");
  const relativePath = filePath
    .replace(/^.*?src\/content\/posts\//i, "")
    .replace(/^\/+/, "");
  const legacySlug = post.data?.legacySlug;

  for (const value of [
    post.data?.title,
    post.id,
    withoutExtension(post.id ?? ""),
    relativePath,
    withoutExtension(relativePath),
    basename(relativePath),
    withoutExtension(basename(relativePath)),
    legacySlug,
    legacySlug ? basename(legacySlug) : "",
  ]) {
    const normalized = normalizeLookupKey(value);
    if (normalized) aliases.add(normalized);
  }

  return aliases;
}

function resolveTarget(target, aliasIndex) {
  const normalized = normalizeLookupKey(target);
  if (!normalized) return undefined;

  return (
    aliasIndex.get(normalized) ??
    aliasIndex.get(normalizeLookupKey(basename(normalized)))
  );
}

export function buildKnowledgeGraph(posts, getUrl = post => post.url ?? "#") {
  const nodes = posts.map(post => ({
    id: post.id,
    title: post.data.title,
    url: getUrl(post),
    tags: post.data.tags ?? [],
  }));
  const nodeIds = new Set(nodes.map(node => node.id));
  const aliasIndex = new Map();

  for (const post of posts) {
    for (const alias of getPostAliases(post)) {
      if (!aliasIndex.has(alias)) aliasIndex.set(alias, post.id);
    }
  }

  const edgeKeys = new Set();
  const links = [];

  for (const post of posts) {
    for (const target of extractWikiLinks(post.body ?? "")) {
      const targetId = resolveTarget(target, aliasIndex);
      if (!targetId || !nodeIds.has(targetId) || targetId === post.id) continue;

      const [source, targetIdSorted] = [post.id, targetId].sort();
      const key = `${source}\u0000${targetIdSorted}`;
      if (edgeKeys.has(key)) continue;

      edgeKeys.add(key);
      links.push({ source, target: targetIdSorted });
    }
  }

  return { nodes, links };
}

export function getLocalKnowledgeGraph(graph, currentId) {
  const relatedIds = new Set([currentId]);

  for (const link of graph.links) {
    if (link.source === currentId) relatedIds.add(link.target);
    if (link.target === currentId) relatedIds.add(link.source);
  }

  return {
    nodes: graph.nodes.filter(node => relatedIds.has(node.id)),
    links: graph.links.filter(
      link => relatedIds.has(link.source) && relatedIds.has(link.target)
    ),
  };
}
