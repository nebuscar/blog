---
title: "Taxonkit"
description: "从事生物多样性的研究者对 NCBI Taxonomy 数据库一定不会陌生，它包含了 NCBI 所有核酸和蛋白序列数据库中每条序列对应的物种名称与分类学信息。大多数生态学研究对物种组成的描述都是基于 NCBI Taxonomy 数据库，当然目前也开始使用其他数据库，如 GTDB 等。"
pubDatetime: 2026-06-16T17:41:12+08:00
modDatetime: 2026-06-16T17:53:49+08:00
slug: 20260616-1741-11bbd
legacySlug: "taxonkit"
tags: []
---
## Taxonkit

### 1 NCBI Taxonomy 数据库 [Link](https://bioinf.shenwei.me/taxonkit/chinese/#ncbi-taxonomy "Permanent link")

从事生物多样性的研究者对 NCBI Taxonomy 数据库一定不会陌生，它包含了 NCBI 所有核酸和蛋白序列数据库中每条序列对应的物种名称与分类学信息。大多数生态学研究对物种组成的描述都是基于 NCBI Taxonomy 数据库，当然目前也开始使用其他数据库，如 GTDB 等。

NCBI Taxonomy 数据库始于 1991 年，一直随着 Entrez 数据库和其他数据库更新，1996 年推出网页版。NCBI Taxonomy 数据库官方地址为 <https://www.ncbi.nlm.nih.gov/taxonomy>，公开数据下载地址为 <https://ftp.ncbi.nih.gov/pub/taxonomy/>，数据每小时更新，每个月初生成一份数据归档存于 taxdump_archive 目录，最早可追溯到 2014 年 8 月。

### 2 TaxonKit 使用 [Link](https://bioinf.shenwei.me/taxonkit/chinese/#taxonkit "Permanent link")

TaxonKit 是采用 Go 语言编写的命令行工具，提供 Linux, Windows, macOS 操作系统不同架构（x86-64/arm64）的静态编译的可执行二进制文件。发布的压缩包不足 3Mb，除了 Github 托管外，还提供国内镜像供下载，同时还支持 conda 和 homebrew 安装。用户只需要**下载、解压，开箱即用，无需配置**，仅需下载解压 NCBI Taxonomy 数据文件解压到指定目录即可。

- 源代码 <https://github.com/shenwei356/taxonkit>，
- 文档 <http://bioinf.shenwei.me/taxonkit>（介绍、使用说明、例子、教程）

TaxonKit 为命令行工具，采用子命令的方式来执行不同功能，大多数子命令支持标准输入/输出，便于使用命令行管道进行流水作业，轻松整合进分析流程中。

| 子命令                                                                            | 功能                         |
| ------------------------------------------------------------------------------ | -------------------------- |
| [`list`](https://bioinf.shenwei.me/taxonkit/usage/#list)                       | 列出指定 TaxId 下所有子单元的的 TaxID  |
| [`lineage`](https://bioinf.shenwei.me/taxonkit/usage/#lineage)                 | 根据 TaxID 获取完整谱系（lineage）|
| [`reformat`](https://bioinf.shenwei.me/taxonkit/usage/#reformat)               | 将完整谱系转化为“界门纲目科属种株 " 的自定义格式 |
| [`name2taxid`](https://bioinf.shenwei.me/taxonkit/usage/#name2taxid)           | 将分类单元名称转化为 TaxID           |
| [`filter`](https://bioinf.shenwei.me/taxonkit/usage/#filter)                   | 按分类学水平范围过滤 TaxIDs          |
| [`lca`](https://bioinf.shenwei.me/taxonkit/usage/#lca)                         | 计算最低公共祖先 (LCA)             |
| [`taxid-changelog`](https://bioinf.shenwei.me/taxonkit/usage/#taxid-changelog) | 追踪 TaxID 变更记录              |
| `version`                                                                      | 显示版本信息、检测新版本               |
| `genautocomplete`                                                              | 生成 shell 自动补全配置脚本          |

> [!info] 备注：
> - 输出：
>     - 所有命令输出中包含输入数据内容，在此基础上增加列。
>     - 所有命令默认输出到标准输出（stdout），可通过重定向（`>`）写入文件。
>     - 或通过全局参数 `-o` 或 `--out-file` 指定输出文件，且可自动识别输出文件后缀（`.gz`）输出 gzip 格式。
> - 输入：
>     - 除了 `list` 与 `taxid-changelog` 之外，`lineage`, `reformat`, `name2taxid`, `filter` 与 `lca` 均可从标准输入（stdin）读取输入数据，也可通过位置参数（positional arguments）输入，即命令后面不带 任何 flag 的参数，如 `taxonkit lineage taxids.txt`
>     - 输入格式为单列，或者制表符分隔的格式，输入数据所在列用 `-i` 或 `--taxid-field` 指定。

TaxonKit 直接解析 NCBI Taxonomy 数据文件（2 秒左右），配置更容易，也便于更新数据，占用内存在 500Mb-1.5G 左右。数据下载：

```bash
# 有时下载失败，可多试几次；或尝试浏览器下载此链接 
wget -c https://ftp.ncbi.nih.gov/pub/taxonomy/taxdump.tar.gz tar -zxvf taxdump.tar.gz 

# 解压文件存于家目录中.taxonkit/，程序默认数据库默认目录 
mkdir -p $HOME/.taxonkit cp names.dmp nodes.dmp delnodes.dmp merged.dmp $HOME/.taxonkit
```

#### 2.1 list 列出指定 TaxId 所在子树的所有 TaxID[Link](https://bioinf.shenwei.me/taxonkit/chinese/#list-taxidtaxid "Permanent link")

`taxonkit list` 用于列出指定 TaxID 所在分类学单元（taxon）的子树（subtree）的所有 taxon 的 TaxID，可选显示名称和分类学水平。此功能与 NCBI Taxonomy 网页版类似。

> [!info] 如：

```bash
# 以人属(9605)和肠道中著名的Akk菌属(239934)为例 
$ taxonkit list --show-rank --show-name --indent " " --ids 9605,239934 
9605 [genus] Homo 
	9606 [species] Homo sapiens 
		63221 [subspecies] Homo sapiens neanderthalensis 
		741158 [subspecies] Homo sapiens subsp. 'Denisova' 
	1425170 [species] Homo heidelbergensis 
	2665952 [no rank] environmental samples 
		2665953 [species] Homo sapiens environmental sample 
		
239934 [genus] Akkermansia 
	239935 [species] Akkermansia muciniphila 
		349741 [strain] Akkermansia muciniphila ATCC BAA-835 
	512293 [no rank] environmental samples 
		512294 [species] uncultured Akkermansia sp. 
		1131822 [species] uncultured Akkermansia sp. SMG25 
		1262691 [species] Akkermansia sp. CAG:344 
		1263034 [species] Akkermansia muciniphila CAG:154 
	1679444 [species] Akkermansia glycaniphila 
	2608915 [no rank] unclassified Akkermansia 
		1131336 [species] Akkermansia sp. KLE1605 
	...
```

list 使用最广泛的的功能是获取某个类别（比如细菌、病毒、某个属等）下所有的 TaxID，用来从 NCBI nt/nr 中获取对应的核酸/蛋白序列，从而搭建特异性的 BLAST 数据库。官网提供了相应的详细步骤：<http://bioinf.shenwei.me/taxonkit/tutorial>。

```bash
# 所有细菌的TaxID 
$ taxonkit list --show-rank --show-name --ids 2 > /dev/null
```

```bash
# 使用example中的测试数据 
$ head taxids.txt 
9606 
9913 
376619 
# 查找指定taxids列表的物种信息，tee可输出屏幕并写入文件 
$ taxonkit lineage taxids.txt | tee lineage.txt 
19:22:13.077 [WARN] taxid 92489 was merged into 796334 
19:22:13.077 [WARN] taxid 1458427 was merged into 1458425 
19:22:13.077 [WARN] taxid 123124124 not found 
19:22:13.077 [WARN] taxid 3 was deleted 
9606 cellular organisms;Eukaryota;Opisthokonta;Metazoa;Eumetazoa;Bilateria;Deuterostomia;Chordata;Craniata;Vertebrata;Gnathostomata;Teleostomi;Euteleostomi;Sarcopterygii;Dipnotetrapodomorpha;Tetrapoda;Amniota;Mammalia;Theria;Eutheria;Boreoeutheria;Euarchontoglires;Primates;Haplorrhini;Simiiformes;Catarrhini;Hominoidea;Hominidae;Homininae;Homo;Homo sapiens 
9913 cellular organisms;Eukaryota;Opisthokonta;Metazoa;Eumetazoa;Bilateria;Deuterostomia;Chordata;Craniata;Vertebrata;Gnathostomata;Teleostomi;Euteleostomi;Sarcopterygii;Dipnotetrapodomorpha;Tetrapoda;Amniota;Mammalia;Theria;Eutheria;Boreoeutheria;Laurasiatheria;Artiodactyla;Ruminantia;Pecora;Bovidae;Bovinae;Bos;Bos taurus 
376619 cellular organisms;Bacteria;Proteobacteria;Gammaproteobacteria;Thiotrichales;Francisellaceae;Francisella;Francisella tularensis;Francisella tularensis subsp. holarctica;Francisella tularensis subsp. holarctica LVS 
349741 cellular organisms;Bacteria;PVC group;Verrucomicrobia;Verrucomicrobiae;Verrucomicrobiales;Akkermansiaceae;Akkermansia;Akkermansia muciniphila;Akkermansia muciniphila ATCC BAA-835 
239935 cellular organisms;Bacteria;PVC group;Verrucomicrobia;Verrucomicrobiae;Verrucomicrobiales;Akkermansiaceae;Akkermansia;Akkermansia muciniphila 
314101 cellular organisms;Bacteria;environmental samples;uncultured murine large bowel bacterium BAC 54B 
11932 Viruses;Riboviria;Pararnavirae;Artverviricota;Revtraviricetes;Ortervirales;Retroviridae;unclassified Retroviridae;Intracisternal A-particles;Mouse Intracisternal A-particle 
1327037 Viruses;Duplodnaviria;Heunggongvirae;Uroviricota;Caudoviricetes;Caudovirales;Siphoviridae;unclassified Siphoviridae;Croceibacter phage P2559Y 
123124124 
3 
92489 cellular organisms;Bacteria;Proteobacteria;Gammaproteobacteria;Enterobacterales;Erwiniaceae;Erwinia;Erwinia oleae 
1458427 cellular organisms;Bacteria;Proteobacteria;Betaproteobacteria;Burkholderiales;Comamonadaceae;Serpentinomonas;Serpentinomonas raicheisms;Bacteria;Proteobacteria;Betaproteobacteria;Burkholderiales;Comamonadaceae;Serpentinomonas;Serpentinomonas raichei
```

与其它软件的性能相比，当查询数量较少时 ETE 较快，数量较多时则 TaxonKit 更快。在不同数据量规模上 TaxonKit 速度一直很稳定，均为 2-3 秒，时间主要花在解析 Taxonomy 数据文件上。

列出 lineage 每个分类学单元的的 TaxId 和 rank 和名称，比如 SARS-COV-2。

```bash
# lineage提取SARS-COV-2的世系 
$ echo "2697049" \ 
	| taxonkit lineage -t -R \ 
	| sed "s/\t/\n/g" 
2697049 Viruses;Riboviria;Orthornavirae;Pisuviricota;Pisoniviricetes;Nidovirales;Cornidovirineae;Coronaviridae;Orthocoronavirinae;Betacoronavirus;Sarbecovirus;Severe acute respiratory syndrome-related coronavirus;Severe acute respiratory syndrome coronavirus 2 10239;2559587;2732396;2732408;2732506;76804;2499399;11118;2501931;694002;2509511;694009;2697049 superkingdom;clade;kingdom;phylum;class;order;suborder;family;subfamily;genus;subgenus;species;no rank
```

#### 2.2 lineage 根据 TaxID 获取完整谱系 [Link](https://bioinf.shenwei.me/taxonkit/chinese/#lineage-taxid "Permanent link")

分类学数据相关最常见的功能就是根据 TaxID 获取完整谱系。TaxonKit 可根据输入文件提供的 TaxID 列表快速计算 lineage，并可选提供名称，分类学水平，以及谱系对应的 TaxID。

值得注意的是，随着 Taxonomy 数据的频繁更新，有的 TaxID 可能被删除、或合并（merge）到其它 TaxID 中，TaxonKit 会自动识别，并进行提示，对于被合并的 TaxID，TaxonKit 会按新 TaxID 进行计算。

#### 2.3 reformat 生成标准层级物种注释 [Link](https://bioinf.shenwei.me/taxonkit/chinese/#reformat "Permanent link")

有时候，我们并不需要完整的分类学谱系（complete lineage），因为很多级别即不常用，而且不完整。通常只想保留界门纲目科属种。

值得注意的是，**不是所有物种都有完整的界门纲目科属种水平，特别是病毒以及一些环境样品**。TaxonKit 可以用自定义内容替代缺失的分类单元，如用“__”替代。更~~厉害~~有用的是，**TaxonKit 还可以用更高层级的分类单元信息来补齐缺失的层级** (`-F/--fill-miss-rank`)，比如

```bash
# 没有genus的病毒 
$ echo 1327037 | taxonkit lineage | taxonkit reformat | cut -f 1,3 1327037 Viruses;Uroviricota;Caudoviricetes;Caudovirales;Siphoviridae;;Croceibacter phage P2559Y 
# -F参数会用family信息来补齐genus信息 
$ echo 1327037 | taxonkit lineage | taxonkit reformat -F | cut -f 1,3 1327037 Viruses;Uroviricota;Caudoviricetes;Caudovirales;Siphoviridae;unclassified Siphoviridae genus;Croceibacter phage P2559Y
```

输出格式可选只输出部分分类学水平，还支持制表符（`"\t"`），再配合作者的另一个工具 csvtk，可以输出漂亮的结果。

其它有用的选项：

- `-P/--add-prefix`：给每个分类学水平添加前缀，比如 `s__species`。
- `-t/--show-lineage-taxids`：输出分类学单元对应的 TaxID。
- `-r/--miss-rank-repl`: 替代没有对应 rank 的 taxon 名称
- `-S/--pseudo-strain`: 对于低于 species 且 rank 既不是 subspecies 也不是 strain 的 taxid，使用水平最低 taxon 名称做为菌株名称。

> [!info] 例如：

```bash
$ echo -ne "349741\n1327037"\ 
	| taxonkit lineage \ 
	| taxonkit reformat -f "{k}\t{p}\t{c}\t{o}\t{f}\t{g}\t{s}" -F -P \ 
	| csvtk cut -t -f -2 \ 
	| csvtk add-header -t -n taxid,kindom,phylum,class,order,family,genus,species \ 
	| csvtk pretty -t 
taxid kindom phylum class order family genus species 
349741 k__Bacteria p__Verrucomicrobia c__Verrucomicrobiae o__Verrucomicrobiales f__Akkermansiaceae g__Akkermansia s__Akkermansia muciniphila 
1327037 k__Viruses p__Uroviricota c__Caudoviricetes o__Caudovirales f__Siphoviridae g__unclassified Siphoviridae genus s__Croceibacter phage P2559Y 

# 便于小屏幕查看，用csvtk进行转置 
$ echo -ne "349741\n1327037"\ 
	| taxonkit lineage \ 
	| taxonkit reformat -f "{k}\t{p}\t{c}\t{o}\t{f}\t{g}\t{s}" -F -P \ 
	| csvtk cut -t -f -2 \ 
	| csvtk add-header -t -n taxid,kindom,phylum,class,order,family,genus,species \ 
	| csvtk transpose -t \ 
	| csvtk pretty -H -t taxid 349741 1327037 kindom k__Bacteria k__Viruses phylum p__Verrucomicrobia p__Uroviricota class c__Verrucomicrobiae c__Caudoviricetes order o__Verrucomicrobiales o__Caudovirales family f__Akkermansiaceae f__Siphoviridae genus g__Akkermansia g__unclassified Siphoviridae genus species s__Akkermansia muciniphila s__Croceibacter phage P2559Y
	
 # 到株水平，以sars-cov-2为例 
 $ echo -ne "2697049"\ 
	 | taxonkit lineage \ 
	 | taxonkit reformat -f "{k}\t{p}\t{c}\t{o}\t{f}\t{g}\t{s}\t{t}" -F -P -S \ 
	 | csvtk cut -t -f -2 \ 
	 | csvtk add-header -t -n taxid,kindom,phylum,class,order,family,genus,species,strain \ 
	 | csvtk transpose -t \ 
	 | csvtk pretty -H -t 
	 
taxid 2697049 
kindom k__Viruses 
phylum p__Pisuviricota 
class c__Pisoniviricetes 
order o__Nidovirales 
family f__Coronaviridae 
genus g__Betacoronavirus 
species s__Severe acute respiratory syndrome-related coronavirus strain t__Severe acute respiratory syndrome coronavirus 2
```

### 3 参考资料

1. [shenwei356/taxonkit: A Practical and Efficient NCBI Taxonomy Toolkit, also supports creating NCBI-style taxdump files for custom taxonomies like GTDB/ICTV](https://github.com/shenwei356/taxonkit)
