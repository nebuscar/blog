import assert from "node:assert/strict";
import test from "node:test";
import rehypeAutoFigure from "../src/utils/rehypeAutoFigure.mjs";

const imageParagraph = (alt, src) => ({
  type: "element",
  tagName: "p",
  properties: {},
  children: [
    {
      type: "element",
      tagName: "img",
      properties: { alt, src },
      children: [],
    },
  ],
});

const captionParagraph = children => ({
  type: "element",
  tagName: "p",
  properties: {},
  children: [
    {
      type: "element",
      tagName: "em",
      properties: {},
      children,
    },
  ],
});

const text = value => ({ type: "text", value });

const image = (alt, src) => ({
  type: "element",
  tagName: "img",
  properties: { alt, src },
  children: [],
});

const emphasis = children => ({
  type: "element",
  tagName: "em",
  properties: {},
  children,
});

const transform = children => {
  const tree = { type: "root", children };
  rehypeAutoFigure()(tree);
  return tree;
};

test("wraps captioned images in figures and numbers them automatically", () => {
  const tree = transform([
    imageParagraph("星形胶质细胞", "https://example.com/astrocyte.png"),
    captionParagraph([text("星形胶质细胞连接神经元与血管")]),
    imageParagraph("少突胶质细胞", "https://example.com/oligodendrocyte.png"),
    captionParagraph([text("少突胶质细胞形成髓鞘")]),
  ]);

  assert.deepEqual(
    tree.children.map(node => node.tagName),
    ["figure", "figure"]
  );
  assert.equal(
    tree.children[0].children[1].children[0].value,
    "图 1："
  );
  assert.equal(
    tree.children[1].children[1].children[0].value,
    "图 2："
  );
});

test("leaves images without an italic caption unchanged", () => {
  const image = imageParagraph("胶质细胞", "https://example.com/glia.png");
  const tree = transform([
    image,
    { type: "element", tagName: "p", properties: {}, children: [text("普通说明文字")] },
  ]);

  assert.equal(tree.children[0], image);
  assert.equal(tree.children[0].tagName, "p");
});

test("preserves inline formatting inside captions", () => {
  const link = {
    type: "element",
    tagName: "a",
    properties: { href: "https://example.com/source" },
    children: [text("维基百科")],
  };
  const tree = transform([
    imageParagraph("少突胶质细胞", "https://example.com/cell.png"),
    captionParagraph([text("图片来源："), link]),
  ]);

  assert.equal(tree.children[0].children[1].tagName, "figcaption");
  assert.equal(tree.children[0].children[1].children[2], link);
});

test("wraps image and italic caption when they are in the same paragraph", () => {
  const tree = transform([
    {
      type: "element",
      tagName: "p",
      properties: {},
      children: [
        text("Intro text."),
        image("sample", "https://example.com/sample.png"),
        text("\n"),
        emphasis([text("Inline caption")]),
      ],
    },
  ]);

  assert.deepEqual(
    tree.children.map(node => node.tagName),
    ["p", "figure"]
  );
  assert.equal(tree.children[1].children[1].tagName, "figcaption");
  assert.equal(tree.children[1].children[1].children[1].value, "Inline caption");
});
