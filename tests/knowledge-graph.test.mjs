import test from "node:test";
import assert from "node:assert/strict";
import {
  buildKnowledgeGraph,
  extractMarkdownPostLinks,
  extractWikiLinks,
  getLocalKnowledgeGraph,
} from "../src/utils/knowledgeGraph.mjs";
import { getConnectedNodeIds } from "../src/utils/knowledgeGraphInteraction.mjs";

const posts = [
  {
    id: "新笔记/SMR",
    filePath: "src/content/posts/新笔记/SMR.md",
    body: "关联 [[连锁不平衡【LD】#基本概念|LD]] 和 [[未发布文章]]。",
    data: {
      title: "SMR",
      legacySlug: "新笔记/smr",
      tags: ["遗传学"],
    },
  },
  {
    id: "新笔记/连锁不平衡【LD】",
    filePath: "src/content/posts/新笔记/连锁不平衡【LD】.md",
    body: "反向提到 [[SMR]]，并重复链接 [[SMR|汇总数据 MR]]。",
    data: {
      title: "连锁不平衡【LD】",
      legacySlug: "新笔记/连锁不平衡ld",
      tags: ["遗传学"],
    },
  },
  {
    id: "新笔记/补体系统",
    filePath: "src/content/posts/新笔记/补体系统.md",
    body: "没有关联。",
    data: {
      title: "补体系统",
      legacySlug: "新笔记/补体系统",
      tags: [],
    },
  },
];

test("extracts Obsidian wikilinks without headings or aliases", () => {
  assert.deepEqual(
    extractWikiLinks(
      "文本 [[SMR]]、[[连锁不平衡【LD】#基本概念|LD]]、![[附件.png]]"
    ),
    ["SMR", "连锁不平衡【LD】"]
  );
});

test("extracts markdown links that point to local posts", () => {
  assert.deepEqual(
    extractMarkdownPostLinks(
      "链接 [项目规范](项目目录结构标准化规范手册.md) 和 [带锚点](子目录/产品型项目管理规范手册.md#section)，忽略 [外链](https://example.com/a.md) 与 ![图片](image.md)。"
    ),
    ["项目目录结构标准化规范手册.md", "子目录/产品型项目管理规范手册.md"]
  );
});

test("builds graph links from markdown post links", () => {
  const graph = buildKnowledgeGraph([
    {
      id: "新笔记/项目目录结构标准化规范手册",
      filePath: "src/content/posts/新笔记/项目目录结构标准化规范手册.md",
      body: "[探索型生信分析项目管理规范](探索型生信分析项目管理规范.md) 和 [产品型项目管理规范手册](产品型项目管理规范手册.md)",
      data: {
        title: "项目目录结构标准化规范手册",
        slug: "20260624-0157-15aa9",
        legacySlug: "新笔记/项目目录结构标准化规范手册",
        tags: [],
      },
    },
    {
      id: "新笔记/探索型生信分析项目管理规范",
      filePath: "src/content/posts/新笔记/探索型生信分析项目管理规范.md",
      body: "",
      data: {
        title: "探索型生信分析项目管理规范手册",
        slug: "20260624-0121-14fva",
        legacySlug: "新笔记/探索型生信分析项目管理规范",
        tags: [],
      },
    },
    {
      id: "新笔记/产品型项目管理规范手册",
      filePath: "src/content/posts/新笔记/产品型项目管理规范手册.md",
      body: "",
      data: {
        title: "产品型项目管理规范手册",
        slug: "20260624-0158-1r6l1",
        legacySlug: "新笔记/产品型项目管理规范手册",
        tags: [],
      },
    },
  ]);

  assert.equal(graph.links.length, 2);
  assert.deepEqual(
    getLocalKnowledgeGraph(graph, "新笔记/项目目录结构标准化规范手册")
      .nodes.map(node => node.id)
      .sort(),
    [
      "新笔记/产品型项目管理规范手册",
      "新笔记/探索型生信分析项目管理规范",
      "新笔记/项目目录结构标准化规范手册",
    ]
  );
});

test("builds links only between published posts and removes duplicates", () => {
  const graph = buildKnowledgeGraph(posts, post => `/posts/${post.id}/`);

  assert.equal(graph.nodes.length, 3);
  assert.deepEqual(graph.links, [
    { source: "新笔记/SMR", target: "新笔记/连锁不平衡【LD】" },
  ]);
});

test("creates a one-hop local graph including backlinks", () => {
  const graph = buildKnowledgeGraph(posts);
  const local = getLocalKnowledgeGraph(graph, "新笔记/SMR");

  assert.deepEqual(
    local.nodes.map(node => node.id),
    ["新笔记/SMR", "新笔记/连锁不平衡【LD】"]
  );
  assert.equal(local.links.length, 1);
});

test("shows the current node for an isolated post", () => {
  const graph = buildKnowledgeGraph(posts);
  assert.deepEqual(getLocalKnowledgeGraph(graph, "新笔记/补体系统"), {
    nodes: [
      {
        id: "新笔记/补体系统",
        title: "补体系统",
        url: "#",
        tags: [],
      },
    ],
    links: [],
  });
});

test("finds only the focused node and its one-hop neighbours", () => {
  const links = [
    { source: "a", target: "b" },
    { source: "c", target: "a" },
    { source: "c", target: "d" },
  ];

  assert.deepEqual([...getConnectedNodeIds(links, "a")].sort(), [
    "a",
    "b",
    "c",
  ]);
});

test("keeps an isolated focused node visible", () => {
  assert.deepEqual([...getConnectedNodeIds([], "isolated")], ["isolated"]);
});
