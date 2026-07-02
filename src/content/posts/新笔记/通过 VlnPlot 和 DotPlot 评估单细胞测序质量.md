---
title: "通过 VlnPlot 和 DotPlot 评估单细胞测序质量"
description: "在单细胞/单核 RNA-seq 数据分析中，质控的核心目的不是简单画图，而是判断数据中是否存在低质量细胞、潜在 doublet/multiplet、样本级异常以及技术批次差异。"
pubDatetime: 2026-06-29T18:03:00.000Z
modDatetime: 2026-07-02T14:00:50+08:00
slug: 20260630-0203-18h7p
legacySlug: "新笔记/通过vlnplot和dotplot评估单细胞测序质量"
tags:
  - "单细胞"
---
## 1 通过 VlnPlot 和 DotPlot 评估单细胞测序质量

在单细胞/单核 RNA-seq 数据分析中，质控的核心目的不是简单画图，而是判断数据中是否存在低质量细胞、潜在 doublet/multiplet、样本级异常以及技术批次差异。

本文使用两类图进行质控评估：

- **VlnPlot**：观察每个样本内部所有细胞/细胞核的 QC 指标分布。
- **median dotplot**：观察每个样本的 QC 指标中位数，用于快速识别样本级异常。

二者并不重复。VlnPlot 更关注细胞层面的分布形态和异常长尾；median dotplot 更关注样本层面的整体偏移。

## 2 主要 QC 指标含义

| 指标               | 含义                  | 主要用途                           |
| ---------------- | ------------------- | ------------------------------ |
| `nCount_RNA`     | 每个细胞/细胞核检测到的 UMI 总数 | 反映测序深度和 RNA 捕获量                |
| `nFeature_RNA`   | 每个细胞/细胞核检测到的基因数     | 反映转录组复杂度                       |
| `percent.mt`     | 线粒体基因表达比例           | 评估细胞损伤、应激或低质量细胞                |
| `percent.rb`     | 核糖体蛋白基因表达比例         | 观察 RNA 组成异常或样本差异               |
| `percent.hb`     | 血红蛋白相关基因比例          | 评估红细胞或血液污染                     |
| `percent.malat1` | MALAT1 表达比例         | 在 snRNA-seq 中可作为核内 RNA 特征的辅助指标 |

其中，`nCount_RNA`、`nFeature_RNA` 和 `percent.mt` 是最基础的 QC 指标。`percent.hb`、`percent.rb` 和 `percent.malat1` 更多用于辅助判断污染、组织背景或数据类型特征。

## 3 绘制 VlnPlot：观察细胞层面的分布

样本数量较多时，不建议把所有 QC 指标强行放在一张图中。更合适的做法是每个指标单独一页，最终输出为多页 PDF；如果用于博客展示，则可将 PDF 每页导出并裁剪为 PNG。

```r
qc_features <- c(
    "nCount_RNA",
    "nFeature_RNA",
    "percent.mt",
    "percent.rb",
    "percent.hb",
    "percent.malat1"
)

pdf(
    file = file.path(
        params$fig_dir,
        "01_qc_violin_by_sample_unfiltered_multipage.pdf"
    ),
    width = 16,
    height = 5
)

for (feat in qc_features) {
    p <- VlnPlot(
        merged_obj,
        features = feat,
        group.by = "sample_title",
        pt.size = 0,
        layer = "counts",
        raster = FALSE
    ) +
        ggtitle(feat) +
        theme_bw(base_size = 10) +
        theme(
            plot.title = element_text(
                hjust = 0.5,
                face = "bold"
            ),
            axis.title.x = element_blank(),
            axis.text.x = element_text(
                angle = 90,
                hjust = 1,
                vjust = 0.5,
                size = 6
            ),
            legend.position = "none"
        )

    print(p)
}

dev.off()
```

## 4 nCount_RNA：判断测序深度和 RNA 捕获量

![通过 VlnPlot 和 DotPlot 评估单细胞测序质量 2026 06 30 ebe99bc6 8a74 45aa 8f82 bf8cd175f43f](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/30/通过-VlnPlot-和-DotPlot-评估单细胞测序质量_2026-06-30_ebe99bc6-8a74-45aa-8f82-bf8cd175f43f.png)

`nCount_RNA` 表示每个细胞/细胞核检测到的 UMI 总数，可用于评估测序深度和 RNA 捕获量。

从图中可以看到，大多数样本的主体分布集中在较低区域，同时存在明显长尾。长尾细胞可能来自 RNA 含量较高的细胞，也可能包括 doublet/multiplet 或极端高表达细胞。

判断时应重点关注：

- 是否有样本整体 `nCount_RNA` 明显偏低，提示捕获效率较差；
- 是否有样本整体 `nCount_RNA` 明显偏高，提示潜在批次差异；
- 是否有极端高值长尾，后续需要结合 `nFeature_RNA` 判断 doublet/multiplet 风险。

## 5 nFeature_RNA：判断转录组复杂度

![通过 VlnPlot 和 DotPlot 评估单细胞测序质量 2026 06 30 490fb230 3020 4589 bd4d 27dd4ba4a226](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/30/通过-VlnPlot-和-DotPlot-评估单细胞测序质量_2026-06-30_490fb230-3020-4589-bd4d-27dd4ba4a226.png)

`nFeature_RNA` 表示每个细胞/细胞核检测到的基因数，是评估转录组复杂度的重要指标。

图中多数样本的主体分布较为集中，但不同样本之间仍存在一定差异。一般来说：

- `nFeature_RNA` 过低，提示低质量细胞或空液滴；
- `nFeature_RNA` 过高，可能提示 doublet/multiplet；
- 如果某个样本整体分布明显偏低，说明该样本的捕获质量可能较差。

`nFeature_RNA` 不应单独解读，通常需要和 `nCount_RNA` 一起判断。如果某些细胞同时具有极高 `nCount_RNA` 和极高 `nFeature_RNA`，更需要警惕 doublet/multiplet。

## 6 percent.mt：判断线粒体比例和低质量细胞

![通过 VlnPlot 和 DotPlot 评估单细胞测序质量 2026 06 30 2ce7d2e5 43ac 44ea 89e0 a9a68dbba0dc](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/30/通过-VlnPlot-和-DotPlot-评估单细胞测序质量_2026-06-30_2ce7d2e5-43ac-44ea-89e0-a9a68dbba0dc.png)

`percent.mt` 表示线粒体基因表达比例。在线粒体比例较高的细胞中，常见原因包括细胞损伤、细胞应激、细胞膜破裂或样本处理质量较差。

从图中可以看到，大多数样本主体分布接近低线粒体比例区域，但不少样本存在明显高线粒体长尾，个别样本的长尾可延伸到很高区间。这说明数据中存在一部分高线粒体比例细胞/细胞核。

需要注意的是，如果这是 snRNA-seq 数据，不能简单照搬 scRNA-seq 中常用的 `percent.mt < 5%` 过滤标准。snRNA-seq 的线粒体比例通常整体较低，但样本间差异仍然值得关注。

因此，`percent.mt` 更适合用于：

- 发现低质量细胞群体；
- 识别整体线粒体比例偏高的样本；
- 辅助设定过滤阈值，例如 `percent.mt < 10` 或更宽松/更严格的阈值。

## 7 percent.rb：观察核糖体基因比例

![通过 VlnPlot 和 DotPlot 评估单细胞测序质量 2026 06 30 cec3800e 27af 410c 89cf 9997db081afc](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/30/通过-VlnPlot-和-DotPlot-评估单细胞测序质量_2026-06-30_cec3800e-27af-410c-89cf-9997db081afc.png)

`percent.rb` 表示核糖体蛋白基因表达比例。该指标一般不是最核心的过滤标准，但可用于观察样本间 RNA 组成是否存在异常。

图中多数样本主体比例较低，但个别样本存在较长尾部，说明少量细胞存在较高核糖体基因比例。通常不建议仅凭 `percent.rb` 删除细胞或样本，而应结合其他 QC 指标、细胞类型组成和后续聚类结果综合判断。

## 8 percent.hb：判断血红蛋白污染

![通过 VlnPlot 和 DotPlot 评估单细胞测序质量 2026 06 30 8d2c31bd 2875 434d af24 913bed0d4ff9](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/30/通过-VlnPlot-和-DotPlot-评估单细胞测序质量_2026-06-30_8d2c31bd-2875-434d-af24-913bed0d4ff9.png)

`percent.hb` 表示血红蛋白相关基因比例，可用于评估红细胞污染或血液来源污染。

从图中可以看到，大多数样本主体分布几乎贴近 0，说明血红蛋白信号不是普遍性的样本污染。但部分样本存在极端高值长尾，说明有少量细胞/细胞核具有较高血红蛋白信号。

这种情况通常更适合进行细胞层面的过滤，而不是直接删除整个样本。只有当某个样本整体 `percent.hb` 都明显偏高时，才需要考虑该样本是否存在严重污染。

## 9 percent.malat1：观察核内 RNA 特征

![通过 VlnPlot 和 DotPlot 评估单细胞测序质量 2026 06 30 37e8d0b6 95a7 4c6c b40f f2ac10e53f08](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/30/通过-VlnPlot-和-DotPlot-评估单细胞测序质量_2026-06-30_37e8d0b6-95a7-4c6c-b40f-f2ac10e53f08.png)

`MALAT1` 是常见的核内长链非编码 RNA。在 snRNA-seq 数据中，`percent.malat1` 可作为核 RNA 特征的辅助指标。

从图中可以看到，各样本的 `percent.malat1` 主体分布整体相近，但仍存在样本间差异和长尾。该指标一般不作为强过滤标准，更适合作为辅助观察指标。

如果某些样本的 `percent.malat1` 整体明显偏离其他样本，需要结合样本来源、组织处理方式和测序平台进一步判断。

## 10 绘制 median dotplot：观察样本层面的 QC 总览

VlnPlot 展示的是细胞层面的完整分布，但当样本数量较多时，很难快速判断哪个样本整体偏离。因此，可以将每个样本的 QC 指标压缩为中位数，并绘制 median dotplot。

```r
qc_summary <- merged_obj@meta.data |>
    group_by(
        sample_title,
        Diagnosis,
        APOE,
        genotype_raw,
        group,
        Sex
    ) |>
    summarise(
        n_nuclei = n(),
        median_nCount_RNA = median(nCount_RNA),
        median_nFeature_RNA = median(nFeature_RNA),
        median_percent_mt = median(percent.mt),
        median_percent_rb = median(percent.rb),
        median_percent_hb = median(percent.hb),
        median_percent_malat1 = median(percent.malat1),
        .groups = "drop"
    )

qc_summary_long <- qc_summary |>
    mutate(
        sample_num = as.integer(gsub("^GEX_|R$", "", sample_title)),
        sample_title = factor(
            sample_title,
            levels = matrix_table$sample_title
        )
    ) |>
    pivot_longer(
        cols = c(
            median_nCount_RNA,
            median_nFeature_RNA,
            median_percent_mt,
            median_percent_rb,
            median_percent_hb,
            median_percent_malat1
        ),
        names_to = "metric",
        values_to = "value"
    )

p_qc_summary <- ggplot(
    qc_summary_long,
    aes(
        x = sample_title,
        y = value
    )
) +
    geom_point(size = 1.6) +
    facet_wrap(
        ~ metric,
        scales = "free_y",
        ncol = 2
    ) +
    theme_bw(base_size = 10) +
    theme(
        axis.title.x = element_blank(),
        axis.text.x = element_text(
            angle = 90,
            hjust = 1,
            vjust = 0.5,
            size = 6
        )
    ) +
    ylab("Median value")

ggsave(
    file.path(
        params$fig_dir,
        "01_qc_median_dotplot_by_sample_unfiltered.png"
    ),
    plot = p_qc_summary,
    width = 14,
    height = 9,
    dpi = 300,
    limitsize = FALSE
)
```

![通过 VlnPlot 和 DotPlot 评估单细胞测序质量 2026 06 30 fb9a5818 fc8b 40ad afd4 136171a79c1f](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/30/通过-VlnPlot-和-DotPlot-评估单细胞测序质量_2026-06-30_fb9a5818-fc8b-40ad-afd4-136171a79c1f.png)

median dotplot 中，每个点代表一个样本的 QC 指标中位数。它不是为了展示单个细胞的分布，而是用于判断样本整体是否偏离其他样本。

从这张图可以重点观察：

- `median_nCount_RNA`：样本之间测序深度/UMI 捕获量存在差异；
- `median_nFeature_RNA`：样本之间检测基因数存在差异，提示捕获复杂度不同；
- `median_percent_mt`：多数样本中位线粒体比例较低，但有个别样本明显偏高，例如图中右侧某些样本；
- `median_percent_hb`：多数样本中位数接近 0，说明 Hb 信号主要是少量细胞的异常长尾，而不是多数样本的整体污染；
- `median_percent_malat1` 和 `median_percent.rb`：用于辅助观察样本间 RNA 组成差异。

因此，median dotplot 的意义是作为一个样本级 QC dashboard，用于快速回答：

> 哪些样本整体质量偏离其他样本？是否需要进一步检查？

## 11 VlnPlot 和 median dotplot 如何配合解读

VlnPlot 和 median dotplot 的作用并不重复，而是互补。

| 图形 | 观察层面 | 优点 | 局限 |
|---|---|---|---|
| VlnPlot | 细胞/细胞核层面 | 展示完整分布、长尾和异常细胞 | 样本多时不易快速比较整体差异 |
| median dotplot | 样本层面 | 快速比较样本整体 QC 水平 | 丢失细胞层面的分布形态 |

推荐解读顺序如下：

1. 先看 median dotplot，快速找出整体偏离的样本；
2. 再回到 VlnPlot，检查这些样本的分布是否整体右移或存在异常长尾；
3. 如果 dotplot 异常且 VlnPlot 也整体异常，需要考虑样本级问题；
4. 如果 dotplot 正常但 VlnPlot 有长尾，通常说明只是少量异常细胞，可通过细胞级过滤处理。

例如，如果某个样本的 `median_percent.mt` 明显偏高，同时在 `percent.mt` VlnPlot 中该样本整体分布也明显右移，则说明该样本整体质量可能较差。相反，如果 median dotplot 中该样本并不突出，但 VlnPlot 中存在少量高值长尾，则更可能是少量低质量细胞，而不是整个样本失败。

## 12 如何根据 QC 图制定过滤策略

过滤阈值不应机械套用，而应结合数据类型、组织来源和图形分布综合判断。

常见过滤思路如下：

```r
merged_obj_filtered <- subset(
    merged_obj,
    subset =
        nFeature_RNA > 200 &
        nFeature_RNA < 8000 &
        percent.mt < 10
)
```

如果数据中存在明显血红蛋白高值细胞，也可以加入 `percent.hb` 过滤：

```r
merged_obj_filtered <- subset(
    merged_obj,
    subset =
        nFeature_RNA > 200 &
        nFeature_RNA < 8000 &
        percent.mt < 10 &
        percent.hb < 1
)
```

需要强调的是，上述阈值只是示例。正式分析前应结合 VlnPlot、median dotplot、散点图以及后续聚类结果综合调整。

## 13 推荐增加的辅助散点图

除了 VlnPlot 和 median dotplot，还建议增加 `nCount_RNA` 与 `nFeature_RNA`、`nCount_RNA` 与 `percent.mt` 的散点图，用于辅助判断 doublet、低质量细胞和高线粒体细胞。

```r
p_count_feature <- FeatureScatter(
    merged_obj,
    feature1 = "nCount_RNA",
    feature2 = "nFeature_RNA",
    group.by = "sample_title",
    raster = TRUE
) +
    theme_bw(base_size = 10)

ggsave(
    file.path(
        params$fig_dir,
        "01_qc_scatter_nCount_vs_nFeature_unfiltered.png"
    ),
    plot = p_count_feature,
    width = 8,
    height = 6,
    dpi = 300,
    limitsize = FALSE
)

p_count_mt <- FeatureScatter(
    merged_obj,
    feature1 = "nCount_RNA",
    feature2 = "percent.mt",
    group.by = "sample_title",
    raster = TRUE
) +
    theme_bw(base_size = 10)

ggsave(
    file.path(
        params$fig_dir,
        "01_qc_scatter_nCount_vs_percent_mt_unfiltered.png"
    ),
    plot = p_count_mt,
    width = 8,
    height = 6,
    dpi = 300,
    limitsize = FALSE
)
```

## 14 小结

VlnPlot 和 median dotplot 在单细胞测序质控中承担不同角色。VlnPlot 适合观察细胞层面的完整分布，发现异常长尾、低质量细胞和潜在 doublet。median dotplot 适合观察样本层面的整体 QC 状态，快速识别偏离其他样本的异常样本。

因此，median dotplot 不是“为了做图而做图”，而是样本级 QC 概览图。实际分析中，建议将 median dotplot 作为主图或博客中的概览图，将多页 VlnPlot 拆分为多个 PNG，放在对应指标的解释位置，用于对照说明每个 QC 指标的判断逻辑。

[10X单细胞转录组常见问题](10X单细胞转录组常见问题.md)