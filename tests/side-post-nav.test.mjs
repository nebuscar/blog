import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const componentUrl = new URL(
  "../src/pages/posts/[...slug]/_components/SidePostNav.astro",
  import.meta.url
);

test("anchors desktop post navigation to viewport edges", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /data-side-post-prev/);
  assert.match(source, /data-side-post-next/);
  assert.match(source, /start-4/);
  assert.match(source, /end-4/);
  assert.doesNotMatch(source, /max-w-\[(60|70)rem\]/);
});

test("provides mobile and keyboard article navigation", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /data-mobile-post-nav/);
  assert.match(source, /event\.altKey/);
  assert.match(source, /ArrowLeft/);
  assert.match(source, /ArrowRight/);
});
