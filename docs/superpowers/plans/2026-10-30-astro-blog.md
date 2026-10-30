# Astro Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 将 Simplely 博客迁移至可通过网页后台维护的 Astro 网站。

**Architecture:** 采用官方 Fuwari 模板，Pages CMS 编辑仓库中的 Markdown 和 JSON。GitHub Actions 构建静态站点并发布 GitHub Pages。

**Tech Stack:** Astro、Fuwari、Pages CMS、pnpm、GitHub Pages。

**Spec:** ../specs/2026-10-30-astro-blog-design.md

## Global Constraints

- 地址 https://simplely77.github.io，base 为 /。
- 使用中文，保留现有站点信息；不编造已发布文章。
- 图片保存至 public/uploads，网页地址 /uploads。
- 不推送远程，不改 GitHub 账号授权和域名设置。

## Review Focus

- CMS 将日期写成字符串时，应能正常构建文章。
- 草稿不可出现在文章路由、首页、归档、RSS 和搜索索引中。
- 后台修改昵称、头像、标题应实际影响前台。
- 图片上传位置应对应可公开访问的图片路径。
- 空博客仍应有可用首页；PR 不应触发发布。

## Task 1: 模板迁移和内容兼容

**Files:** 官方模板 src/、public/、package.json、pnpm-lock.yaml；scripts/test-site.mjs。

**Interfaces:** 产出静态 dist/，保留主题文章 schema。

- [x] 导入官方模板并移除旧 Jekyll 专用文件；记录模板 commit。
- [x] 编写真实构建集成检查：模拟后台资料、日期字符串、图片和草稿。
- [x] 运行检查，确认原模板不满足后台编辑契约。
- [x] 适配 src/config.ts 读取 src/data/site.json；兼容 CMS 日期。
- [x] 添加个人关于页与隐藏的问题记录模板，移除上游演示文章。

## Task 2: 后台与部署

**Files:** .pages.yml、.github/workflows/pages-deploy.yml、README.md。

**Interfaces:** CMS 写入 Task 1 的内容目录、图片目录和 site.json。

- [x] 配置文章、资料、关于页面表单和媒体上传映射。
- [x] 配置 PR 校验、主分支发布和精确 Node/pnpm 版本。
- [x] 写清日常使用、草稿公开范围、发布等待时间、备份和回滚方式。

## Task 3: 验证和交付

**Files:** scripts/test-site.mjs、outputs 中的源码包和迁移补丁。

**Interfaces:** 接收构建输出和完整 Git diff。

- [x] 运行真实内容集成检查、Astro 检查和最终无测试内容的生产构建。
- [x] 检查桌面及移动页面，核对工作流与 CMS 配置。
- [x] 完成独立代码审查并处理重要问题。
- [x] 打包源码及补丁，不包含依赖、测试输出、凭证和 Git 元数据。
