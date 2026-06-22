import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const themeUrl = new URL("../src/styles/theme.css", import.meta.url);
const typographyUrl = new URL(
  "../src/styles/typography.css",
  import.meta.url
);

test("uses a sans-serif font stack for the application", async () => {
  const theme = await readFile(themeUrl, "utf8");
  const appFont = theme.match(/--font-app:\s*([\s\S]*?);/)?.[1] ?? "";

  assert.match(appFont, /"Segoe UI"/);
  assert.match(appFont, /"Microsoft YaHei"/);
  assert.match(appFont, /sans-serif/);
  assert.doesNotMatch(appFont, /ui-monospace|monospace/);
});

test("keeps code monospace and headings upright", async () => {
  const theme = await readFile(themeUrl, "utf8");
  const typography = await readFile(typographyUrl, "utf8");

  assert.match(theme, /--font-code:[\s\S]*?ui-monospace[\s\S]*?monospace;/);
  assert.match(typography, /font-family:\s*var\(--font-code\)/);
  assert.doesNotMatch(typography, /h3\s*\{\s*@apply italic;/);
});
