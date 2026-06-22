# Post Reading Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive article page with a resizable tree table of contents on the left, the article in the center, the knowledge graph on the right, and viewport-edge article navigation.

**Architecture:** Move hierarchy and width constraints into small browser-safe utilities with Node tests. Render the directory recursively, drive the desktop grid with CSS custom properties, and keep article navigation independent from the grid by anchoring it to viewport edges.

**Tech Stack:** Astro 6, TypeScript, CSS Grid, browser DOM APIs, Node test runner, localStorage.

---

### Task 1: Directory Tree Data

**Files:**
- Create: `src/utils/articleToc.mjs`
- Create: `tests/article-toc.test.mjs`

- [ ] Write failing tests proving `H2-H4` headings become a nested tree and active headings return their ancestor path.
- [ ] Run `node --test tests/article-toc.test.mjs` and confirm missing exports fail.
- [ ] Implement `buildArticleTocTree` and `getArticleTocPath`.
- [ ] Run the focused test and confirm it passes.

### Task 2: Resizable Sidebar Width

**Files:**
- Create: `src/utils/postLayout.mjs`
- Create: `tests/post-layout.test.mjs`

- [ ] Write failing tests for clamping widths to `220-420` and restoring the `280` default.
- [ ] Run `node --test tests/post-layout.test.mjs` and confirm missing exports fail.
- [ ] Implement `clampTocWidth` and exported width constants.
- [ ] Run the focused test and confirm it passes.

### Task 3: Tree Directory Component

**Files:**
- Modify: `src/components/ArticleToc.astro`
- Modify: `src/pages/posts/[...slug]/index.astro`

- [ ] Replace the flat list with recursive `H2-H4` tree markup.
- [ ] Add per-branch toggles plus expand-all and collapse-all controls.
- [ ] Keep the active item and its ancestor branches expanded and visible.
- [ ] Move the directory into the left desktop column.

### Task 4: Three-Column Resizable Layout

**Files:**
- Create: `src/components/PostSidebarResizer.astro`
- Modify: `src/pages/posts/[...slug]/index.astro`

- [ ] Add the divider between the directory and article.
- [ ] Update `--post-toc-width` while dragging and persist it in localStorage.
- [ ] Restore the default width on divider double-click.
- [ ] Use desktop grid columns `toc / divider / article / graph` at `1280px` and above.
- [ ] Keep directory and graph as collapsible cards above the article below `1280px`.

### Task 5: Viewport Article Navigation

**Files:**
- Modify: `src/pages/posts/[...slug]/_components/SidePostNav.astro`
- Modify: `src/pages/posts/[...slug]/_components/AdjacentPostNav.astro`
- Modify: `tests/side-post-nav.test.mjs`

- [ ] Anchor desktop controls to `left` and `right` viewport safe areas rather than a centered max-width container.
- [ ] Expand titles inward on hover and keyboard focus.
- [ ] Add `Alt+ArrowLeft` and `Alt+ArrowRight` shortcuts.
- [ ] Add a compact expandable mobile article-navigation control.
- [ ] Keep the static bottom cards as a no-script fallback.

### Task 6: Verification and Delivery

**Files:**
- Verify all modified files and production artifacts.

- [ ] Run `npm.cmd test`.
- [ ] Run `npx.cmd astro check`.
- [ ] Run Prettier checks on changed files.
- [ ] Run `npm.cmd run build`.
- [ ] Inspect generated article HTML and CSS for the three-column grid, tree controls, resizer, and edge navigation.
- [ ] Commit, rebase from `origin/main`, and push `main`.
