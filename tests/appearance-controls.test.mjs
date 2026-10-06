import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appearanceUrl = new URL(
  "../src/components/AppearanceSettings.astro",
  import.meta.url
);
const headerUrl = new URL("../src/components/Header.astro", import.meta.url);

test("keeps wallpaper refresh without exposing theme hue controls", async () => {
  const source = await readFile(appearanceUrl, "utf8");

  assert.match(source, /id="wallpaper-refresh"/);
  assert.match(source, /applyWallpaper\(wallpaper, true\)/);
  assert.doesNotMatch(source, /id="hue-slider"/);
  assert.doesNotMatch(source, /id="hue-value"/);
  assert.doesNotMatch(source, /主题色相/);
  assert.doesNotMatch(source, /localStorage\.setItem\("theme-hue"/);
});

test("keeps the site header visible without a manual visibility toggle", async () => {
  const source = await readFile(headerUrl, "utf8");

  assert.doesNotMatch(source, /id="header-visibility-toggle"/);
  assert.doesNotMatch(source, /classList\.add\("is-hidden"\)/);
  assert.match(source, /classList\.remove\([\s\S]*"site-header-hidden"/);
});
