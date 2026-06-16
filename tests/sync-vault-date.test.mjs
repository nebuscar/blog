import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { normalizeDate, syncVault } from "../scripts/sync-vault.mjs";

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

test("publishes public notes and notes marked with publish true", () => {
  const root = mkdtempSync(join(tmpdir(), "vault-sync-"));
  const target = join(root, "blog", "src", "content", "posts");

  mkdirSync(join(root, "public"), { recursive: true });
  mkdirSync(join(root, "notes"), { recursive: true });
  mkdirSync(join(root, "private"), { recursive: true });

  writeFileSync(
    join(root, "public", "Public Note.md"),
    [
      "---",
      "title: Public Note",
      "pubDate: 2026-06-16T10:00:00+08:00",
      "---",
      "",
      "This note is in public.",
    ].join("\n")
  );
  writeFileSync(
    join(root, "notes", "Published Note.md"),
    [
      "---",
      "title: Published Note",
      "publish: true",
      "pubDate: 2026-06-16T11:00:00+08:00",
      "---",
      "",
      "This note is outside public but marked for publishing.",
    ].join("\n")
  );
  writeFileSync(
    join(root, "private", "Private Note.md"),
    [
      "---",
      "title: Private Note",
      "pubDate: 2026-06-16T12:00:00+08:00",
      "---",
      "",
      "This note should stay out of the blog.",
    ].join("\n")
  );

  assert.equal(
    syncVault(root, target, { redirectsFile: join(root, "_redirects.txt") }),
    2
  );
  assert.ok(existsSync(join(target, "Public Note.md")));
  assert.ok(existsSync(join(target, "notes", "Published Note.md")));
  assert.equal(existsSync(join(target, "private", "Private Note.md")), false);

  const publicPost = readFileSync(join(target, "Public Note.md"), "utf8");
  assert.match(publicPost, /legacySlug: "publicnote"/);
});
