import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL(
  "../src/components/WalineComments.astro",
  import.meta.url
);
const kaomojiUrl = new URL(
  "../src/scripts/walineKaomoji.mjs",
  import.meta.url
);

test("disables image uploads and gif search", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /imageUploader:\s*false/);
  assert.match(source, /search:\s*false/);
  assert.match(source, /reaction:\s*false/);
});

test("uses only emoji and bilibili image presets", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /@waline\/emojis@1\.4\.0\/tw-emoji/);
  assert.match(source, /@waline\/emojis@1\.4\.0\/bilibili/);
  assert.doesNotMatch(source, /tieba|weibo/);
});

test("adds a text kaomoji tab to the Waline emoji popup", async () => {
  const source = await readFile(kaomojiUrl, "utf8");

  assert.match(source, /颜文字/);
  assert.match(source, /waline-kaomoji-panel/);
  assert.match(source, /dispatchEvent\(new Event\("input"/);
  assert.match(source, /MutationObserver/);
});
