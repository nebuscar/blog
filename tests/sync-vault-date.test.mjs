import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
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

test("treats Obsidian local date-times as Asia Shanghai time", () => {
  assert.equal(
    normalizeDate("2026-06-17 16:36", "2026-06-17T08:30:00.000Z"),
    "2026-06-17T08:36:00.000Z"
  );
});

test("publishes only notes marked with publish true", () => {
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
    1
  );
  assert.equal(existsSync(join(target, "Public Note.md")), false);
  assert.ok(existsSync(join(target, "notes", "Published Note.md")));
  assert.equal(existsSync(join(target, "private", "Private Note.md")), false);

  const publishedPost = readFileSync(
    join(target, "notes", "Published Note.md"),
    "utf8"
  );
  assert.match(publishedPost, /legacySlug: "notes\/publishednote"/);
});

test("uses Git modified time instead of Obsidian update fields", () => {
  const root = mkdtempSync(join(tmpdir(), "vault-sync-git-date-"));
  const target = join(root, "blog", "src", "content", "posts");
  const note = join(root, "Published Note.md");

  execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "Test Bot"], { cwd: root });
  execFileSync("git", ["config", "user.email", "test@example.com"], {
    cwd: root,
  });

  writeFileSync(
    note,
    [
      "---",
      "title: Published Note",
      "publish: true",
      "pubDatetime: 2026-06-16T11:00:00+08:00",
      "updatedDate: 2099-01-01T00:00:00+08:00",
      "---",
      "",
      "First version.",
    ].join("\n")
  );
  execFileSync("git", ["add", "Published Note.md"], { cwd: root });
  execFileSync("git", ["commit", "-m", "Initial note"], {
    cwd: root,
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: "2026-06-16T11:00:00+08:00",
      GIT_COMMITTER_DATE: "2026-06-16T11:00:00+08:00",
    },
    stdio: "ignore",
  });

  writeFileSync(
    note,
    [
      "---",
      "title: Published Note",
      "publish: true",
      "pubDatetime: 2026-06-16T11:00:00+08:00",
      "updatedDate: 2099-01-01T00:00:00+08:00",
      "---",
      "",
      "Second version.",
    ].join("\n")
  );
  execFileSync("git", ["add", "Published Note.md"], { cwd: root });
  execFileSync("git", ["commit", "-m", "Update note"], {
    cwd: root,
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: "2026-06-18T09:30:00+08:00",
      GIT_COMMITTER_DATE: "2026-06-18T09:30:00+08:00",
    },
    stdio: "ignore",
  });

  syncVault(root, target, { redirectsFile: join(root, "_redirects.txt") });

  const publishedPost = readFileSync(join(target, "Published Note.md"), "utf8");
  assert.match(publishedPost, /pubDatetime: 2026-06-16T03:00:00.000Z/);
  assert.match(publishedPost, /modDatetime: 2026-06-18T09:30:00\+08:00/);
  assert.doesNotMatch(publishedPost, /2099-01-01/);
});
