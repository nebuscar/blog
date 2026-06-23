import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import {
  default as remarkResolvePostLinks,
  resetPostLinkIndexForTests,
  resolvePostLinkForTests,
} from "../src/utils/remarkResolvePostLinks.mjs";

const projectRoot = path.resolve(
  import.meta.dirname,
  ".."
);
const articlePath = path.join(
  projectRoot,
  "src/content/posts/新笔记/项目目录结构标准化规范手册.md"
);

test("resolves relative markdown post links to published post URLs", () => {
  resetPostLinkIndexForTests();

  assert.equal(
    resolvePostLinkForTests("探索型生信分析项目管理规范.md", articlePath),
    "/posts/20260624-0121-14fva/"
  );
  assert.equal(
    resolvePostLinkForTests("产品型项目管理规范手册.md", articlePath),
    "/posts/20260624-0158-1r6l1/"
  );
});

test("rewrites markdown link nodes during remark processing", () => {
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

  remarkResolvePostLinks()(tree, { path: articlePath });

  assert.equal(
    tree.children[0].children[0].url,
    "/posts/20260624-0158-1r6l1/"
  );
});

test("keeps non-post and special URLs unchanged", () => {
  resetPostLinkIndexForTests();

  assert.equal(resolvePostLinkForTests("https://example.com/a.md", articlePath), undefined);
  assert.equal(resolvePostLinkForTests("#section", articlePath), undefined);
  assert.equal(resolvePostLinkForTests("/posts/existing/", articlePath), undefined);
  assert.equal(resolvePostLinkForTests("image.png", articlePath), undefined);
});
