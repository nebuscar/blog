---
title: "使用Rufus制作Ubuntu 22.04系统盘"
description: "在Windows环境下使用Rufus工具将Ubuntu 22.04 ISO写入U盘，制作可引导系统安装盘"
pubDatetime: 2026-07-21T12:48:00.000Z
modDatetime: 2026-10-06T17:59:40+08:00
slug: 20260721-2048-1674j
legacySlug: "30resources/通用参考/使用rufus制作ubuntu2204系统盘"
tags: []
---
## 概述

**Rufus** 是一款免费开源的 Windows 工具，用于将 ISO 镜像写入 U 盘并使其可引导。相比 Etcher、UNetbootin 等工具，Rufus 在写入速度、兼容性和分区方案支持方面表现最优，是制作 Ubuntu 启动盘的首选方案。本教程以 Ubuntu 22.04 LTS 为例，覆盖从下载到写入完成的完整流程。

## 准备工作

| 项目 | 说明 |
|:---|:---|
| U 盘 | 容量 ≥ **8 GB**，推荐 16 GB 以上。**操作会清空全部数据，请提前备份** |
| Ubuntu 22.04 ISO | 从 [ubuntu.com/download](https://ubuntu.com/download/desktop) 下载 `ubuntu-22.04.x-desktop-amd64.iso` |
| Rufus | 从 [rufus.ie](https://rufus.ie) 下载最新版本（便携版 Portable 即可，无需安装） |

## 操作步骤

### 1. 打开 Rufus，插入 U 盘

直接双击 `rufus-x.xx.exe` 运行（便携版无需安装）。软件会自动识别已插入的 U 盘并在 **设备 (Device)** 下拉框中显示。
![使用Rufus制作Ubuntu 22.04系统盘 2026 07 21 fe7c0cc0 56bb 4b7e aba5 f54908412f86](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/08/20/使用Rufus制作Ubuntu-22.04系统盘_2026-07-21_fe7c0cc0-56bb-4b7e-aba5-f54908412f86.png)

### 2. 选择 ISO 镜像

点击 **"选择 (SELECT)"** 按钮，在弹出的文件浏览器中定位并选中已下载的 `ubuntu-22.04.x-desktop-amd64.iso` 文件。Rufus 会自动解析 ISO 信息并预填推荐的分区方案。
![使用Rufus制作Ubuntu 22.04系统盘 2026 07 21 e260fece c8f0 465b a43f 7eb8113aa3cd](https://pub-b6575bc5365d47eea85c3b697ba6ad51.r2.dev/2026/08/20/使用Rufus制作Ubuntu-22.04系统盘_2026-07-21_e260fece-c8f0-465b-a43f-7eb8113aa3cd.png)
### 3. 配置分区方案与文件系统

Rufus 加载 ISO 后会自动调整以下参数。通常情况下**保持默认值**即可：

| 参数 | 推荐值 | 说明 |
|:---|:---|:---|
| 分区方案 (Partition scheme) | **GPT** | 适用于 UEFI 固件（2012 年后多数主板）。若需兼容旧 BIOS 则选 MBR |
| 目标系统 (Target system) | **UEFI (非 CSM)** | 与 GPT 配对使用 |
| 文件系统 (File system) | **FAT32** | UEFI 启动所必需的文件系统 |
| 簇大小 (Cluster size) | **4096 字节 (默认)** | 无需更改 |


> **⚡ 关键判断——GPT 还是 MBR？**
>
> - 近十年内出厂的电脑（Intel 6代 / AMD Ryzen 之后）一律选 **GPT + UEFI**。
> - 仅当目标机器为 2012 年前的旧式 BIOS 固件时选择 **MBR + BIOS (或 UEFI-CSM)**。
> - 不确定时先选 GPT 尝试，若不识别再改为 MBR——GPT 是当前主流标准。

### 4. 开始写入

点击底部的 **"开始 (START)"** 按钮。Rufus 会弹出警告对话框，提示 **U 盘上所有数据将被永久清除**：

> **⚠️ 务必确认已备份 U 盘数据，并选择了正确的目标设备。此操作不可撤销。**

点击 **"确定 (OK)"** 后，Rufus 开始写入 ISO 镜像。若 U 盘中存在 ISOHybrid 镜像提示，选择 **"以 DD 镜像模式写入"** 以获得最佳兼容性。

### 5. 等待写入完成

写入过程通常持续 **5–15 分钟**（取决于 U 盘读写速度和 USB 接口版本）。进度条满格并显示绿色 **"准备就绪 (READY)"** 状态后，点击 **"关闭 (CLOSE)"** 退出。

至此，Ubuntu 22.04 系统盘制作完成。U 盘可直接用于启动并安装 Ubuntu。
## 参考资料

- [Rufus 官方网站](https://rufus.ie/)
- [Ubuntu 22.04 LTS 下载](https://ubuntu.com/download/desktop)
- [Ubuntu 官方安装教程](https://ubuntu.com/tutorials/install-ubuntu-desktop)
