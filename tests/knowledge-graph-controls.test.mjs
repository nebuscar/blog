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

test("uses wider force layout for the full page graph", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /const isFullPageGraph = root\.classList\.contains/);
  assert.match(source, /const graphSpread = isFullPageGraph \? 0\.38 : 0\.25;/);
  assert.match(source, /const graphRepelBase = isFullPageGraph \? 2200 : 850;/);
  assert.match(
    source,
    /const graphCenterFactor = isFullPageGraph \? 0\.00018 : 0\.0007;/
  );
  assert.match(source, /\? 260\s*: 135;/);
});

test("plays growth animation by node creation time", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /createdAt: string;/);
  assert.match(source, /playGrowthAnimation/);
  assert.match(source, /growthTimeline/);
  assert.match(source, /localeCompare\(second\.createdAt\)/);
  assert.match(source, /播放生长动画/);
  assert.match(source, /停止动画/);
});
