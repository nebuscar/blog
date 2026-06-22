import test from "node:test";
import assert from "node:assert/strict";
import {
  buildArticleTocTree,
  getArticleTocPath,
} from "../src/utils/articleToc.mjs";

const headings = [
  { depth: 2, slug: "section-a", text: "Section A" },
  { depth: 3, slug: "section-a-one", text: "Section A.1" },
  { depth: 4, slug: "section-a-one-detail", text: "Section A.1.1" },
  { depth: 3, slug: "section-a-two", text: "Section A.2" },
  { depth: 2, slug: "section-b", text: "Section B" },
];

test("builds a nested H2-H4 article directory", () => {
  const tree = buildArticleTocTree(headings);

  assert.equal(tree.length, 2);
  assert.deepEqual(
    tree[0].children.map(node => node.slug),
    ["section-a-one", "section-a-two"]
  );
  assert.deepEqual(
    tree[0].children[0].children.map(node => node.slug),
    ["section-a-one-detail"]
  );
});

test("returns the active heading ancestor path", () => {
  const tree = buildArticleTocTree(headings);

  assert.deepEqual(getArticleTocPath(tree, "section-a-one-detail"), [
    "section-a",
    "section-a-one",
    "section-a-one-detail",
  ]);
});

test("promotes a heading when its expected parent level is absent", () => {
  const tree = buildArticleTocTree([
    { depth: 3, slug: "orphan", text: "Orphan heading" },
  ]);

  assert.equal(tree[0].slug, "orphan");
  assert.deepEqual(tree[0].children, []);
});
