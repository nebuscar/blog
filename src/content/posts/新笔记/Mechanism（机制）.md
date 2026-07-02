---
title: "Mechanism（机制）"
description: "什么是真正的 Mechanism？为什么绝大多数生信论文只有 Correlation，而没有 Mechanism。"
pubDatetime: 2026-07-02T21:10:00.000Z
modDatetime: 2026-07-03T03:50:46+08:00
slug: 20260703-0510-m3ks3
legacySlug: "新笔记/mechanism机制"
tags: []
---
# Mechanism（机制）

> **一句话总结（TL;DR）**

机制（Mechanism）并不是"分析得更多"，而是回答**为什么会发生**。真正的机制研究，是建立事件之间具有方向性的因果解释，而不仅仅是发现它们共同发生。

---

# 为什么重要（Why it matters）

很多研究生第一次投稿都会收到类似意见：

> "The manuscript lacks mechanistic insight."

很多人理解成：

> 实验不够。

其实并不是。

真正的问题通常是：

> **整篇文章没有回答"为什么"。**

例如：

你发现：

- APOE4 表达升高；
- Microglia 数量增加；
- Complement 通路富集；
- CellChat 通讯增强。

这些都只是：

**Observation（观察）**

Reviewer 真正关心的是：

> **为什么 APOE4 最终导致 Microglia 发生这种变化？**

---

# 核心结论（Key Takeaways）

- Mechanism 不是更多分析，而是建立事件之间的解释链。
- Correlation 告诉我们"一起发生"，Mechanism 解释"为什么发生"。
- 一个好的机制必须具有方向性，而不是简单共现。
- 生信论文最大的短板不是分析少，而是缺少机制假说。

---

# 什么是 Mechanism？

Mechanism 可以理解为：

> **一个事件如何导致另一个事件发生。**

例如：

```
APOE4

↓

Lipid metabolism disorder

↓

Microglia activation

↓

Complement activation

↓

Neuron injury
```

这里每一步都具有：

方向

逻辑

解释能力

这就是 Mechanism。

---

# 什么不是 Mechanism？

很多论文都会写：

```
APOE ↑

Microglia ↑

Neuron ↓
```

然后说：

> APOE regulates Microglia.

其实：

不是。

为什么？

因为：

这里只看到：

共同发生。

没有证明：

为什么。

---

# Correlation ≠ Mechanism

这是科研里面最容易混淆的问题。

例如：

发现：

Microglia 增加。

Neuron 减少。

这说明：

二者：

相关。

但是：

不知道：

是谁导致谁。

例如：

下面三种：

```
Microglia

↓

Neuron
```

```
Neuron

↓

Microglia
```

```
Aβ

↓

Microglia

↓

Neuron
```

全部可能成立。

所以：

Correlation

不能证明：

Mechanism。

---

# Mechanism 一定具有方向性

例如：

下面这个：

```
APOE4

↓

Lipid metabolism

↓

Microglia

↓

Complement

↓

Neuron
```

如果：

阻断：

Complement。

Neuron：

恢复。

说明：

方向：

成立。

这就是：

Mechanism。

---

# 为什么 CellChat 不是 Mechanism？

CellChat：

回答的是：

```
可能存在：

Ligand

↓

Receptor
```

但是：

不知道：

有没有：

真正分泌。

不知道：

有没有：

真正结合。

不知道：

有没有：

真正激活。

所以：

CellChat：

属于：

Prediction。

不是：

Mechanism。

---

# 为什么 MR 不是 Mechanism？

MR：

回答：

```
Gene

↓

Disease
```

并不能回答：

```
Gene

↓

Microglia

↓

Neuron
```

因此：

MR：

提供：

Genetic Evidence。

不是：

Mechanistic Evidence。

---

# Mechanism 的四个层级

## 第一层：Phenomenon（现象）

例如：

APOE4 表达升高。

只有：

Observation。

---

## 第二层：Association（关联）

例如：

APOE4

和：

Microglia

相关。

还是：

Observation。

---

## 第三层：Mechanism（机制）

例如：

APOE4

↓

Lipid metabolism

↓

Microglia activation

开始：

解释：

为什么。

---

## 第四层：Causality（因果）

例如：

敲除：

Lipid transporter。

↓

Microglia 恢复。

↓

Neuron 恢复。

真正：

证明。

---

# 为什么很多生信论文发不了一区？

因为：

故事通常这样：

```
下载GEO

↓

DEG

↓

GO

↓

KEGG

↓

PPI

↓

ROC

↓

结束
```

整个过程：

没有：

Mechanism。

所以：

Reviewer：

会说：

> Descriptive.

---

# 如何构建 Mechanism？

推荐：

遵循：

```
Genetics

↓

Cell

↓

Pathway

↓

Communication

↓

Phenotype
```

例如：

```
APOE4

↓

Microglia lipid metabolism

↓

Complement

↓

Astrocyte

↓

Neuron degeneration
```

注意：

不要：

同时讲：

二十条。

只讲：

一条。

---

# Mechanism 决定论文档次

普通论文：

```
Gene

↓

Disease
```

二区：

```
Gene

↓

Cell

↓

Disease
```

一区：

```
Gene

↓

Pathway

↓

Cell state

↓

Disease
```

Nature：

```
Gene

↓

Pathway

↓

Cell state

↓

Cell-cell interaction

↓

Phenotype

↓

Validation
```

Story：

越来越完整。

---

# 结合你的 APOE 课题

目前：

你的方案：

已经：

很好。

但是：

Mechanism：

还不够聚焦。

例如：

现在：

```
APOE

↓

Microglia

↓

CellChat

↓

MR

```

其实：

还是：

Analysis。

建议：

真正聚焦：

例如：

```
APOE4

↓

Lipid metabolism

↓

DAM transition

↓

Complement

↓

Neuron injury
```

所有：

PseudoBulk

Single-cell

CellChat

Spatial

MR

全部：

围绕：

这一条。

而不是：

各讲各的。

---

# 导师点评

不要问：

> 我还能做什么分析？

应该问：

> 我还缺哪一环 Mechanism？

Mechanism：

不是：

Analysis。

Mechanism：

是：

Story。

---

# Reviewer 点评

Reviewer 真正 Reject 一篇论文。

很少因为：

不会：

CellChat。

不会：

MR。

真正 Reject：

通常只有一句：

> **The study remains descriptive and lacks mechanistic insight.**

所以：

以后：

设计课题。

第一件事：

不是：

下载数据。

而是：

画 Mechanism。

---

# 推荐阅读

1. Alberts B. *Molecular Biology of the Cell.*
2. Nature Reviews Neuroscience 关于 Mechanism 的 Perspective 文章。
3. Cell、Nature、Neuron 高水平论文 Discussion 部分。

---

# Wiki Links

[[科学问题]]

[[Research Gap]]

[[Hypothesis]]

[[Correlation]]

[[Causality]]

[[Study Design]]

[[APOE]]

[[Microglia]]

[[Complement]]

[[CellChat]]

[[MR]]