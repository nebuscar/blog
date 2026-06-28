---
title: "RNA-seq分析流程SOP"
description: "RNA-seq 分析用于从转录组测序数据中获得基因或转录本表达量，并比较不同实验组之间的表达差异。常见目标包括："
pubDatetime: 2026-06-28T04:32:00.000Z
modDatetime: 2026-06-28T12:51:51+08:00
slug: 20260628-1232-2662y
legacySlug: "rna-seq分析流程sop"
tags: []
---
## 1 图形摘要

![RNA seq分析流程SOP 2026 06 28 6fb2b166 701c 4ff4 841b fe8b753e7333](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/28/RNA-seq分析流程SOP_2026-06-28_6fb2b166-701c-4ff4-841b-fe8b753e7333.png)
## 2 分析目的

RNA-seq 分析用于从转录组测序数据中获得基因或转录本表达量，并比较不同实验组之间的表达差异。常见目标包括：

- 评估样本整体转录组质量
- 获得基因表达矩阵
- 筛选差异表达基因
- 发现关键通路、功能模块或候选基因
- 为后续 qPCR、功能实验、机制研究提供候选对象

## 3 适用范围

本 SOP 适用于常规 bulk RNA-seq 数据分析。

适用数据：

- Illumina 双端或单端 RNA-seq FASTQ 数据
- mRNA-seq
- total RNA-seq
- strand-specific RNA-seq
- 非模式物种有参考基因组或转录组注释的 RNA-seq

不完全适用：

- single-cell RNA-seq
- small RNA-seq
- circRNA-seq
- RIP-seq
- CLIP-seq
- 空间转录组

## 4 输入文件

| 输入 | 格式 | 是否必需 | 说明 |
|---|---|---:|---|
| 原始测序数据 | `.fastq.gz` | 是 | 每个样本通常包含 R1/R2 两个文件 |
| 样本信息表 | `.csv` / `.tsv` | 是 | 包含样本名、分组、批次、处理信息 |
| 参考基因组 | `.fa` / `.fasta` | 是 | 与注释文件版本必须匹配 |
| 基因注释文件 | `.gtf` / `.gff3` | 是 | 用于 reads 计数和功能注释 |
| adapter 序列 | 文本 / FASTA | 视情况 | 去接头时使用 |
| 物种功能注释 | 数据库 / 表格 | 推荐 | GO、KEGG、Reactome、eggNOG 等 |

## 5 推荐目录结构

```text
project_rnaseq/
├── 00_rawdata/
├── 01_fastqc_raw/
├── 02_clean_data/
├── 03_fastqc_clean/
├── 04_reference/
├── 05_alignment/
├── 06_counts/
├── 07_expression/
├── 08_differential_expression/
├── 09_enrichment/
├── 10_figures/
├── 11_report/
└── scripts/
```

## 6 软件与版本记录

| 软件 | 推荐用途 | 版本记录 |
|---|---|---|
| FastQC | 原始数据质控 | 必须记录 |
| MultiQC | 汇总质控报告 | 必须记录 |
| fastp | 去接头和低质量 reads | 必须记录 |
| STAR / HISAT2 | 参考基因组比对 | 二选一或按项目要求 |
| samtools | BAM 处理 | 必须记录 |
| featureCounts / HTSeq-count | 基因 read count | 二选一 |
| Salmon / kallisto | 转录本或准比对定量 | 可选 |
| DESeq2 / edgeR / limma-voom | 差异表达分析 | 按实验设计选择 |
| clusterProfiler | GO/KEGG 富集 | 推荐 |
| R / Python | 统计与绘图 | 必须记录 |

建议在项目中保存软件环境：

```bash
conda env export > environment.yml
```

或记录容器镜像：

```bash
singularity inspect rnaseq.sif > rnaseq_container_info.txt
```

## 7 样本信息表

样本信息表至少应包含：

| sample_id | group | batch | fastq_r1 | fastq_r2 |
|---|---|---|---|---|
| sample_01 | control | batch1 | sample_01_R1.fastq.gz | sample_01_R2.fastq.gz |
| sample_02 | treatment | batch1 | sample_02_R1.fastq.gz | sample_02_R2.fastq.gz |

注意事项：

- `sample_id` 必须唯一
- 分组名称不要包含空格
- FASTQ 文件名与样本表必须完全对应
- 如果存在批次、性别、时间点、组织来源等变量，应单独成列

## 8 分析流程总览

```text
原始 FASTQ
  ↓
原始数据质控
  ↓
去接头和低质量过滤
  ↓
清洗后数据质控
  ↓
参考基因组比对
  ↓
BAM 质控
  ↓
基因 read count 统计
  ↓
表达矩阵整理
  ↓
样本相关性 / PCA / 聚类
  ↓
差异表达分析
  ↓
功能富集分析
  ↓
图表和报告
```

## 9 Step 1：原始数据质控

### 9.1 目的

评估原始 FASTQ 是否存在低质量、接头污染、GC 异常、测序偏好或异常样本。

### 9.2 命令示例

```bash
mkdir -p 01_fastqc_raw

fastqc \
  00_rawdata/*.fastq.gz \
  -o 01_fastqc_raw \
  -t 8

multiqc \
  01_fastqc_raw \
  -o 01_fastqc_raw
```

### 9.3 关注指标

| 指标 | 说明 | 常见判断 |
|---|---|---|
| Per base sequence quality | 每个位点碱基质量 | 后端质量下降较常见 |
| Per sequence quality scores | 每条 reads 总体质量 | 整体偏低需警惕 |
| Adapter Content | 接头污染 | 明显接头污染需要过滤 |
| Per base GC content | GC 分布 | 异常峰可能提示污染 |
| Sequence Duplication Levels | 重复率 | 高表达转录本可能导致重复率升高 |
| Overrepresented sequences | 过度富集序列 | 需判断是否为接头、rRNA 或污染 |

## 10 Step 2：去接头和低质量过滤

### 10.1 目的

去除接头序列、低质量 reads、过短 reads，提高下游比对质量。

### 10.2 命令示例

双端数据：

```bash
mkdir -p 02_clean_data

fastp \
  -i 00_rawdata/sample_01_R1.fastq.gz \
  -I 00_rawdata/sample_01_R2.fastq.gz \
  -o 02_clean_data/sample_01_R1.clean.fastq.gz \
  -O 02_clean_data/sample_01_R2.clean.fastq.gz \
  --detect_adapter_for_pe \
  --length_required 30 \
  --thread 8 \
  --html 02_clean_data/sample_01.fastp.html \
  --json 02_clean_data/sample_01.fastp.json
```

### 10.3 常用参数

| 参数 | 推荐值 | 说明 |
|---|---:|---|
| `--detect_adapter_for_pe` | 开启 | 自动识别双端接头 |
| `--length_required` | 30 | 过滤过短 reads |
| `--qualified_quality_phred` | 15 或 20 | 合格碱基质量阈值 |
| `--unqualified_percent_limit` | 40 | 低质量碱基比例上限 |
| `--n_base_limit` | 5 | N 碱基数量上限 |

## 11 Step 3：清洗后数据质控

### 11.1 命令示例

```bash
mkdir -p 03_fastqc_clean

fastqc \
  02_clean_data/*.clean.fastq.gz \
  -o 03_fastqc_clean \
  -t 8

multiqc \
  02_clean_data 03_fastqc_clean \
  -o 03_fastqc_clean
```

### 11.2 判断重点

- 接头污染是否明显降低
- Q20/Q30 是否满足项目要求
- reads 数量是否过度损失
- GC 分布是否仍异常
- 是否有样本明显低于其他样本

## 12 Step 4：参考基因组索引

### 12.1 STAR 索引示例

```bash
mkdir -p 04_reference/star_index

STAR \
  --runThreadN 16 \
  --runMode genomeGenerate \
  --genomeDir 04_reference/star_index \
  --genomeFastaFiles 04_reference/genome.fa \
  --sjdbGTFfile 04_reference/annotation.gtf \
  --sjdbOverhang 149
```

说明：

- `--sjdbOverhang` 通常设置为 read length - 1
- 150 bp reads 可设为 149
- 参考基因组 FASTA 与 GTF 必须来自同一版本

## 13 Step 5：reads 比对

### 13.1 STAR 比对示例

```bash
mkdir -p 05_alignment/sample_01

STAR \
  --runThreadN 16 \
  --genomeDir 04_reference/star_index \
  --readFilesIn \
    02_clean_data/sample_01_R1.clean.fastq.gz \
    02_clean_data/sample_01_R2.clean.fastq.gz \
  --readFilesCommand zcat \
  --outFileNamePrefix 05_alignment/sample_01/sample_01. \
  --outSAMtype BAM SortedByCoordinate \
  --quantMode GeneCounts
```

### 13.2 BAM 索引

```bash
samtools index \
  05_alignment/sample_01/sample_01.Aligned.sortedByCoord.out.bam
```

### 13.3 比对质控

重点查看 STAR 的 `Log.final.out`：

| 指标 | 含义 | 参考判断 |
|---|---|---|
| Uniquely mapped reads % | 唯一比对率 | 越高越好，过低需排查 |
| Number of input reads | 输入 reads 数 | 与清洗后 reads 数对应 |
| % of reads mapped to multiple loci | 多重比对比例 | 重复序列或同源基因多时升高 |
| % of reads unmapped | 未比对比例 | 过高需排查污染或参考版本 |
| Mismatch rate per base | 错配率 | 异常升高需检查物种和数据质量 |

## 14 Step 6：基因 read count 统计

如果 STAR 已使用 `--quantMode GeneCounts`，可直接使用 STAR 输出的基因计数文件。更常见的方式是使用 featureCounts 统一统计。

### 14.1 featureCounts 示例

```bash
mkdir -p 06_counts

featureCounts \
  -T 8 \
  -p \
  -s 0 \
  -a 04_reference/annotation.gtf \
  -o 06_counts/gene_counts.txt \
  05_alignment/*/*.Aligned.sortedByCoord.out.bam
```

### 14.2 链特异性参数

| 参数 | 说明 |
|---|---|
| `-s 0` | 非链特异性 |
| `-s 1` | 正向链特异性 |
| `-s 2` | 反向链特异性 |

如果建库方式不明确，应先用 RSeQC 或少量测试判断链特异性。

## 15 Step 7：表达矩阵整理

### 15.1 输出矩阵类型

| 矩阵 | 用途 |
|---|---|
| raw count matrix | 差异表达分析 |
| TPM matrix | 样本内或基因表达展示 |
| FPKM matrix | 旧项目或特定报告可能需要 |
| normalized count matrix | PCA、聚类、热图 |

差异分析应优先使用 raw count，不建议直接用 TPM/FPKM 做 DESeq2 或 edgeR 差异检验。

## 16 Step 8：样本整体质控

### 16.1 必做检查

- 每个样本的总 reads 数
- 每个样本的 assigned reads 比例
- 样本间 Pearson/Spearman 相关性
- PCA 分析
- 层次聚类
- 分组内样本是否聚在一起
- 是否存在离群样本

### 16.2 离群样本判断

离群样本不能只凭 PCA 图删除，应结合：

- 原始测序质量
- 比对率
- assigned reads 比例
- 样本来源和实验记录
- 批次信息
- 生物学合理性

## 17 Step 9：差异表达分析

### 17.1 推荐方法

| 方法 | 适用场景 |
|---|---|
| DESeq2 | 常规 bulk RNA-seq，使用广泛 |
| edgeR | 小样本、复杂设计也常用 |
| limma-voom | 样本数较多或设计复杂时常用 |

### 17.2 DESeq2 基本设计

```r
library(DESeq2)

counts <- read.table("06_counts/gene_count_matrix.tsv", header = TRUE, row.names = 1, sep = "\t")
metadata <- read.table("sample_info.tsv", header = TRUE, row.names = 1, sep = "\t")

counts <- counts[, rownames(metadata)]

dds <- DESeqDataSetFromMatrix(
  countData = counts,
  colData = metadata,
  design = ~ group
)

dds <- dds[rowSums(counts(dds)) >= 10, ]
dds <- DESeq(dds)

res <- results(dds, contrast = c("group", "treatment", "control"))
res <- res[order(res$padj), ]

write.csv(as.data.frame(res), "08_differential_expression/DESeq2_treatment_vs_control.csv")
```

### 17.3 常用筛选标准

| 指标 | 常用阈值 |
|---|---|
| adjusted p-value / FDR | `< 0.05` |
| absolute log2 fold change | `>= 1` |
| baseMean | 过滤极低表达基因 |

筛选标准需要根据项目目的调整。探索性分析可放宽阈值，验证候选基因时应更重视效应量、表达量和生物学一致性。

## 18 Step 10：差异结果可视化

常见图表：

- PCA 图
- 样本相关性热图
- 差异基因火山图
- MA plot
- 差异基因表达热图
- top gene boxplot
- 富集分析 dotplot / barplot

图表至少应标注：

- 比较组
- 阈值
- 样本数
- 数据类型
- 统计方法

## 19 Step 11：功能富集分析

### 19.1 输入

- 上调基因列表
- 下调基因列表
- 所有参与检测的背景基因
- 基因 ID 转换表

### 19.2 推荐分析

- GO enrichment
- KEGG enrichment
- Reactome enrichment
- GSEA
- 自定义基因集富集

### 19.3 注意事项

- 背景基因集应使用本次 RNA-seq 中可检测到的基因，而不是全基因组所有基因
- 基因 ID 类型必须统一
- 上调和下调基因建议分开富集
- 富集结果不能直接等同于通路被激活或抑制，需要结合基因方向和表达量解释

## 20 Step 12：结果交付

### 20.1 必交付文件

| 文件 | 说明 |
|---|---|
| `multiqc_report.html` | 原始和清洗后质控报告 |
| `alignment_summary.tsv` | 比对统计汇总 |
| `gene_count_matrix.tsv` | raw count 矩阵 |
| `normalized_expression_matrix.tsv` | 归一化表达矩阵 |
| `differential_expression_results.csv` | 差异表达结果 |
| `DEG_up.tsv` | 上调基因 |
| `DEG_down.tsv` | 下调基因 |
| `PCA.pdf/png` | PCA 图 |
| `volcano.pdf/png` | 火山图 |
| `heatmap.pdf/png` | 热图 |
| `GO_KEGG_enrichment.xlsx` | 富集结果 |
| `analysis_report.html/pdf/docx` | 分析报告 |

## 21 关键质控标准

| 阶段 | 指标 | 建议标准 |
|---|---|---|
| 原始数据 | Q30 | 通常越高越好，低于项目要求需说明 |
| 原始数据 | 接头污染 | 明显污染需过滤 |
| 清洗后 | reads 保留率 | 不应异常低于其他样本 |
| 比对 | 唯一比对率 | 过低需排查参考版本、污染或样本问题 |
| 计数 | assigned reads 比例 | 过低需检查注释和建库类型 |
| 样本 | PCA/相关性 | 生物学重复应整体接近 |
| 差异分析 | dispersion | 离散度异常需排查样本 |
| 富集分析 | 背景基因 | 必须与可检测基因一致 |

## 22 常见问题

### 22.1 比对率很低

可能原因：

- 物种或参考基因组版本错误
- 样本污染
- reads 质量差
- 接头未去除
- rRNA 比例过高
- FASTQ 文件配对错误

处理方式：

- 检查 FastQC/MultiQC
- 用少量 reads 做 BLAST 或 kraken 类物种检查
- 确认参考基因组和注释版本
- 检查 R1/R2 是否对应

### 22.2 assigned reads 比例低

可能原因：

- GTF 版本与基因组不匹配
- 链特异性参数设置错误
- reads 主要落在 intron 或 intergenic 区域
- 注释质量差
- 建库类型与分析参数不一致

处理方式：

- 检查 featureCounts summary
- 测试 `-s 0`、`-s 1`、`-s 2`
- 检查 BAM 与 GTF 染色体命名是否一致
- 使用 RSeQC 查看 reads 分布

### 22.3 PCA 分组不明显

可能原因：

- 处理效应弱
- 批次效应强
- 样本标签错误
- 生物学差异大
- 样本数不足

处理方式：

- 检查样本元数据
- 检查批次变量
- 做样本相关性和聚类
- 必要时在设计公式中加入 batch

### 22.4 差异基因很少

可能原因：

- 生物学效应弱
- 样本量不足
- 组内差异大
- 阈值过严格
- 低表达过滤过强

处理方式：

- 检查样本重复质量
- 查看 log2FC 分布
- 使用 GSEA 这类不依赖硬阈值的分析
- 结合已知 marker 或通路验证

## 23 记录模板

### 23.1 项目信息

| 项目 | 内容 |
|---|---|
| 项目名称 |  |
| 物种 |  |
| 参考基因组版本 |  |
| 注释版本 |  |
| 测序平台 |  |
| 建库类型 |  |
| read length |  |
| 分析负责人 |  |
| 分析日期 |  |

### 23.2 样本分组

| sample_id | group | batch | note |
|---|---|---|---|
|  |  |  |  |

### 23.3 软件版本

| 软件 | 版本 | 参数文件 |
|---|---|---|
| FastQC |  |  |
| fastp |  |  |
| STAR/HISAT2 |  |  |
| featureCounts |  |  |
| DESeq2 |  |  |
| clusterProfiler |  |  |

## 24 最小可复现信息

每个 RNA-seq 项目至少应保存：

- 原始样本信息表
- FASTQ 文件校验值
- 参考基因组下载来源和版本
- GTF/GFF3 下载来源和版本
- 软件版本
- 所有命令行参数
- R/Python 脚本
- 中间质控报告
- 最终结果表
- 最终报告

## 25 后续可链接文档

如果后续继续拆分知识库，可将本 SOP 连接到以下独立文档：

- [原始测序数据质控](原始测序数据质控.md)
- [Reads过滤与清洗](Reads过滤与清洗.md)
- [参考基因组比对](参考基因组比对.md)
- [GO富集分析](GO富集分析.md)
- [GSEA分析](GSEA分析.md)
- [WGCNA共表达网络分析](WGCNA共表达网络分析.md)
