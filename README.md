# Simplely 技术笔记

基于 Astro + [Fuwari](https://github.com/saicaca/fuwari)，通过 [Pages CMS](https://app.pagescms.org/) 管理内容，部署到 GitHub Pages。

- 网站：https://simplely77.github.io/
- 内容后台：https://app.pagescms.org/
- 仓库：https://github.com/simplely77/simplely77.github.io

## 首次启用

将迁移代码发布到仓库的 `main` 分支后，在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。等待 **Actions → Build and Deploy** 成功后再访问网站。

登录 Pages CMS，使用 GitHub 账号安装并授权它的 GitHub App，只选择 `simplely77.github.io` 仓库。打开该仓库的 `main` 分支，后台会读取根目录已有的 `.pages.yml`，无需另写配置。

Pages CMS 是独立的后台服务，网站没有独立的管理员密码，也不需要额外部署服务器。Codex 的 GitHub 插件不影响网站或后台的运行。

## 日常使用

### 写技术记录

进入 **文章 → 新建**，填写标题、文章地址标识、日期、分类、标签和正文，可选择封面并在正文中上传图片。标题可以用中文，地址标识使用 `postgres-timeout` 这样的英文短名，每篇文章各不相同。新文章默认开启草稿；准备公开时关闭草稿并保存。图片保存在 `public/uploads`，网页地址为 `/uploads/...`。

仓库包含一篇隐藏的「技术问题记录模板」，可参考其中的问题现象、环境、排查、原因、解决方案与验证结果结构。文章地址为 `/posts/地址标识/`，发布后尽量不要修改地址标识。

草稿开关只控制文章是否出现在网站、RSS 和搜索中。**这是公开 GitHub 仓库，草稿源文件仍公开，不适合保存密码、密钥或未脱敏资料。**

### 修改头像和资料

进入 **网站与个人资料**，修改昵称、个人简介和头像，也可修改网站名称、副标题及简介。头像可以从媒体库选择或上传。未设置头像时使用 GitHub 头像。

### 修改关于页面

进入 **关于页面** 编辑正文并保存。

所有保存操作都会写回 GitHub，并触发构建。网站需等 Actions 部署成功后才更新；后台保存成功不代表网站已部署完成。

## 本地开发与验证

使用 Node.js 22 LTS 和项目指定的 pnpm 9.14.4：

```sh
npm install --global pnpm@9.14.4
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器默认显示草稿，生产构建会排除草稿。验证及预览：

```sh
pnpm check
pnpm test
pnpm build
pnpm preview
```

`pnpm test` 临时生成文章、图片和个人资料，验证后台保存格式的兼容性、图片路径及草稿隔离，构建到独立的临时目录，结束后恢复源文件并移除测试产物，不会覆盖正式的 `dist`。发布或预览前执行 `pnpm build`，生成最终站点。

工作流在 PR 中只检查和构建，合入 `main` 后才部署。依赖由 `pnpm-lock.yaml` 锁定。

## 后续绑定自己的域名

确认域名后，修改 `astro.config.mjs` 的 `site` 为实际 HTTPS 地址，同时在仓库 **Settings → Pages → Custom domain** 和 DNS 管理后台配置。用户主页仓库的 `base` 保持 `/`。当前未绑定自定义域名。

## 备份与恢复

文章、上传图片及个人资料均保存在仓库，可定期下载源码或克隆备份。错误修改可以通过 Git 历史恢复对应文件。迁移前的 Chirpy 版本为 `718f38684a9aefb3a43fdf2016a202881a518bbc`；如需回退，可通过新的回退提交恢复，避免强制推送。

## 模板来源

Fuwari 上游版本：`6d39b0dec41282e7852e23e032998a5789abee28`。保留 MIT 许可证和主题署名。迁移移除了模板演示文章，未为用户创建虚构的技术记录。文章内容的授权方式由作者决定，因此默认不展示模板自带的文章授权条款。
