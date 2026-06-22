---
title: "ATG5-Bulk RNAseq与scRNA-seq Methods描述写作参考"
description: "RNA-seq and Single-cell Methods Writing References"
pubDatetime: 2026-06-22T15:01:00.000Z
modDatetime: 2026-06-23T00:48:21+08:00
slug: 20260622-2301-zgrvy
legacySlug: "新笔记/atg5-bulkrnaseq与scrna-seqmethods描述写作参考"
tags: []
---
## 1 转录组 RNA-seq

### 1.1 DESeq2 Differential Expression Analysis
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 22 c7af50c8 08f8 4ce6 b5cb 64bdf0cfe837](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-22_c7af50c8-08f8-4ce6-b5cb-64bdf0cfe837.png)
English example:
```
Differential expression analysis of RNA-seq data was performed using the DESeq2 R package. Raw read count matrices were used as input, and DESeq2 was applied to identify genes differentially expressed between experimental groups. P values were adjusted for multiple testing using the Benjamini-Hochberg method. Genes with adjusted p values below the preset threshold and fold changes exceeding the cutoff were considered differentially expressed. Pairwise comparisons were conducted according to the experimental design, including AD versus control, intervention versus control, and intervention versus AD groups.
```
中文对应：
```
RNA-seq 数据的差异表达分析采用 DESeq2 R 包进行。将原始 read count 矩阵作为输入，利用 DESeq2 对不同实验组之间的基因表达差异进行统计检验，并采用 Benjamini-Hochberg 方法进行多重检验校正。校正后 p 值低于预设阈值且 fold change 达到筛选标准的基因被定义为差异表达基因。根据研究设计，对 AD 组与对照组、干预组与对照组以及干预组与 AD 组进行两两比较。
```
References:
1. Wang et al., 2025. AD astrocyte RNA-seq; Methods 2.2 describes DESeq2 v1.36.0, fold-change cutoff, and Benjamini-Hochberg adjusted p value. [PMC12639471](https://pmc.ncbi.nlm.nih.gov/articles/PMC12639471/)
2. Karthivashan et al., 2026. 5xFAD AD model; Methods 2.6 describes mRNA RNA-seq and DESeq2-based analysis. [PMC13240024](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240024/)
3. Baker et al., 2026. Bulk RNA-seq; Methods describes featureCounts input to DESeq2, FDR correction, and log2FC threshold. [PMC12931797](https://pmc.ncbi.nlm.nih.gov/articles/PMC12931797/)

### 1.2 Functional analysis of DEGs
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 22 7c3ce50a fd19 4f6d 81d4 226ab103fb2b](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-22_7c3ce50a-fd19-4f6d-81d4-226ab103fb2b.png)
#### 1.2.1 GO Enrichment Analysis
English example:
```
To investigate the potential biological functions of differentially expressed genes, Gene Ontology enrichment analysis was performed using clusterProfiler or related enrichment tools. GO terms were analyzed across biological process, cellular component, and molecular function categories. The DEG list was compared with the background gene set, and enrichment significance was evaluated using multiple-testing-adjusted p values. GO terms with adjusted p value or FDR below 0.05 were considered significantly enriched.
```
中文对应：
```
为探究差异表达基因的潜在生物学功能，使用 clusterProfiler 或相关富集分析工具进行 Gene Ontology（GO）富集分析。GO 分析覆盖 biological process、cellular component 和 molecular function 等类别。差异表达基因列表与背景基因集进行比较，采用多重检验校正后的 p 值评估富集显著性，通常将 adjusted p value 或 FDR 小于 0.05 的 GO 条目定义为显著富集。
```
References:
1. Wang et al., 2025. Methods 2.3 describes GO and KEGG functional annotation of DEGs using clusterProfiler v4.4.4. [PMC12639471](https://pmc.ncbi.nlm.nih.gov/articles/PMC12639471/)
2. Karthivashan et al., 2026. Methods 2.6 describes GO analysis of DEGs using clusterProfiler. [PMC13240024](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240024/)
3. Coburn et al., 2025. Methods 2.13 describes GO biological process enrichment/network analysis from single-cell pseudobulk DEGs; useful as GO phrasing reference. [PMC12635866](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)

#### 1.2.2 KEGG Pathway Enrichment Analysis
English example:
```
To further characterize signaling pathways and biological processes associated with differentially expressed genes, KEGG pathway enrichment analysis was performed using the clusterProfiler package. Differentially expressed genes identified from group comparisons were used as input, and enriched pathways were selected according to adjusted p values. KEGG pathways with adjusted p value below 0.05 were considered statistically significant and were used to interpret AD-related molecular alterations.
```
中文对应：
```
为进一步解析差异表达基因参与的信号通路和生物学过程，使用 clusterProfiler 包基于 Kyoto Encyclopedia of Genes and Genomes（KEGG）数据库进行通路富集分析。输入基因为不同组间筛选得到的差异表达基因，富集结果根据校正后 p 值进行筛选。校正后 p 值小于 0.05 的 KEGG pathways 被认为具有统计学意义，并用于解释 AD 相关分子通路改变。
```
References:
1. Wang et al., 2025. Methods 2.3 explicitly describes GO and KEGG pathway analyses using clusterProfiler. [PMC12639471](https://pmc.ncbi.nlm.nih.gov/articles/PMC12639471/)
2. Baker et al., 2026. Methods describes KEGG pathway over-representation analysis, background genes, and padj threshold. [PMC12931797](https://pmc.ncbi.nlm.nih.gov/articles/PMC12931797/)
3. Siregar et al., 2026. Methods 2.5 describes GO/KEGG/GSEA integrative pathway enrichment analysis. [PMC13116960](https://pmc.ncbi.nlm.nih.gov/articles/PMC13116960/)

### 1.3 Gene Set Enrichment Analysis
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 22 3e52a31e 76a7 4b41 a88a 9d4320c1034b](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-22_3e52a31e-76a7-4b41-a88a-9d4320c1034b.png)
English example:
```
To avoid information loss caused by arbitrary DEG cutoffs, Gene Set Enrichment Analysis was performed using a ranked list of all genes. Genes were ranked according to differential expression statistics, log2 fold change, or other ranking metrics, and were tested against predefined gene sets from KEGG, GO, or MSigDB. Enrichment results were evaluated using normalized enrichment score and FDR q value to determine the direction and significance of pathway-level changes between groups.
```
中文对应：
```
为避免仅依赖差异表达基因阈值导致信息丢失，基于所有基因的排序列表进行 Gene Set Enrichment Analysis（GSEA）。基因可按照差异表达统计量、log2 fold change 或其他排序指标进行排序，并与 KEGG、GO 或 MSigDB 中的预定义基因集进行比较。富集结果通过 normalized enrichment score（NES）和 FDR q value 评估，用于判断通路或功能基因集在不同组别中的富集方向和显著性。
```
References:
1. Wang et al., 2025. Methods 2.4 describes KEGG-based GSEA using clusterProfiler. [PMC12639471](https://pmc.ncbi.nlm.nih.gov/articles/PMC12639471/)
2. Karthivashan et al., 2026. Methods 2.6 describes GSEA v4.2.3, MSigDB v7.5.1, and C2/C5 gene sets. [PMC13240024](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240024/)
3. Siregar et al., 2026. Methods includes GSEA together with GO/KEGG pathway analysis. [PMC13116960](https://pmc.ncbi.nlm.nih.gov/articles/PMC13116960/)

## 2 单细胞 scRNA-seq / snRNA-seq
### 2.1 Clustering and UMAP Visualization
English example:
```
Single-cell UMI count matrices were imported into Seurat for preprocessing and clustering analysis. After quality control, normalization, scaling, and identification of highly variable genes, principal component analysis was performed. A shared nearest neighbor graph was constructed using selected principal components, and unsupervised clustering was used to identify cell clusters. UMAP was then applied for two-dimensional visualization of cellular structure and heterogeneity across samples or experimental groups.
```
中文对应：
```
单细胞 UMI count 矩阵导入 Seurat 后进行预处理和聚类分析。首先进行质量控制、标准化、数据缩放和高变基因识别，随后进行 PCA 降维。根据选定主成分构建 shared nearest neighbor 图，并使用无监督聚类方法识别细胞簇。最后采用 UMAP 对细胞进行二维降维可视化，以展示不同样本或实验组中的细胞群体结构和异质性。
```
References:
1. Coburn et al., 2025. Methods 2.10 describes Seurat, QC, PCA, FindNeighbors, FindClusters, and RunUMAP. [PMC12635866](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)
2. Mathys et al., 2019. Classic AD human brain snRNA-seq paper; includes single-nucleus clustering and cell-type analysis. [PMC6865822](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/)
3. Nagata et al., 2024. AD model snRNA-seq; includes microglial state clustering and analysis. [PMC11628182](https://pmc.ncbi.nlm.nih.gov/articles/PMC11628182/)
### 2.2 Marker Identification and Cell Annotation
English example:
```
Differentially expressed genes between clusters were identified using the FindAllMarkers or FindMarkers function in Seurat. Marker genes were filtered according to FDR, log fold change, and the minimum percentage of cells expressing the gene. Cell clusters were then annotated by manual curation of cluster-specific marker gene lists together with canonical cell-type markers from published literature.
```
中文对应：
```
使用 Seurat 的 FindAllMarkers 或 FindMarkers 函数识别不同细胞簇之间的差异表达基因。marker 基因根据 FDR、log fold change 以及最低表达细胞比例等标准进行筛选。随后结合细胞簇特异性 marker 基因列表和已发表文献中的经典细胞类型标志基因，对各细胞簇进行人工注释。
```
References:
1. Coburn et al., 2025. Methods 2.10 describes FindAllMarkers, Wilcoxon rank-sum test, FDR, LFC, minimum expression percentage, and manual curation. [PMC12635866](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)
2. Mathys et al., 2019. Classic AD snRNA-seq paper for cell-type marker and annotation reference. [PMC6865822](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/)
3. Nagata et al., 2024. AD model paper using markers to distinguish microglial states. [PMC11628182](https://pmc.ncbi.nlm.nih.gov/articles/PMC11628182/)

### 2.3 Marker DotPlot Visualization
English example:
```
To illustrate the basis for cell-type annotation, representative marker genes were visualized using DotPlot. DotPlot was used to display both the average expression level of marker genes and the percentage of cells expressing each gene across clusters. Key markers were also projected onto the UMAP embedding using FeaturePlot to show their distribution across cellular populations.
```
中文对应：
```
为展示不同细胞簇的注释依据，选择代表性细胞类型 marker 基因绘制 DotPlot 气泡图。DotPlot 同时展示 marker 基因在各细胞簇中的平均表达水平和表达该基因的细胞比例。部分关键 marker 也可通过 FeaturePlot 投射到 UMAP 空间中，以展示其在细胞群体中的分布特征。
```

References:
1. Ayata et al., 2025. Extended Data Fig. 12 describes UMAP, dot plot, and feature plots for marker visualization. [PMC12675299](https://pmc.ncbi.nlm.nih.gov/articles/PMC12675299/)
2. Coburn et al., 2025. Provides scRNA-seq clusters and marker expression visualization reference. [PMC12635866](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)
3. Nagata et al., 2024. Provides microglial subcluster marker and cell-state visualization reference. [PMC11628182](https://pmc.ncbi.nlm.nih.gov/articles/PMC11628182/)

### 2.4 Cell Number and Cell Proportion Bar Plot
English example:
```
Based on cell-type annotation, the number and proportion of cells in each subpopulation were calculated for each sample or experimental group. Stacked or grouped bar plots were used to visualize differences in cellular composition between groups. For selected subpopulations, changes in their proportions between disease, control, or genetically modified groups were further compared to evaluate disease-associated expansion or reduction.
```
中文对应：
```
根据细胞注释结果，统计每个样本或实验组中各细胞亚群的细胞数量和比例。使用堆叠柱状图或分组柱状图展示不同实验组之间细胞组成的差异。对于特定目标亚群，可进一步比较其在疾病组和对照组或基因修饰组之间的比例变化，以评估疾病状态下细胞群体扩增或减少。
```
References:
1. Ayata et al., 2025. Extended Data Fig. 12 uses bar graphs to show percentage changes in microglial subpopulations. [PMC12675299](https://pmc.ncbi.nlm.nih.gov/articles/PMC12675299/)
2. Coburn et al., 2025. Methods 2.11 describes differential proportion analysis. [PMC12635866](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)
3. Nagata et al., 2024. Figure 3/Results compare microglial cluster frequencies. [PMC11628182](https://pmc.ncbi.nlm.nih.gov/articles/PMC11628182/)

### 2.5 Single-cell GO Enrichment Analysis
English example:
```
GO biological process enrichment analysis was performed using differentially expressed genes identified within selected cell types or subclusters to investigate disease-associated functional alterations. DEGs were obtained from single-cell cluster-level comparisons or pseudobulk analysis. Significantly upregulated or downregulated genes were compared against the background gene set, and GO terms with FDR below 0.05 were considered enriched. Enriched terms were further visualized using enrichment networks or dot plots.
```
中文对应：
```
针对特定细胞类型或细胞亚群内的组间差异表达基因进行 GO biological process 富集分析，以解析疾病状态下细胞功能改变。差异表达基因可来源于单细胞亚群比较或 pseudobulk 分析。显著上调或下调的基因与背景基因集进行比较，FDR 小于 0.05 的 GO 条目被认为显著富集，并可进一步以富集网络或气泡图进行可视化。
```
References:
1. Coburn et al., 2025. Methods 2.13 describes Gene ontology network and transcription factor analysis. [PMC12635866](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)
2. Nagata et al., 2024. AD model snRNA-seq paper using differential genes for GO enrichment analysis. [PMC11628182](https://pmc.ncbi.nlm.nih.gov/articles/PMC11628182/)
3. Ayata et al., 2025. Uses enrichment/GSEA analyses to interpret microglial functional gene programs. [PMC12675299](https://pmc.ncbi.nlm.nih.gov/articles/PMC12675299/)

### 2.6 Single-cell KEGG Pathway Enrichment Analysis
English example:
```
KEGG pathway enrichment analysis was performed using differentially expressed genes identified within selected cell types or subclusters. The analysis was conducted using the clusterProfiler package with species-specific KEGG annotations as reference. Enrichment results were adjusted for multiple testing, and pathways with adjusted p value below 0.05 were considered significantly enriched. These pathways were used to interpret signaling alterations in specific cell populations under AD-related conditions.
```
中文对应：
```
对特定细胞类型或细胞亚群中筛选得到的差异表达基因进行 KEGG 通路富集分析。分析可使用 clusterProfiler 包完成，以对应物种的 KEGG 注释作为参考。富集结果经过多重检验校正，校正后 p 值小于 0.05 的通路被认为显著富集，用于解释特定细胞群在 AD 条件下涉及的信号通路变化。
```

References:
1. Wang et al., 2025. AD RNA-seq Methods 2.3 gives a standard clusterProfiler KEGG description, transferable to cell-type-specific DEGs. [PMC12639471](https://pmc.ncbi.nlm.nih.gov/articles/PMC12639471/)
2. Siregar et al., 2026. Methods 2.5 describes GO/KEGG/GSEA integrative pathway analysis. [PMC13116960](https://pmc.ncbi.nlm.nih.gov/articles/PMC13116960/)
3. Baker et al., 2026. Methods describes KEGG pathway ORA. [PMC12931797](https://pmc.ncbi.nlm.nih.gov/articles/PMC12931797/)

### 2.7 Single-cell Gene Set Enrichment Analysis
English example:
```
To avoid pathway interpretation based solely on DEG cutoffs, GSEA was performed within selected cell types or subclusters using a ranked list of all genes based on differential expression statistics between groups. Ranked gene lists were compared with predefined gene sets from KEGG, GO, or MSigDB to identify functional pathways coordinately enriched in disease or control groups. Enrichment direction and significance were evaluated using normalized enrichment score and FDR q value.
```
中文对应：
```
为避免仅基于差异基因阈值进行通路解释，在特定细胞类型或细胞亚群内根据组间差异表达统计量对所有基因进行排序，并进行 GSEA 分析。排序基因列表与 KEGG、GO 或 MSigDB 预定义基因集进行比较，以识别在疾病组或对照组中协同富集的功能通路。富集方向和显著性通过 normalized enrichment score 和 FDR q value 进行评估。
```

References:
1. Ayata et al., 2025. AD/microglia study using GSEA analyses to interpret functional gene programs. [PMC12675299](https://pmc.ncbi.nlm.nih.gov/articles/PMC12675299/)
2. Karthivashan et al., 2026. 5xFAD bulk RNA-seq Methods 2.6 provides GSEA/MSigDB phrasing applicable to single-cell ranked genes. [PMC13240024](https://pmc.ncbi.nlm.nih.gov/articles/PMC13240024/)
3. Wang et al., 2025. Methods 2.4 describes KEGG-based GSEA with clusterProfiler. [PMC12639471](https://pmc.ncbi.nlm.nih.gov/articles/PMC12639471/)

## 3 Methodological References

1. DESeq2：Love et al., 2014, _Genome Biology_. [Bioconductor DESeq2](https://bioconductor.org/packages/release/bioc/html/DESeq2.html)
2. clusterProfiler：Yu et al., 2012, _OMICS_. [Bioconductor clusterProfiler](https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html)
3. GSEA：Subramanian et al., 2005, _PNAS_. [GSEA](https://www.gsea-msigdb.org/gsea/index.jsp)
4. Seurat：Stuart et al., 2019, _Cell_. [Seurat](https://satijalab.org/seurat/)
5. UMAP：McInnes et al. [UMAP paper](https://arxiv.org/abs/1802.03426)