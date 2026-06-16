---
title: "NCBI Datasets"
description: "NCBI Datasets 是一个资源，可以让你轻松收集来自各个 NCBI 数据库的数据。您可以使用我们的命令行界面（CLI）工具或 NCBI Datasets Web 界面，查找并下载基因和基因组的序列、注释及元数据。"
pubDatetime: 2026-04-04T09:41:12.000Z
modDatetime: 2026-04-24T09:41:12.000Z
slug: 20260404-1741-1w4ba
legacySlug: "ncbidatasets"
tags:
  - "工具/software"
---
## 1 NCBI Datasets

NCBI Datasets 是一个资源，可以让你轻松收集来自各个 NCBI 数据库的数据。您可以使用我们的命令行界面（CLI）工具或 [NCBI Datasets](https://www.ncbi.nlm.nih.gov/datasets/) Web 界面，查找并下载基因和基因组的序列、注释及元数据。

NCBI 数据集工具正在积极开发中。如需提交反馈，请创建 [GitHub 议题](https://github.com/ncbi/datasets/issues/new/choose) 或直接 [联系 NCBI](mailto:info@ncbi.nlm.nih.gov)，提出您的问题、意见或功能请求。

### 1.1 安装 NCBI Datasets 命令行工具

使用 conda 安装最新版本的 NCBI Datasets CLI 工具，`datasets` 和 `dataformat`

```bash
conda install -c conda-forge ncbi-datasets-cli
```

有关其他安装选项，请参阅我们的 CLI 工具 [下载和安装](https://www.ncbi.nlm.nih.gov/datasets/docs/download-and-install/) 说明。

```bash
# 下载二进制文件
curl -o datasets 'https://ftp.ncbi.nlm.nih.gov/pub/datasets/command-line/v2/linux-amd64/datasets'
# 赋予执行权限
chmod +x datasets
# 移动到你的本地 bin 目录（确保它在 PATH 中）
mv datasets ~/.local/bin/
```

### 1.2 使用 NCBI Datasets 的命令行工具

利用 ` datasets ` 从 NCBI 下载涵盖生命所有领域的生物序列数据。

使用 `dataformat` 将包含在数据包中的元数据从 JSON Lines 格式转换为其他格式。

```bash
datasets download genome taxon 858909 \ 
		--reference \ 
		--include genome,gff3,protein \ 
		--filename test.zip
```

> [!info] 示例
> 利用 `datasets` 下载人类参考基因组 GRCh38 的基因组数据包：
> ```bash
> datasets download genome taxon human --reference --filename human-reference.zip
> ```
> 使用 `dataformat` 从下载的数据包中提取选定的元数据字段，用于人类参考基因组 GRCh38：
> ```bash
> dataformat tsv genome --package human-reference.zip --fields organism-name,assminfo-name,accession,assminfo-submitter
> Organism name	Assembly Name	Assembly Accession	Assembly Submitter
> Homo sapiens	GRCh38.p14	GCF_000001405.40	Genome Reference Consortiums
> ```

下面的 Datasets CLI 示意图还概述了该 _ 数据集 _ CLI 可用的命令。

#### 1.2.1 下载大量基因组

下载大量基因组时，首先下载脱水的压缩包，然后分三步访问数据。

1. 下载 `dehydrated` 压缩压缩包
2. 解压下载的压缩包
3. `Rehydrate` 以访问数据

> [!info] 试试这个人类参考基因组的例子：
> 1. 下载 `dehydrated` 压缩包存档： `datasets download genome accession GCF_000001405.40 --dehydrated --filename human_GRCh38_dataset.zip`
> 2. 解压下载的压缩压缩包： `unzip human_GRCh38_dataset.zip -d my_human_dataset`
> 3. `Rehydrate` 以获取数据： `datasets rehydrate --directory my_human_dataset/`

欲了解更多信息，请参阅 [如何下载大型基因组数据包](https://www.ncbi.nlm.nih.gov/datasets/docs/how-tos/genomes/large-download/) 。

#### 1.2.2 使用您的 API 密钥配合 NCBI Datasets 命令行工具

NCBI Datasets API 和命令行工具请求均有速率限制。默认情况下，该速率限制设置为每秒 5 请求（rps）。通过使用您的 API 密钥，您可以将该速率上限提高到 10 rps。欲了解更多信息，请参阅我们关于 [如何获取 API 密钥](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/api/api-keys/#get-your-api-key)[以及如何使用 API 密钥的文档。](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/api/api-keys/#use-your-api-key-with-the-ncbi-datasets-command-line-tools)

### 1.3 NCBI Datasets 数据包

NCBI Datasets 提供序列、注释、元数据及其他生物数据，作为 [NCBI 数据集数据包的压缩压缩档](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/reference-docs/data-packages/) 。

我们目前提供四种类型的数据包：

1. [NCBI 数据集基因数据包](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/reference-docs/data-packages/gene-package/)
2. [NCBI 数据集基因组数据包](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/reference-docs/data-packages/genome/)
3. 一个专门的 [NCBI Datasets 病毒数据包](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/reference-docs/data-packages/virus-genome/) 。
4. [NCBI 数据集分类数据包](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/reference-docs/data-packages/taxonomy/)

### 1.4 引用 NCBI Datasets

#### 1.4.1 利用 NCBI 数据集探索和检索生命树物种的序列及元数据

O'Leary NA、Cox E、Holmes JB、Anderson WR、Falk R、Hem V、Tsuchiya MTN、Schuler GD、Zhang X、Torcivia J、Ketter A、Breen L、Cothran J、Bajwa H、Tinne J、Meric PA、Hlavina W、Schneider VA。 [利用 NCBI 数据集探索和检索生命树物种的序列及元数据。](https://www.nature.com/articles/s41597-024-03571-y)Sci Data。2024 年 7 月 5 日; 11(1):732. DOI：10.1038/S41597-024-03571-Y。PMID：38969627;PMCID：PMC11226681。

### 1.5 NCBI 数据集数据报告

NCBI Datasets 数据包包含包含关于请求记录的元数据的数据报告文件。 [数据报告模式](https://www.ncbi.nlm.nih.gov/datasets/docs/reference-docs/data-reports/) 描述了每种类型的数据报告，包括可用字段，并附有描述和示例。

### 1.6 基本流程

#### 1.6.1 物种清单

> [!info] 示例
>
> ```bash
> cat <<EOF > species_list.txt
> Arabidopsis thaliana
> Oryza sativa
> Zea mays
> EOF
> ```

#### 1.6.2 批量下载

这个脚本会自动循环读取列表，并下载每个物种的**基因组、GFF3 和蛋白质序列**。

```bash
#!/bin/bash

# 创建保存目录
mkdir -p ./genome_packages

list_file="/home/nizhu/Projects/plantsdb/species_list.txt"
out_dir="/home/nizhu/Projects/plantsdb/genome_packages/"

# 1. 跳过表头（tail -n +2） 
# 2. 按制表符分割，提取第2列（物种拉丁名） 
# 3. 循环处理每个物种
tail -n +2 "$list_file" | awk -F'\t' '{print $2}' | while IFS= read -r species || [[ -n "$species" ]]; do 
	# 跳过空行
	[[ -z "$species" ]] && continue
    echo "Processing: $species ..."
    
    out_zip="${out_dir}${species// /_}.zip"
    
    # 跳过已下载的文件 
    [[ -f "$out_zip" ]] && echo " [Skip] Exists: $out_zip" && continue
    
    # 执行下载：包含基因组(genome), 注释(gff3), 蛋白(protein)
    # --reference 确保只下载参考基因组，避免下载一堆杂乱的品种
	# 执行下载并检查结果 
	if datasets download genome taxon "$species" \ 
		--reference \ 
		--include genome,gff3,protein \ 
		--dehydrated \ 
		--filename "$out_zip"; then 
		echo "$species download completed." 
	else 
		echo "Error: Failed to download $species" 
	fi
done
```

> [!info] 核心参数详解
> - **`taxon "$species"`**: 支持中文名对应的英文、拉丁名或 TaxID。
> - **`--reference`**: **非常关键！** 它会自动选择该物种最权威的“参考基因组”。这比你自己筛选 `chromosome` 水平更智能，因为有些物种的参考基因组可能还没到染色体水平，但不加这个参数你会搜出成百上千个重复项。
> - **`--include genome,gff3,protein`**: 一次性打包你想要的三种文件。

#### 1.6.3 解压与整理

`datasets` 下载的是 `.zip` 包，你需要批量解压并提取文件。

```bash
# 批量解压到各自文件夹
for zip in ./genome_packages/*.zip; do
    dirname="${zip%.zip}"
    unzip -d "$dirname" "$zip"
done

# 快速查看文件位置
# 它们通常位于：genome_packages/物种名/ncbi_dataset/data/GCA_xxxx/
find ./genome_packages -name "*.fna"
find ./genome_packages -name "*.gff3"
find ./genome_packages -name "*.faa"
```

> [!info] 示例
>
>```bash
>(base) nizhu@cpu-node:~/Projects$ tree genome_packages -I *.zip
>```
> ```bash
> genome_packages
> ├── Arabidopsis_thaliana
> │   ├── md5sum.txt
> │   ├── ncbi_dataset
> │   │   └── data
> │   │       ├── assembly_data_report.jsonl
> │   │       ├── dataset_catalog.json
> │   │       └── GCF_000001735.4
> │   │           ├── GCF_000001735.4_TAIR10.1_genomic.fna
> │   │           ├── genomic.gff
> │   │           └── protein.faa
> │   └── README.md
> ├── Oryza_sativa
> │   ├── md5sum.txt
> │   ├── ncbi_dataset
> │   │   └── data
> │   │       ├── assembly_data_report.jsonl
> │   │       ├── dataset_catalog.json
> │   │       └── GCF_034140825.1
> │   │           ├── GCF_034140825.1_ASM3414082v1_genomic.fna
> │   │           ├── genomic.gff
> │   │           └── protein.faa
> │   └── README.md
> └── Zea_mays
>     ├── md5sum.txt
>     ├── ncbi_dataset
>     │   └── data
>     │       ├── assembly_data_report.jsonl
>     │       ├── dataset_catalog.json
>     │       └── GCF_902167145.1
>     │           ├── GCF_902167145.1_Zm-B73-REFERENCE-NAM-5.0_genomic.fna
>     │           ├── genomic.gff
>     │           └── protein.faa
>     └── README.md
> 
> 12 directories, 21 files
> ```

### 1.7 参考资料

1. [datasets](https://github.com/ncbi/datasets)
2. [Datasets Documentation](https://www.ncbi.nlm.nih.gov/datasets/docs/v2/)
3. [原始数据下载专题 | datasets——基因与基因组数据查询和获取的NCBI官方解决方案](https://mp.weixin.qq.com/s/Byps7CLwwfY-0IcouOB8qw)
