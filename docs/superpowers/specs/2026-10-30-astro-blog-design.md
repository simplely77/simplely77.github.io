# Simplely 博客迁移

将空的 Chirpy 博客迁移为 Astro + Fuwari，保留 Simplely 标题、中文简介、simplely 昵称及 https://simplely77.github.io 地址。用户已选择 Astro，并要求由助手完成迁移。Fuwari 是助手选择的默认样式。

前期比较了保留 Chirpy、Astro 加 Pages CMS，以及需要服务器的 Halo。用户最终选择 Astro；Pages CMS 补足网页编辑体验，GitHub Pages 保留免费托管。

Pages CMS 管理 Markdown 文章、草稿、分类、标签、封面、正文图片、关于页面，以及 JSON 中的标题、副标题、简介、头像和昵称。图片保存至 public/uploads，网页地址为 /uploads。主题通过现有 config.ts 读取 JSON，不引入新服务或数据库。

不创建虚构的已发布技术文章。提供一篇默认隐藏的技术问题记录模板。后台草稿开关仅控制网站是否展示，公开 GitHub 仓库中的源文件仍可读取。

替换旧 Ruby 构建工作流为安装锁定依赖、检查、构建、验证和 GitHub Pages 发布。仅主分支推送或手动触发可发布；PR 只校验。站点信息的后台修改也必须影响实际构建结果。

验收：模拟 CMS 修改个人资料、上传图片、保存带引号的日期、发布文章与隐藏草稿；构建输出、RSS 和 sitemap 正确。完成本地构建和页面检查。实际 GitHub 发布与 Pages CMS 登录授权需账号权限，本次不推送。

实现补充：中文标题不直接参与文件名生成；后台使用必填的英文文章地址标识，避免中文被严格 slugify 后产生同名文件。主题源码的全局样式为空，宽泛图片 glob 会将 CSS 当独立模块处理；改为显式加载全局样式并仅匹配图片扩展名，冷构建验证通过。
