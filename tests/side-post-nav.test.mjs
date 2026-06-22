import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const componentUrl = new URL(
  "../src/pages/posts/[...slug]/_components/SidePostNav.astro",
  import.meta.url
);

test("renders article context controls in the right sidebar", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /data-post-context-controls/);
  assert.match(source, /data-post-context-drag-handle/);
  assert.match(source, /data-post-context-prev/);
  assert.match(source, /data-post-context-top/);
  assert.match(source, /data-post-context-comments/);
  assert.match(source, /data-post-context-next/);
  assert.match(source, /top:\s*50%/);
  assert.match(source, /right:\s*4\.75rem/);
  assert.match(source, /transform:\s*translateY\(-50%\)/);
  assert.match(source, /IconArrowBarToUp/);
  assert.match(source, /IconMessageCircle/);
  assert.match(source, /localStorage/);
  assert.match(source, /pointerdown/);
  assert.match(source, /dblclick/);
  assert.match(source, /#comments-title/);
  assert.match(source, /scrollIntoView\(\{\s*behavior:\s*"smooth"/);
  assert.doesNotMatch(source, /IconArrowLeft class="size-5 rotate-90"/);
  assert.doesNotMatch(source, /IconArrowRight class="size-5 rotate-90"/);
  assert.doesNotMatch(source, /fixed inset-0/);
});

test("provides mobile and keyboard article navigation", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /data-mobile-post-nav/);
  assert.match(source, /data-mobile-post-comments/);
  assert.match(source, /event\.altKey/);
  assert.match(source, /ArrowLeft/);
  assert.match(source, /ArrowRight/);
});
