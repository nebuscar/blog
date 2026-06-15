import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPostSlug } from "../src/utils/postSlug.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function walkMarkdown(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdown(path);
    return extname(entry.name).toLowerCase() === ".md" ? [path] : [];
  });
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: markdown };

  const data = {};
  let listKey;
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.+?)\s*$/);
    if (item && listKey) {
      data[listKey].push(item[1].replace(/^["']|["']$/g, ""));
      continue;
    }

    const field = line.match(/^([^:#][^:]*):\s*(.*?)\s*$/);
    if (!field) continue;

    const key = field[1].trim();
    const value = field[2].trim();
    listKey = undefined;

    if (value === "[]") {
      data[key] = [];
    } else if (value === "") {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { data, body: markdown.slice(match[0].length) };
}

function gitDate(file, sourceDir, format, reverse = false) {
  try {
    const repoRoot = resolve(sourceDir, "..");
    const args = [
      "-c",
      `safe.directory=${repoRoot}`,
      "-C",
      repoRoot,
      "log",
      "--follow",
      `--format=${format}`,
      ...(reverse ? ["--reverse"] : []),
      "--",
      relative(repoRoot, file),
    ];
    return execFileSync("git", args, { encoding: "utf8" })
      .trim()
      .split(/\r?\n/)[0];
  } catch {
    return "";
  }
}

export function normalizeDate(value, fallback) {
  if (!value || Array.isArray(value)) return fallback;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const fallbackTime = fallback.match(
      /T(\d{2}:\d{2}:\d{2}(?:\.\d+)?)(Z|[+-]\d{2}:\d{2})$/
    );
    if (fallbackTime) {
      const parsed = new Date(`${value}T${fallbackTime[1]}${fallbackTime[2]}`);
      if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    }
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function makeDescription(body, title) {
  const paragraph = body
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(
      line =>
        line &&
        !line.startsWith("#") &&
        !line.startsWith("!") &&
        !line.startsWith("```") &&
        !line.startsWith("[^")
    );

  return (paragraph ?? title)
    .replace(/\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .slice(0, 160);
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

export function syncVault(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    throw new Error(`Vault public directory does not exist: ${sourceDir}`);
  }

  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });

  const files = walkMarkdown(sourceDir);
  const redirects = [];
  for (const sourceFile of files) {
    const { data, body } = parseFrontmatter(readFileSync(sourceFile, "utf8"));
    const relativePath = relative(sourceDir, sourceFile);
    const title = data.title || basename(sourceFile, extname(sourceFile));
    const createdByGit = gitDate(sourceFile, sourceDir, "%aI", true);
    const modifiedByGit = gitDate(sourceFile, sourceDir, "%aI");
    const fallbackDate = createdByGit || new Date().toISOString();
    const pubDatetime = normalizeDate(
      data.pubDatetime || data.pubDate || data["date created"],
      fallbackDate
    );
    const modDatetime = normalizeDate(
      data.modDatetime || data.updatedDate || data["date modified"],
      modifiedByGit || pubDatetime
    );
    const slug = createPostSlug(new Date(pubDatetime), relativePath);
    const legacySlug = relativePath
      .replace(/\.md$/i, "")
      .split(/[\\/]/)
      .map(segment =>
        segment.toLowerCase().replace(/[^\p{Letter}\p{Number}-]+/gu, "")
      )
      .join("/");
    redirects.push(
      `${encodeURI(`/posts/${legacySlug}/`)} /posts/${slug}/ 301`
    );
    const description =
      typeof data.description === "string" && data.description
        ? data.description
        : makeDescription(body, title);
    const tags = Array.isArray(data.tags) ? data.tags : [];

    const frontmatter = [
      "---",
      `title: ${yamlString(title)}`,
      `description: ${yamlString(description)}`,
      `pubDatetime: ${pubDatetime}`,
      `modDatetime: ${modDatetime}`,
      `slug: ${slug}`,
      `legacySlug: ${yamlString(legacySlug)}`,
      ...(tags.length
        ? ["tags:", ...tags.map(tag => `  - ${yamlString(tag)}`)]
        : ["tags: []"]),
      "---",
      "",
    ].join("\n");

    const targetFile = join(targetDir, relativePath);
    mkdirSync(dirname(targetFile), { recursive: true });
    writeFileSync(targetFile, `${frontmatter}${body.trimStart()}`, "utf8");
  }

  writeFileSync(
    join(projectRoot, "public", "_redirects.txt"),
    `${redirects.join("\n")}\n`,
    "utf8"
  );

  return files.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sourceDir = resolve(
    process.argv[2] ?? join(projectRoot, "..", "vault", "public")
  );
  const targetDir = resolve(
    process.argv[3] ?? join(projectRoot, "src", "content", "posts")
  );
  const fileCount = syncVault(sourceDir, targetDir);

  process.stdout.write(
    `Synced ${fileCount} Markdown file(s) from ${sourceDir} to ${targetDir}\n`
  );
}
