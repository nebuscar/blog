import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDate } from "../scripts/sync-vault.mjs";

test("uses the Git timestamp time when a frontmatter date only contains a day", () => {
  assert.equal(
    normalizeDate("2026-06-15", "2026-06-15T18:42:31+08:00"),
    "2026-06-15T10:42:31.000Z"
  );
});

test("keeps an explicitly configured publication time", () => {
  assert.equal(
    normalizeDate("2026-06-15T20:15:00+08:00", "2026-06-15T18:42:31+08:00"),
    "2026-06-15T12:15:00.000Z"
  );
});

test("keeps the configured day while borrowing the Git timestamp time", () => {
  assert.equal(
    normalizeDate("2026-06-14", "2026-06-15T18:42:31+08:00"),
    "2026-06-14T10:42:31.000Z"
  );
});
