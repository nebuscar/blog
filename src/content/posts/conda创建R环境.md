---
title: "conda创建R环境"
description: "conda create -n r441 -c conda-forge r-base=4.4.1"
pubDatetime: 2026-01-17T07:32:04.000Z
modDatetime: 2026-04-24T08:08:01.000Z
slug: 20260117-1532-1r3v0
legacySlug: "conda创建r环境"
tags:
  - "环境配置"
---
## 1 创建环境 + 安装 R-base

```bash
conda create -n r441 -c conda-forge r-base=4.4.1
```

## 2 创建 conda R 虚拟环境

```bash
conda create -n r441
```

```bash
# 运行记录
(base) nizhu@cpu-node:~$ conda create -n r441
2 channel Terms of Service accepted
Retrieving notices: done
Channels:
 - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge
 - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
 - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
 - defaults
 - dnachun
 - bioconda
 - conda-forge
Platform: linux-64
Collecting package metadata (repodata.json): done
Solving environment: done

## Package Plan ##
  environment location: /home/nizhu/software/miniconda3/envs/r441

Proceed ([y]/n)? y

Downloading and Extracting Packages:

Preparing transaction: done
Verifying transaction: done
Executing transaction: done
#
# To activate this environment, use
#
#     $ conda activate r441
#
# To deactivate an active environment, use
#
#     $ conda deactivate
```

## 3 安装指定 R-base 版本

```bash
conda install conda-forge::r-base=4.4.1
```

## 4 安装必需的 R 包

```bash
conda install conda-forge::r-tidyverse
```

---

## 5 参考资料

1. [r-base - conda-forge \| Anaconda.org](https://anaconda.org/channels/conda-forge/packages/r-base/overview)
