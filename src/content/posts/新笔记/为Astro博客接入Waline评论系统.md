---
title: "为Astro博客接入Waline评论系统"
description: "记录如何使用 Vercel 部署 Waline 服务端、绑定评论子域名，并在 Astro 博客文章详情页接入评论区。"
pubDatetime: 2026-06-15T10:33:00.000Z
modDatetime: 2026-06-17T02:48:00.000Z
slug: 20260615-1833-1djzx
legacySlug: "新笔记/为astro博客接入waline评论系统"
tags: []
---
> 本文属于「个人博客搭建记录」系列：
>
> 1. 从 Obsidian 到 Cloudflare：Astro 博客建站与自动部署记录
> 2. 为 Astro 博客接入 Waline 评论系统
> 3. AstroPaper 博客美化与功能定制记录

## 1 为什么选择 Waline

静态博客本身没有数据库和服务端，因此无法直接保存评论。评论系统通常需要额外的服务端和数据库。

在 Twikoo 和 Waline 之间比较后，我最终选择了 Waline，原因包括：

- 前端组件成熟，接入 Astro 比较方便。
- 支持匿名评论、登录、表情、图片和评论管理。
- 可以独立部署在 Vercel。
- 评论数据存放在自己的数据库中。
- 服务端域名可以与博客域名分开管理。

最终架构如下：

```text
blog.okisama.top
    ↓ 浏览器加载评论组件
comment.okisama.top
    ↓ Waline 服务端
数据库
```

博客仍然是 Cloudflare Pages 上的静态网站，Waline 服务端单独托管在 Vercel。

## 2 部署 Waline 服务端

按照 Waline 官方提供的 Vercel 部署模板创建项目，并连接自己的 GitHub 仓库。

项目部署完成后，会获得一个 Vercel 默认域名，例如：

```text
https://waline-vercel-six.vercel.app
```

该地址可以直接访问 Waline 服务，但为了便于管理和识别，后续绑定独立子域名：

```text
https://comment.okisama.top
```

## 3 配置数据库与环境变量

Waline 必须连接数据库才能保存评论。不同数据库服务需要配置不同的环境变量，具体变量应以所选数据库和 Waline 官方文档为准。

所有数据库密钥都应存放在 Vercel 项目的：

```text
Settings → Environment Variables
```

不要将真实密钥提交到 GitHub 仓库。

除数据库配置外，建议添加以下变量：

```text
SITE_URL=https://blog.okisama.top
SECURE_DOMAINS=blog.okisama.top
```

其中：

- `SITE_URL` 指定博客地址。
- `SECURE_DOMAINS` 限制允许调用评论服务的站点域名。

修改环境变量后，需要重新部署 Vercel 项目才能生效。

## 4 绑定 comment.okisama.top

在 Vercel 项目的：

```text
Settings → Domains
```

添加：

```text
comment.okisama.top
```

Vercel 会提供所需的 DNS 记录。在 Cloudflare DNS 中按照提示添加记录，例如：

```text
comment.okisama.top  CNAME  <Vercel 提供的域名>
```

该记录通常使用“仅 DNS”，避免 Cloudflare 代理干扰 Vercel 的域名验证和证书签发。

Vercel 还可能要求添加 `_vercel` 开头的 TXT 验证记录。这条记录用于验证 `comment.okisama.top`，不能随意删除。

最终域名分工：

```text
blog.okisama.top     → Cloudflare Pages 博客
comment.okisama.top  → Vercel Waline 服务端
```

不应将根域名 `okisama.top` 绑定到 Waline 项目，否则根域名可能被重定向到评论服务，而不是博客。

## 5 在 Astro 中安装 Waline 客户端

在博客项目中安装官方客户端：

```bash
pnpm add @waline/client
```

然后在全局样式文件中引入 Waline 样式：

```css
@import "@waline/client/style";
```

创建一个独立的 Astro 评论组件，并使用 `comment.okisama.top` 初始化：

```astro
<section aria-labelledby="comments-title">
  <h2 id="comments-title">评论</h2>
  <div id="waline-comments"></div>
</section>

<script>
  import { init } from "@waline/client";

  init({
    el: "#waline-comments",
    serverURL: "https://comment.okisama.top",
    path: window.location.pathname,
    lang: "zh-CN",
    login: "enable",
    commentSorting: "latest",
    reaction: true,
    dark: "html[data-theme='dark']",
  });
</script>
```

关键配置含义：

| 配置 | 作用 |
| --- | --- |
| `el` | 评论区渲染位置 |
| `serverURL` | Waline 服务端地址 |
| `path` | 使用当前文章路径区分评论 |
| `lang` | 评论区界面语言 |
| `login` | 是否显示登录入口 |
| `commentSorting` | 评论排序方式 |
| `reaction` | 是否启用文章反应 |
| `dark` | 深色模式选择器 |

## 6 只在文章详情页展示评论

评论区只需要出现在文章详情页，不应展示在首页、标签页或关于页面。

因此将评论组件添加到文章详情页布局中，并放在正文之后、页脚之前：

```astro
<article>
  <Content />
</article>

<WalineComments />

<Footer />
```

这样每篇文章都会按照 URL 路径维护独立评论。

## 7 处理 Astro 页面切换

如果 Astro 启用了客户端页面切换，同一个页面中的脚本可能不会像传统完整刷新那样重新执行。Waline 实例也可能在切换文章后继续使用旧页面路径。

处理方式是在页面切换前销毁旧实例，并在新页面加载后重新初始化：

```js
let waline;

const mountWaline = () => {
  waline?.destroy();
  waline = init({
    el: "#waline-comments",
    serverURL: "https://comment.okisama.top",
    path: window.location.pathname,
  });
};

document.addEventListener("astro:before-swap", () => waline?.destroy());
document.addEventListener("astro:page-load", mountWaline);
```

如果博客没有启用客户端路由，则普通初始化方式通常已经足够。

## 8 注册管理员

首次部署完成后，访问：

```text
https://comment.okisama.top/ui/register
```

注册的第一个用户会成为管理员。注册完成后，可以登录后台管理评论、审核内容和配置用户。

管理员账号密码应妥善保存，并避免开放不必要的管理入口。

## 9 验证评论系统

接入完成后，应检查以下项目：

1. `https://comment.okisama.top` 能够正常访问。
2. 博客文章详情页能够加载评论框。
3. 首页和标签页不会出现评论框。
4. 提交一条测试评论后，刷新页面仍能显示。
5. 深色模式下评论区文字和背景可读。
6. 手机端评论框没有横向溢出。
7. 切换不同文章时，评论不会混在一起。

还可以直接请求 API 验证服务端与跨域配置：

```bash
curl -H "Origin: https://blog.okisama.top" \
  "https://comment.okisama.top/api/comment?path=/posts/test"
```

返回正常 JSON 数据，说明服务端和跨域配置基本可用。

## 10 常见问题

### 10.1 自定义域名显示不安全

通常是 DNS 尚未生效，或 Vercel 尚未完成证书签发。确认域名在 Vercel 中显示 `Valid Configuration`，然后等待 DNS 和证书状态更新。

### 10.2 根域名被重定向到评论区

说明 `okisama.top` 被错误绑定到了 Waline 项目。Waline 只需要保留：

```text
comment.okisama.top
waline-vercel-six.vercel.app
```

根域名应交给 Cloudflare Pages，或重定向到博客域名。

### 10.3 评论区无法加载

依次检查：

- `serverURL` 是否为 `https://comment.okisama.top`。
- Vercel 环境变量是否已重新部署。
- `SECURE_DOMAINS` 是否包含 `blog.okisama.top`。
- 浏览器控制台是否存在跨域或网络错误。
- 数据库环境变量是否正确。

## 11 最终效果

通过将 Waline 独立部署，博客仍然保持纯静态结构，评论功能则由独立服务提供：

- 博客构建失败不会影响评论数据。
- 更换博客主题不会丢失评论。
- 评论服务可以单独升级和维护。
- 域名职责清晰，便于排查问题。

## 12 相关阅读

- 上一篇：从 Obsidian 到 Cloudflare：Astro 博客建站与自动部署记录
- 下一篇：AstroPaper 博客美化与功能定制记录
- [Waline 官方文档](https://waline.js.org/)
- [Vercel 文档](https://vercel.com/docs)
