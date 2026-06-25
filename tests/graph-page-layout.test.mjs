import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const graphPageUrl = new URL("../src/pages/graph.astro", import.meta.url);
const layoutUrl = new URL("../src/layouts/Layout.astro", import.meta.url);
const globalStyleUrl = new URL("../src/styles/global.css", import.meta.url);

test("uses a fixed viewport layout for the graph page", async () => {
  const source = await readFile(graphPageUrl, "utf8");

  assert.match(source, /<Layout[^>]*fixedViewport/);
  assert.doesNotMatch(source, /Footer/);
  assert.doesNotMatch(source, /Breadcrumb/);
});

test("locks document scrolling for fixed viewport pages", async () => {
  const [layout, globalCss] = await Promise.all([
    readFile(layoutUrl, "utf8"),
    readFile(globalStyleUrl, "utf8"),
  ]);

  assert.match(layout, /data-page-layout=\{fixedViewport \? "fixed" : "document"\}/);
  assert.match(globalCss, /body\[data-page-layout="fixed"\]/);
  assert.match(globalCss, /overflow:\s*hidden;/);
});
