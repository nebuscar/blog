import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL(
  "../src/components/KnowledgeGraph.astro",
  import.meta.url
);

test("renders settings controls only for the full graph", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /data-graph-settings-toggle/);
  assert.match(source, /data-graph-settings-panel/);
  assert.match(source, /data-graph-tag-filter/);
  assert.match(source, /data-graph-show-orphans/);
  assert.match(source, /data-graph-label-opacity/);
  assert.match(source, /data-graph-node-size/);
  assert.match(source, /data-graph-link-width/);
  assert.match(source, /data-graph-animation/);
  assert.match(source, /data-graph-center-force/);
  assert.match(source, /data-graph-repel-force/);
  assert.match(source, /data-graph-link-force/);
  assert.match(source, /\{!compact && \(/);
});
