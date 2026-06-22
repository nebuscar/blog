import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pageUrl = new URL(
  "../src/pages/posts/[...slug]/index.astro",
  import.meta.url
);
const tocUrl = new URL("../src/components/ArticleToc.astro", import.meta.url);

test("uses separate left directory and right graph columns", async () => {
  const source = await readFile(pageUrl, "utf8");

  assert.match(source, /post-toc-sidebar/);
  assert.match(source, /post-graph-sidebar/);
  assert.match(source, /PostSidebarResizer/);
  assert.match(source, /--post-toc-width/);
  assert.match(source, /width:\s*calc\(100% - 8rem\)/);
});

test("renders tree directory controls", async () => {
  const source = await readFile(tocUrl, "utf8");

  assert.match(source, /data-toc-toggle/);
  assert.match(source, /data-toc-expand-all/);
  assert.match(source, /data-toc-collapse-all/);
  assert.match(source, /data-toc-parent/);
});
