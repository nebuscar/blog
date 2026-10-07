import assert from "node:assert/strict";
import path from "node:path";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import test from "node:test";
import {
  default as remarkResolvePostLinks,
  resetPostLinkIndexForTests,
  resolvePostLinkForTests,
} from "../src/utils/remarkResolvePostLinks.mjs";

function createPostFixture() {
  const root = mkdtempSync(path.join(tmpdir(), "remark-post-links-"));
  const postsDir = path.join(root, "posts");
  const articleDir = path.join(postsDir, "新笔记");
  mkdirSync(articleDir, { recursive: true });
  writeFileSync(
    path.join(articleDir, "项目目录结构标准化规范手册.md"),
    "---\ntitle: 项目目录结构标准化规范手册\n---\n"
  );
  writeFileSync(
    path.join(postsDir, "探索型生信分析项目管理规范.md"),
    "---\ntitle: 探索型生信分析项目管理规范\nslug: 20260624-0121-14fva\n---\n"
  );
  writeFileSync(
    path.join(postsDir, "产品型项目管理规范手册.md"),
    "---\ntitle: 产品型项目管理规范手册\nslug: 20260624-0158-1r6l1\n---\n"
  );
  return {
    root,
    postsDir,
    articlePath: path.join(articleDir, "项目目录结构标准化规范手册.md"),
  };
}

test("resolves relative markdown post links to published post URLs", () => {
  const fixture = createPostFixture();
  resetPostLinkIndexForTests();

  try {
    assert.equal(
      resolvePostLinkForTests(
        "探索型生信分析项目管理规范.md",
        fixture.articlePath,
        fixture.postsDir
      ),
      "/posts/20260624-0121-14fva/"
    );
    assert.equal(
      resolvePostLinkForTests(
        "产品型项目管理规范手册.md",
        fixture.articlePath,
        fixture.postsDir
      ),
      "/posts/20260624-0158-1r6l1/"
    );
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("rewrites markdown link nodes during remark processing", () => {
  const fixture = createPostFixture();
  resetPostLinkIndexForTests();
  const tree = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "link",
            url: "产品型项目管理规范手册.md",
            children: [{ type: "text", value: "产品型项目管理规范手册" }],
          },
        ],
      },
    ],
  };

  try {
    remarkResolvePostLinks({ postsDir: fixture.postsDir })(tree, {
      path: fixture.articlePath,
    });

    assert.equal(
      tree.children[0].children[0].url,
      "/posts/20260624-0158-1r6l1/"
    );
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("keeps non-post and special URLs unchanged", () => {
  resetPostLinkIndexForTests();

  assert.equal(resolvePostLinkForTests("https://example.com/a.md"), undefined);
  assert.equal(resolvePostLinkForTests("#section"), undefined);
  assert.equal(resolvePostLinkForTests("/posts/existing/"), undefined);
  assert.equal(resolvePostLinkForTests("image.png"), undefined);
});
