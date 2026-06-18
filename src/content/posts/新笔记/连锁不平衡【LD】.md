---
title: "连锁不平衡【LD】"
description: "Linkage disequilibrium, LD"
pubDatetime: 2026-06-18T19:15:00.000Z
modDatetime: 2026-06-19T04:59:58+08:00
slug: 20260619-0315-1uw94
legacySlug: "新笔记/连锁不平衡ld"
tags: []
---
## 1 概览
<font color="#ffc000">连锁不平衡（Linkage disequilibrium, LD）</font>是指群体内不同位点等位基因之间的非随机关联，重点就三个字：非随机。与此相对的另一个概念是<font color="#ffc000">连锁平衡（Linkage equilibrium, LE）</font>，是指不同位点的等位基因之间是随机遗传的。<font color="#ffc000">简单来说，连锁不平衡就是连锁，不独立。</font>

连锁平衡，也就是两个完全独立的事件，例如今天下雨和明天下雨之间没有关系，是独立的；抛两次硬币正面向上的概率是 0.5 * 0.5 = 0.25，也是独立的。
![连锁不平衡 2026 06 19 790f5421 8b70 44a1 af0a 3abe6b2c5d38](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/19/连锁不平衡_2026-06-19_790f5421-8b70-44a1-af0a-3abe6b2c5d38.png)
*遗传连锁的两种情况：连锁平衡（上）；连锁不平衡（下）*

假如有两个位点，等位基因分别是 A，a 和 B，b。如果他们是完全独立遗传，那么后代出现 AB 的概率理论上是 25%，Ab 是 25%；而如果他们是完全连锁遗传，那么后代出现 AB 的概率理论上是 50%，而 Ab 是 0%。可以发现基因型之间的概率相差较大，这两种情况对理解 LD 很有帮助，第一种情况两个位点是独立遗传的，也就是说不连锁，不存在 LD；第二种情况则是完全连锁，也就是非常彻底的 LD。

那么如何度量位点之间的 LD 呢？

连锁平衡情况下，两个位点 4 种等位基因的遗传如下：
![连锁不平衡 2026 06 19 2af8f140 786f 4ec7 8e1e e30b0d4b726e](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/19/连锁不平衡_2026-06-19_2af8f140-786f-4ec7-8e1e-e30b0d4b726e.png)

由 4 种等位基因（allele）的频率可以得到 4 种等位基因型（单倍型，Haplotype）的频率，因为独立遗传所以就是概率相乘。真实观测到的基因型频率表示为：
![连锁不平衡 2026 06 19 6843128a 3c99 4f5b 871e 51b033b14aa2](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/19/连锁不平衡_2026-06-19_6843128a-3c99-4f5b-871e-51b033b14aa2.png)
因为真实情况下有连锁，所以 AB 的基因型频率 p1q1（理论）和 P11（实际）是不相等的，两者之间的差异大小就度量了 LD。

度量位点间 LD 的基本指标为：
$$
D_{AB} = P_{(AB)} - P_{A}P_{B}
$$
$P_A$ 为位点 1 的等位基因 A 的频率，$P_B$ 为位点 2 的等位基因 B 的频率，$P_{(AB)}$ 为单倍型 AB 的频率。
$D_{AB}$ 度量了单倍型频率 $P_{(AB)}$ 偏离期望频率的程度。若 $D_{AB}$ 为 0，则 单倍型 AB 出现的频率等于期望频率，也就意味着两位点间达到了连锁平衡（LE）；若 $D_{AB}$ 不为 0，则存在 LD，<font color="#ffc000">D 越大代表连锁不平衡程度越大</font>。

有了 D 的计算方法，真实基因型频率可以表示为：
![连锁不平衡 2026 06 19 d5804b35 c3e9 49ed 8229 e586e9f18601](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/19/连锁不平衡_2026-06-19_d5804b35-c3e9-49ed-8229-e586e9f18601.png)
由于 D 受等位基因频率影响较大，因此通常使用标准化后的 D 和 $r^2$ 两个指标来度量群体的连锁不平衡。
$$
D' = \frac{|D|}{D_{\max}}
$$

$$
D_{\max} =
\begin{cases}
\min \left( P_A(1-P_B),\ (1-P_A)P_B \right), & \text{if } D > 0 \\
\min \left( P_A P_B,\ (1-P_A)(1-P_B) \right), & \text{if } D < 0
\end{cases}
$$

$$
r^2 =
\frac{D^2}{P_A(1-P_A)P_B(1-P_B)}
$$
文献中一般用的也是 $r^2$
![连锁不平衡 2026 06 19 1fc2748c 399a 4fba 8a65 36baf9f4a2b2](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/19/连锁不平衡_2026-06-19_1fc2748c-399a-4fba-8a65-36baf9f4a2b2.png)
*Fig 3. Genome-wide association analyses.  
Manhattan plots and accompanying linkage disequilibrium heat maps are depicted for the **(A) e ro interval** and **(B) y v interval** for lines with standard karyotypes. A significance threshold of $P \leq 10^{-5}$ is denoted for Manhattan plots. Each point is a tested genetic variant in the DGRP, and points above this threshold, shown in **black** and enlarged to aid visualization, indicate significantly associating variants.Additionally, the surveyed interval for each chromosome, either **e ro** or **y v**, is bracketed in **red**.The triangular heat map displays the amount of linkage disequilibrium (**LD**, measured here as $r^2$) between variants.**Red** denotes complete LD, and **blue** denotes absence of LD.  
图片来源：https://doi.org/10.1371/journal.pgen.1005951*

### 1.1 结果描述

**上半部分是 GWAS 关联信号图，下面是对应区域的连锁不平衡 LD 热图**。A 和 B 可能代表两个不同性状、不同分析模型或不同样本组。

**上面的散点图**

横轴是基因组位置，按果蝇染色体/染色体臂排列：

```
X, 2L, 2R, 3L, 3R, 4
```

纵轴是：

```
-log10(P value)
```

也就是关联显著性的强度。  
P 值越小，`-log10(P)` 越大，点越高，说明该 SNP/位点和研究性状的关联越强。

灰色点：普通 SNP 位点。  
黑色点：超过显著性阈值或较强关联的 SNP。  
虚线：显著性阈值，大约在 `-log10(P) = 5` 附近。超过虚线的点通常被认为是显著关联位点。

所以，上半部分是在问：

> 哪些基因组位置和目标性状显著相关？

例如 A 图里在 `2R`、`3R` 等区域有较高峰值；B 图里在 `X`、`2L`、`2R`、`3L`、`3R` 都有一些超过阈值的点。

**下面的三角形热图**

下面是 LD，也就是连锁不平衡图。它表示不同 SNP 之间是否倾向于一起遗传。

颜色条从 0 到 1：

```
蓝色 ≈ LD 低，r² 接近 0
绿色/黄色 ≈ 中等 LD
红色 ≈ LD 高，r² 接近 1
```

如果两个 SNP 的 LD 高，说明它们经常一起出现，可能位于同一个单倍型块 haplotype block 中。

黑色斜线框出来的三角区域一般表示 LD block，也就是一组彼此高度相关的 SNP 区域。

**红色括号**

图中的红色括号标出了作者重点关注的候选区域。

A 图中红色括号在右侧，靠近 `3R/4` 附近，表示那里可能是一个候选关联区间。  
B 图中红色括号在左侧，靠近 `X` 染色体区域，表示该区域可能是 B 分析中重点关注的候选区间。

**整体解读方式**

可以按这个逻辑读：

1. 先看上方 Manhattan plot：哪些 SNP 超过虚线，说明显著关联。
2. 再看这些显著 SNP 是否集中成峰：集中成峰说明该区域可能存在候选基因或功能变异。
3. 再看下方 LD 热图：如果显著 SNP 落在高 LD block 里，说明它们可能代表同一个遗传信号。
4. 红色括号通常提示作者认为值得进一步分析的候选区间。

一句话总结：

> 这张图是在展示两个分析结果 A、B 中，全基因组哪些位点与性状显著相关，并结合 LD 热图判断这些显著位点是否聚集在特定遗传区块中。

- [关联分析的基础——连锁不平衡 - 知乎](https://zhuanlan.zhihu.com/p/616119768)