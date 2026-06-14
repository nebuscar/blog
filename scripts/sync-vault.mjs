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

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = resolve(process.argv[2] ?? join(projectRoot, "..", "vault", "public"));
const targetDir = resolve(process.argv[3] ?? join(projectRoot, "src", "content", "posts"));

if (!existsSync(sourceDir)) {
  throw new Error(`Vault public directory does not exist: ${sourceDir}`);
}

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

function gitDate(file, format, reverse = false) {
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

function normalizeDate(value, fallback) {
  if (!value || Array.isArray(value)) return fallback;
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

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });

const files = walkMarkdown(sourceDir);
for (const sourceFile of files) {
  const { data, body } = parseFrontmatter(readFileSync(sourceFile, "utf8"));
  const relativePath = relative(sourceDir, sourceFile);
  const title = data.title || basename(sourceFile, extname(sourceFile));
  const createdByGit = gitDate(sourceFile, "%aI", true);
  const modifiedByGit = gitDate(sourceFile, "%aI");
  const fallbackDate = createdByGit || new Date().toISOString();
  const pubDatetime = normalizeDate(
    data.pubDatetime || data.pubDate || data["date created"],
    fallbackDate
  );
  const modDatetime = normalizeDate(
    data.modDatetime || data.updatedDate || data["date modified"],
    modifiedByGit || pubDatetime
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
    "tags:",
    ...(tags.length ? tags.map(tag => `  - ${yamlString(tag)}`) : ["  - others"]),
    "---",
    "",
  ].join("\n");

  const targetFile = join(targetDir, relativePath);
  mkdirSync(dirname(targetFile), { recursive: true });
  writeFileSync(targetFile, `${frontmatter}${body.trimStart()}`, "utf8");
}

process.stdout.write(
  `Synced ${files.length} Markdown file(s) from ${sourceDir} to ${targetDir}\n`
);
