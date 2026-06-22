import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_GRAPH_SETTINGS,
  filterGraphNodes,
  normalizeGraphSettings,
} from "../src/utils/knowledgeGraphSettings.mjs";

const nodes = [
  { id: "a", title: "Astro 入门", tags: ["Astro"], degree: 1 },
  { id: "b", title: "Waline 评论", tags: ["Astro", "Waline"], degree: 1 },
  { id: "c", title: "孤立笔记", tags: [], degree: 0 },
];

test("normalizes persisted graph settings to safe ranges", () => {
  assert.deepEqual(
    normalizeGraphSettings({
      labelOpacity: 3,
      nodeSize: 0,
      linkWidth: 9,
      centerForce: -1,
      repelForce: 5,
      linkForce: 2,
      showOrphans: false,
      selectedTags: ["Astro"],
    }),
    {
      ...DEFAULT_GRAPH_SETTINGS,
      labelOpacity: 1,
      nodeSize: 0.5,
      linkWidth: 4,
      centerForce: 0,
      repelForce: 2,
      linkForce: 1,
      showOrphans: false,
      selectedTags: ["Astro"],
    }
  );
});

test("filters nodes by search, tags and orphan visibility", () => {
  assert.deepEqual(
    [...filterGraphNodes(nodes, {
      query: "评论",
      selectedTags: ["Astro"],
      showOrphans: false,
    })],
    ["b"]
  );
});

test("keeps all matching tags when search is empty", () => {
  assert.deepEqual(
    [...filterGraphNodes(nodes, {
      query: "",
      selectedTags: ["Astro"],
      showOrphans: true,
    })].sort(),
    ["a", "b"]
  );
});

test("drops stale persisted tags that are not present in the graph", () => {
  assert.deepEqual(
    normalizeGraphSettings(
      { selectedTags: ["Astro", "Missing"] },
      ["Astro", "Waline"]
    ).selectedTags,
    ["Astro"]
  );
});
