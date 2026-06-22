import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_TOC_WIDTH,
  MAX_TOC_WIDTH,
  MIN_TOC_WIDTH,
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
