---
title: ""
description: "打开 sources.list："
pubDatetime: 2026-06-16T17:41:12+08:00
modDatetime: 2026-06-16T17:50:33+08:00
slug: 20260616-1741-1n5em
legacySlug: "wsl配置清华下载源"
tags: []
---
## WSL 配置清华下载源

### 1 彻底替换步骤

打开 `sources.list`：

```Bash
sudo nano /etc/apt/sources.list
```

清空原内容，**直接粘贴以下完整配置**（这包含了 main, updates, backports 和 security 全部四个部分）：

```Plaintext
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse

# 安全更新源也替换为清华源
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
```

### 2 激活配置

执行以下命令清除旧缓存并重新加载：

```Bash
sudo apt clean
sudo apt update
```

### 3 测试安装

```Bash
sudo apt install aria2
```
