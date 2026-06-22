import assert from "node:assert/strict";
import test from "node:test";

import {
  clampContextPosition,
  getDefaultContextPosition,
} from "../src/utils/postContextPosition.mjs";

test("centers the toolbar near the right edge by default", () => {
  assert.deepEqual(
    getDefaultContextPosition(
      { width: 1200, height: 800 },
      { width: 60, height: 240 }
    ),
    { x: 1064, y: 280 }
  );
});

test("keeps a dragged toolbar inside the viewport", () => {
  assert.deepEqual(
    clampContextPosition(
      { x: 1190, y: -40 },
      { width: 1200, height: 800 },
      { width: 60, height: 240 }
    ),
    { x: 1124, y: 16 }
  );
});
