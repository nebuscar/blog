---
title: "从Obsidian到Cloudflare：Astro博客建站与自动部署记录"
description: "记录如何使用 AstroPaper、GitHub Actions 和 Cloudflare Pages，将私有 Obsidian Vault 中的公开笔记自动发布为静态博客。"
pubDatetime: 2026-06-15T18:33:00.000Z
modDatetime: 2026-06-17T01:19:00.000Z
slug: 20260616-0233-1qi9d
legacySlug: "新笔记/从obsidian到cloudflareastro博客建站与自动部署记录"
tags: []
---
# 1 参考资料
> 本文属于「个人博客搭建记录」系列：
>
> 1. 从 Obsidian 到 Cloudflare：Astro 博客建站与自动部署记录
> 2. 为 Astro 博客接入 Waline 评论系统
> 3. AstroPaper 博客美化与功能定制记录

## 1 为什么要把 Obsidian 和博客分开

我平时使用 Obsidian 写作，所有笔记都保存在一个私有 GitHub 仓库中。但 Obsidian Vault 不只是博客文章，还包含草稿、个人笔记和其他不适合公开的内容，因此不适合直接作为博客仓库发布。

最终采用两个仓库：

| 仓库 | 可见性 | 用途 |
| --- | --- | --- |
| `nebuscar/Obsidian-Vault` | 私有 | 保存完整的 Obsidian 笔记 |
| `nebuscar/blog` | 公开 | 保存 Astro 博客代码和需要发布的文章 |

在 Vault 中，只有 `public` 目录下的 Markdown 文件会被同步到博客：

```text
Obsidian-Vault/
├─ public/                # 准备公开发布的文章
├─ 其他私人笔记/
└─ .github/workflows/     # 自动同步工作流

blog/
├─ src/content/posts/     # Astro 实际读取的文章目录
├─ src/
└─ package.json
```

这样既能继续在 Obsidian 中统一写作，又能明确控制哪些内容会出现在博客中。

## 2 整体发布架构

博客的完整数据流如下：

```text
Obsidian 写作
    ↓
推送 Obsidian-Vault
    ↓
GitHub Actions 同步 public 目录
    ↓
提交到 nebuscar/blog
    ↓
Cloudflare Pages 自动构建 Astro
    ↓
发布到 blog.okisama.top
```

图片没有存放在 GitHub 仓库中，而是上传至 Cloudflare R2，并在 Markdown 中直接使用图片 URL。这样可以减少仓库体积，也能避免构建时处理大量附件。

## 3 初始化 AstroPaper 博客

博客使用 [Astro](https://astro.build/) 静态站点框架，并参考 [AstroPaper](https://github.com/satnaing/astro-paper) 主题。

在本地克隆博客仓库后安装依赖：

```bash
git clone https://github.com/nebuscar/blog.git
cd blog
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

执行静态构建：

```bash
pnpm build
```

Astro 默认将构建结果输出到 `dist` 目录。由于博客是纯静态站点，不需要长期运行 Node.js 服务。

## 4 文章 Frontmatter 规范

Astro 使用 Markdown 文件顶部的 YAML Frontmatter 管理文章元数据。我的文章统一使用以下格式：

```yaml
---
title: 文章标题
description: 文章摘要
pubDate: 2026-06-15T18:30:00+08:00
updatedDate: 2026-06-15T18:30:00+08:00
draft: false
tags:
  - Astro
  - 博客搭建
---
```

各字段含义：

| 字段 | 含义 |
| --- | --- |
| `title` | 文章标题 |
| `description` | 首页列表和搜索引擎使用的摘要 |
| `pubDate` | 首次发布时间，建议包含时分秒和时区 |
| `updatedDate` | 最近更新时间，建议包含时分秒和时区 |
| `draft` | 是否为草稿，`true` 时不公开发布 |
| `tags` | 文章标签 |

文件系统中的创建时间和上传时间并不可靠，因此文章展示日期应当以 Frontmatter 中的 `pubDate` 和 `updatedDate` 为准。完整时间推荐使用 ISO 8601 格式，例如 `2026-06-15T18:30:00+08:00`。

如果只填写 `2026-06-15`，同步脚本会使用该文件的 Git 提交时间自动补足时分秒。但同一次提交中新增的多篇文章可能拥有相同时间，需要确定系列顺序时，最好手动填写完整时间。

## 5 使用 GitHub Actions 自动同步文章

同步工作流放在私有 Vault 仓库中。当 `public` 目录发生变化时，工作流会检出博客仓库，将文章复制到 `src/content/posts`，然后提交并推送。

核心流程示意：

```yaml
name: Publish public notes

on:
  push:
    branches:
      - master
    paths:
      - "public/**"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Obsidian Vault
        uses: actions/checkout@v4

      - name: Checkout blog repository
        uses: actions/checkout@v4
        with:
          repository: nebuscar/blog
          token: ${{ secrets.BLOG_REPO_TOKEN }}
          path: blog

      - name: Sync public notes
        run: |
          rm -rf blog/src/content/posts/*
          cp -r public/. blog/src/content/posts/

      - name: Commit and push changes
        working-directory: blog
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add src/content/posts
          git diff --cached --quiet && exit 0
          git commit -m "Sync public notes from Obsidian Vault"
          git push
```

因为工作流需要从私有仓库写入另一个仓库，所以需要创建 Fine-grained Personal Access Token，并满足以下条件：

```text
Repository access：仅选择 nebuscar/blog
Repository permissions → Contents：Read and write
```

然后在 Vault 仓库的 `Settings → Secrets and variables → Actions` 中保存为：

```text
BLOG_REPO_TOKEN
```

令牌只保存在 GitHub Secrets 中，不能直接写入工作流文件或文章。

## 6 部署到 Cloudflare Pages

在 Cloudflare 中创建 Pages 项目并连接 `nebuscar/blog` 仓库，构建配置如下：

```text
生产分支：main
框架预设：Astro
构建命令：pnpm run build
构建输出目录：dist
```

每当博客仓库收到新提交时，Cloudflare Pages 会自动开始构建和部署。因此日常发布文章时，不需要手动登录 Cloudflare。

### 6.1 pnpm 工作区报错

部署初期曾遇到：

```text
ERROR packages field missing or empty
```

原因是仓库中存在不正确或多余的 `pnpm-workspace.yaml`，Cloudflare 将项目识别成 pnpm workspace，但配置中没有有效的 `packages` 字段。

对于单一 Astro 项目，不需要 workspace 配置。删除错误的 `pnpm-workspace.yaml`，保留正常的 `package.json` 和 `pnpm-lock.yaml` 即可。

## 7 配置自定义域名

当前域名分工如下：

| 域名 | 用途 | 托管平台 |
| --- | --- | --- |
| `blog.okisama.top` | 博客网站 | Cloudflare Pages |
| `comment.okisama.top` | Waline 评论服务 | Vercel |
| `okisama.top` | 根域名，可访问或跳转至博客 | Cloudflare |

在 Cloudflare Pages 项目的“自定义域”中添加：

```text
blog.okisama.top
okisama.top
```

仅在 DNS 中添加指向 `pages.dev` 的 CNAME 并不一定足够。必须在 Pages 项目内添加自定义域名，让 Pages 为该域名签发证书并接受请求。

如果希望统一博客入口，也可以将根域名 `okisama.top` 使用 301 重定向跳转到 `blog.okisama.top`。

## 8 日常写作与发布流程

搭建完成后的日常流程非常简单：

1. 在 Obsidian 中创建或编辑文章。
2. 将需要发布的文章放入 `public` 目录。
3. 检查 Frontmatter，确认 `draft`、日期和标签。
4. 将图片上传至 R2，并在文章中使用 URL。
5. 使用 Obsidian Git 提交并推送 Vault。
6. GitHub Actions 自动同步文章到博客仓库。
7. Cloudflare Pages 自动构建并发布。

除 Obsidian 写作和推送外，正常情况下不需要人工操作博客仓库或 Cloudflare。

## 9 最终效果与经验

这套方案的核心优点是职责清晰：

- Obsidian Vault 负责写作和知识管理。
- `public` 目录负责定义公开边界。
- 博客仓库负责主题、页面和构建。
- GitHub Actions 负责同步。
- Cloudflare Pages 负责托管和部署。
- Cloudflare R2 负责图片附件。

博客内容和网站代码分离后，既能保证私人笔记安全，也能继续享受 Obsidian 的写作体验。后续更换主题或托管平台时，也不会影响 Vault 中的原始文章。

## 10 相关阅读

- 下一篇：为 Astro 博客接入 Waline 评论系统
- 下一篇：AstroPaper 博客美化与功能定制记录
- [Astro 官方文档](https://docs.astro.build/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [GitHub Actions 文档](https://docs.github.com/actions)
