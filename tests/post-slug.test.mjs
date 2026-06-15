import assert from "node:assert/strict";
import test from "node:test";
import { createPostSlug } from "../src/utils/postSlug.mjs";

test("creates a compact slug from publication time and article identity", () => {
  assert.match(
    createPostSlug(
      new Date("2026-06-15T18:35:00+08:00"),
      "为Astro博客接入Waline评论系统.md"
    ),
    /^20260615-1835-[a-z0-9]{5}$/
  );
});

test("avoids collisions when articles share a publication time", () => {
  const time = new Date("2026-06-15T18:35:00+08:00");
  assert.notEqual(createPostSlug(time, "a.md"), createPostSlug(time, "b.md"));
});

test("keeps the slug stable for the same article", () => {
  const time = new Date("2026-06-15T18:35:00+08:00");
  assert.equal(createPostSlug(time, "a.md"), createPostSlug(time, "a.md"));
});
