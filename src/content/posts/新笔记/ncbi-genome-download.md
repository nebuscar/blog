---
title: "ncbi-genome-download"
description: "ncbi-genome-download \\"
pubDatetime: 2026-06-11T19:05:00.000Z
modDatetime: 2026-06-17T10:48:00.000Z
slug: 20260612-0305-rkles
legacySlug: "新笔记/ncbi-genome-download"
tags: []
---
## 1 ncbi-genome-download

```bash
ncbi-genome-download \
    --section refseq \
    --formats fasta,gff,protein-fasta \
    --taxids species_ids.txt \
    --assembly-levels chromosome,complete \
    --output-folder ./genomes \
    --parallel 4 \
    plant
```

> [!info] 示例
>
> ```bash
> ncbi-genome-download \
>     --section refseq \
>     --formats fasta,gff,protein-fasta \
>     --taxids 3702 \
>     --assembly-levels chromosome,complete \
>     --output-folder ./genomes \
>     --parallel 4 \
>     plant
> ```
> ```bash
> genomes/
> └── refseq
>     └── plant
>         └── GCF_000001735.4
>             ├── GCF_000001735.4_TAIR10.1_genomic.fna.gz
>             ├── GCF_000001735.4_TAIR10.1_genomic.gff.gz
>             ├── GCF_000001735.4_TAIR10.1_protein.faa.gz
>             └── MD5SUMS
> 
> 3 directories, 4 files
> ```

### 1.1 参考资料

1. [kblin/ncbi-genome-download: Scripts to download genomes from the NCBI FTP servers](https://github.com/kblin/ncbi-genome-download)
2. [ncbi-genome-download - bioconda | Anaconda.org](https://anaconda.org/channels/bioconda/packages/ncbi-genome-download/overview)
3. [353774933](https://zhuanlan.zhihu.com/p/353774933)
4. [tree - grst | Anaconda.org](https://anaconda.org/channels/grst/packages/tree/overview)
