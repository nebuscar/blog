---
title: "ATG5-Bulk RNAseq与scRNA-seq Methods描述写作参考"
description: "RNA-seq and Single-cell Methods Writing References"
pubDatetime: 2026-06-22T15:01:00.000Z
modDatetime: 2026-06-23T02:04:17+08:00
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
### 2.1 *Source： [^1]*
文章跳转：[MARCO+ macrophages drive immunosuppressive remodeling and metastasis in chemotherapy-associated steatohepatitis - Journal of Hepatology](https://www.journal-of-hepatology.eu/article/S0168-8278\(25\)02624-8/abstract)
#### 2.1.1 Single-Cell Sequencing
<font color="#ffc000">Single cell suspensions</font> collected from CASH samples were stained with antibodies against CD45 for FACS sorting. scRNA-seq libraries were prepared by NovelBio Bio-Pharm Technology Co., Ltd (Shanghai, China). using Chromium Next GEM Single Cell 5' V2 kit (10X Genomics, Pleasanton, CA) according to the manufacturer's protocol. <font color="#ffc000">Count matrices</font> were qualified and analyzed using Seurat, a R package (version 5.10). Other details are supplied in the supplementary materials and methods.
#### 2.1.2 Single-Cell Data Processing
<font color="#ffc000">Count matrices</font> were qualified and analyzed using Seurat, a R package (version 5.10). <font color="#ffc000">Low quality cells</font> were defined as those with less than 500 detected genes or over 6000 genes ormore than 20% mitochondrial UMI counts, were excluded. All samples were normalized by LogNormalize method, and scaled to achieve a mean of zero and a standard derivation of one.The top 2000 variable features were chosen for principal component analysis (PCA). Anchor-based CCA integration was utilized to remove batch effect and integrate multiple samples. The top 30 principals were used to construct a shared neighborhood graph and clusters with a givenset of resolution presented in the following sections. The reduction was achieved by usinguniform manifold approximation and projection (UMAP).
#### 2.1.3 Cell Type Annotation
In Figure 1C, the major clusters were achieved by performing <font color="#ffc000">the first-round clustering</font> with aresolution of 0.1. <font color="#ffc000">The second-round clustering</font> on myeloid with a resolution of 0.8, T cell witha resolution of 0.7, and NKs with a resolution of 0.4. Differential expressed genes were identified by FindAllMarkers function with thresholds on log-scale fold change of >0.25 and *p* value of <0.05 (Wilcoxon rank-sum test, and the p values have been corrected by falsediscovery rate (FDR)).
### 2.2 *Source： [^2]*
文章跳转：[Human microglia differentially respond to β‐amyloid, tau, and combined Alzheimer's disease pathologies in vivo - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)
#### 2.2.1 Single-Cell Sequencing via 10x Genomics
跳转：[Single-Cell Sequencing](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/#alz70930-sec-0070:~:text=Single%E2%80%90cell%20sequencing%20via%2010%C3%97%20Genomics)
<font color="#ffc000">scRNA - seq library preparation</font> was performed according to the 10x Genomics Chromium Single Cell 3' Reagents KitV3, user guide except that sample volumes containing 25,000 cells are loaded onto the 10x Genomics flow cell to capture ~10,000 total cells. <font color="#ffc000">The 10x Genomics workflow</font> was then followed according to the manufacturer protocol and libraries are pooled at equimolar concentrations for sequencing on an llumina NovaSeq 6000, targeting ~50,000 reads per cell FASTQ files are aligned to the human GRCh38 transcriptome using the Cell Ranger (version 3.0.2) count command, with the expected cells set to 10,000 and no secondary analysis performed. 
#### 2.2.2 scRNA - seq data visualization and differential gene analysis
跳转：[Single-Cell Data Processing](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/#alz70930-sec-0070:~:text=scRNA%E2%80%90seq%20data%20visualization%20and%20differential%20gene%20analysis)
<font color="#ffc000">UMI count tables</font> were read into Seurat (version 3) for preprocessing and clustering analysis. <font color="#ffc000">Initial quality control(QC)</font> was performed by log - normalizing and scaling (default settings) each dataset followed by <font color="#ffc000">principal componentanalysis (PCA)</font> performed using all genes in the dataset. <font color="#ffc000">Seurat's "ElbowPlot" function</font> was used to select principal components (PCs) to be used for clustering along with a resolution parameter of 0.5 and clusters identified as beingdoublets, gene - poor, or dividing are removed from the dataset prior to downstream analysis. <font color="#ffc000">Secondary QC cutoffs</font> were then applied to retain only cells with < 20%-25% ribosomal genes, 12.5% mitochondrial genes,> 500 genes but less than double the median gene count, and 500 UMI but less than double the median UM count. At this point one hPS19 and one hPS - 5X sample were discarded due to abnormal 10x cell capture and transcript amplification. Thefinal samples that yielded clean and high viability isolates and passed QC are as follows: four hWT mice (pooled twoper 10x run into two 10x runs); three h5xFAD mice (two pooled into one 10x run, one in a 10x run independently;two hPS19 mice pooled into one 10x run; one hPS - 5X mouse in one 10x run. Cells passing QC for each sample were then merged using <font color="#4f81bd">Seurat's "merge" function</font> and datasets were processed using Seurat's integrated analysisworkflow. Briefly, <font color="#ffc000">samples from individual mice</font> were integrated using the "<font color="#4f81bd">FindntegationAnchors</font>" and"<font color="#4f81bd">IntegrateData</font>" commands using dimensions 1:25. Datasets were then scaled, and sources of technical variation areregressed out (number of genes, percent ribosomal genes, and percent mitochondrial genes) and PCA wasperformed using <font color="#4f81bd">Seurat's "RunPCA" command.</font> <font color="#ffc000">A shared nearest neighbor (SNN) plot</font> was generated using <font color="#4f81bd">Seurat's"FindNeighbors" function</font> using PCs 1:40 as input, clustering was performed using the <font color="#4f81bd">"FindClusters" function</font> and a resolution parameter of 0.3, and dimension reduction was performed using the <font color="#4f81bd">"RunuMAP" function</font> with the same PCs used for generating the SNN plot. <font color="#ffc000">Differentially expressed genes (DEGs)</font> were determined between clusters usingthe <font color="#4f81bd">"FindAllMarkers" function</font>, which employs a Wilcoxon rank sum test with and FDR cutoff of 0.01, an LFC cutoff of 0.25, and the requirement that the gene be expressed in at least 10% of the cluster and clusters are labeledaccording to manual curation of the differential gene lists.
### 2.3 Source：[^3]
#### 2.3.1 Quality control for cell inclusion
跳转：[Quality control for cell inclusion](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/#S8:~:text=al.25.-,Quality%20control%20for%20cell%20inclusion,-.)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 e6cba3ed b29a 4872 a5f7 5ede4f1d0610](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_e6cba3ed-b29a-4872-a5f7-5ede4f1d0610.png)
#### 2.3.2 Cell clustering
跳转：[Cell clustering](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/#S8:~:text=in%2075%2C060%20nuclei.-,Cell%20clustering,-.)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 f21db2bd 7c14 4993 90d2 6e4f48068b91](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_f21db2bd-7c14-4993-90d2-6e4f48068b91.png)
#### 2.3.3 Cell type annotation and sub-clustering
跳转：[Cell type annotation and sub-clustering](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/#S8:~:text=Cell%20type%20annotation%20and%20sub%2Dclustering)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 16880044 8880 46f9 a77c 126714a7c939](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_16880044-8880-46f9-a77c-126714a7c939.png)

#### 2.3.4 Marker Identification
跳转：[Marker Identification](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/#S8:~:text=Marker%20identification)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 8d256736 0b43 4bc6 85f0 d8a7a1d86b09](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_8d256736-0b43-4bc6-85f0-d8a7a1d86b09.png)
#### 2.3.5 Gene differential expression analysis
跳转：[Gene differential expression analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/#S8:~:text=Gene%20differential%20expression%20analysis)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 83f203ff ed3e 4a3a bd76 212738ca2764](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_83f203ff-ed3e-4a3a-bd76-212738ca2764.png)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 04d053c0 a568 40b7 bcc4 68459aadad91](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_04d053c0-a568-40b7-bcc4-68459aadad91.png)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 45fd5f8e 5df2 4099 b55f 99449fed1b0a](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_45fd5f8e-5df2-4099-b55f-99449fed1b0a.png)

```
Consistency of gene expression <font color="#ffc000">perturbati</font>
```
### 2.4 Source：[^4]

#### 2.4.1 Single-nucleus RNA-seq sequence data analysis
跳转：[Single-nucleus RNA-seq sequence data analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC11628182/#s2:~:text=Single%2Dnucleus%20RNA%2Dseq%20sequence%20data%20analysis)
![ATG5 Bulk RNAseq与scRNA seq Methods描述写作参考 2026 06 23 82e5d065 8944 4161 8228 0e38e94c53c4](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/06/23/ATG5-Bulk-RNAseq与scRNA-seq-Methods描述写作参考_2026-06-23_82e5d065-8944-4161-8228-0e38e94c53c4.png)
## 3 常用方法参考文献
1. DESeq2：Love et al., 2014, _Genome Biology_. [Bioconductor DESeq2](https://bioconductor.org/packages/release/bioc/html/DESeq2.html)
2. clusterProfiler：Yu et al., 2012, _OMICS_. [Bioconductor clusterProfiler](https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html)
3. GSEA：Subramanian et al., 2005, _PNAS_. [GSEA](https://www.gsea-msigdb.org/gsea/index.jsp)
4. Seurat：Stuart et al., 2019, _Cell_. [Seurat](https://satijalab.org/seurat/)
5. UMAP：McInnes et al. [UMAP paper](https://arxiv.org/abs/1802.03426)

---
References:

[^1]: [MARCO+ macrophages drive immunosuppressive remodeling and metastasis in chemotherapy-associated steatohepatitis - Journal of Hepatology](https://www.journal-of-hepatology.eu/article/S0168-8278\(25\)02624-8/abstract)
[^2]: [PMC12635866](https://pmc.ncbi.nlm.nih.gov/articles/PMC12635866/)
[^3]: [PMC6865822](https://pmc.ncbi.nlm.nih.gov/articles/PMC6865822/)
[^4]: [PMC11628182](https://pmc.ncbi.nlm.nih.gov/articles/PMC11628182/)