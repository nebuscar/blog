import test from "node:test";
import assert from "node:assert/strict";
import {
  buildKnowledgeGraph,
  extractWikiLinks,
  getLocalKnowledgeGraph,
} from "../src/utils/knowledgeGraph.mjs";

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
