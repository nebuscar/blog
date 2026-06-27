---
title: "PlantGeneWiki-工程化架构"
description: "用户直接使用交互的窗口"
pubDatetime: 2026-06-25T17:09:00.000Z
modDatetime: 2026-06-28T00:33:39+08:00
slug: 20260626-0109-1arz4
legacySlug: "新笔记/plantgenewiki-工程化架构"
tags: []
---
## 1 面向用户的前端服务层
*用户直接使用交互的窗口*
*用户能用什么*

| 能力        | 说明                                                   |
| --------- | ---------------------------------------------------- |
| Wiki 页面   | Gene、Species、Dataset、SequenceRecord、Literature 等对象页面 |
| 关键词检索[^1] | 搜索基因 ID、物种名、数据集、文献标题、别名                              |
| 知识图谱查询跳转  | 在页面中展示对象关系，并支持跳转到相关 Gene、Trait、Orthogroup、Literature |
| 语义检索[^2]      | 用户用自然语言描述问题，系统找相关页面、文献、证据                            |
| AI 对话     | 基于知识库检索结果进行解释、总结和推理                                  |
| 即时分析计算    | BLAST、GO/KEGG 富集、候选基因分析等，建议先做入口和任务模型                 |
## 2 后台智能体与自动化流水线
*自动执行维护和分析任务*

### 2.1 Data Ingestion Agent
*存储对象、关系、索引、文件、任务状态*

### 2.2 Normalization Agent

### 2.3 Evidence Evaluation Agent

### 2.4 Archive Agent

### 2.5 Indexing Agent
### 2.6 Literature Curation Agent

### 2.7 Evidence Evaluation Agent

### 2.8 Analysis Agent

### 2.9 User Task Agent

## 3 数据与基础设施层

| 组件         | 存什么                                        | 作用             |
| ---------- | ------------------------------------------ | -------------- |
| 对象数据库      | Gene、Species、Dataset、Literature、Trait      | 保存标准知识对象       |
| 关系数据库/图数据库 | Gene-Trait、Gene-Orthogroup、Gene-Literature | 支撑知识图谱查询       |
| 证据数据库      | EvidenceClaim、confidence、source            | 支撑可信度和追溯       |
| 对象存储       | FASTA、GFF、PDF、BLAST 库、大文件                  | 保存不可直接进数据库的大文件 |
| 搜索索引       | 标题、别名、描述、摘要                                | 支撑关键词检索        |
| 向量数据库      | 文本 embedding                               | 支撑语义检索         |
| 任务队列       | BLAST、GO/KEGG、文献处理任务                       | 支撑异步计算         |
| 计算环境       | BLAST、Python/R、生信工具                        | 执行分析任务         |
| 日志与归档      | 更新日志、checksum、版本报告                         | 支撑复现和回滚        |


---

[^1]: 关键词检索：例如：【输入：“Atha01G0000010”；返回 ：ID 或别名匹配的 Gene 页面】
[^2]: 语义检索：不是按字面匹配，而是按语义相似度找内容。通常依赖：文本切片、embedding 模型、向量数据库、召回排序...；适合查询“某个性状相关研究” 、“某类功能基因”、“某个研究主题”、“某个生物过程相关的文献”。例如：【输入：“与油菜开花时间相关的候选基因”；返回：相关 Gene、Trait、Literature、EvidenceClaim】