import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_GRAPH_WIDTH,
  DEFAULT_TOC_WIDTH,
  MAX_GRAPH_WIDTH,
  MAX_TOC_WIDTH,
  MIN_GRAPH_WIDTH,
  MIN_TOC_WIDTH,
  clampGraphWidth,
  clampTocWidth,
} from "../src/utils/postLayout.mjs";

test("clamps the resizable directory width", () => {
  assert.equal(clampTocWidth(100), MIN_TOC_WIDTH);
  assert.equal(clampTocWidth(320), 320);
  assert.equal(clampTocWidth(900), MAX_TOC_WIDTH);
});

test("uses the default directory width for invalid input", () => {
  assert.equal(clampTocWidth(Number.NaN), DEFAULT_TOC_WIDTH);
});

test("clamps the resizable graph sidebar width", () => {
  assert.equal(clampGraphWidth(100), MIN_GRAPH_WIDTH);
  assert.equal(clampGraphWidth(320), 320);
  assert.equal(clampGraphWidth(900), MAX_GRAPH_WIDTH);
});

test("uses the default graph sidebar width for invalid input", () => {
  assert.equal(clampGraphWidth(Number.NaN), DEFAULT_GRAPH_WIDTH);
});
