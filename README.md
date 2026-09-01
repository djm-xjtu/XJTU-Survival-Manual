# 西安交大生存指南 · XJTU Survival Manual

> 📖 在线阅读：**<https://djm-xjtu.github.io/XJTU-Survival-Manual/>**

一份写给西安交通大学在读学生的生存手册：入学须知、专业分流、绩点均分、竞赛科研、社交恋爱、润学规划……把「学长学姐的经验」一次讲透，帮你少走弯路。

- **受益人群**：西安交通大学在读学生；其他 985 / 强 211 的同学同样可以参考
- **目的**：帮助大家认识各大专业和未来规划，最大化收益、减少内卷带来的烦恼
- **贡献**：欢迎提交 [Issue](https://github.com/djm-xjtu/XJTU-Survival-Manual/issues) 和 PR 来更新内容！

## 网站特性

站点基于 Jekyll 自定义主题构建，无任何第三方依赖，推送到 `main` 后由 GitHub Actions 自动部署：

- 📚 首页文章卡片导航，按章节分组，支持标题即时筛选
- 🔍 全文搜索（快捷键 <kbd>/</kbd> 或 <kbd>Ctrl</kbd>+<kbd>K</kbd>），关键词高亮
- 🧭 文章页三栏布局：全站目录 + 正文 + 本文目录，滚动自动高亮当前小节
- 🌗 深色 / 浅色主题一键切换，自动跟随系统并记忆选择
- 📱 移动端抽屉式导航与可折叠目录，阅读进度条、上下篇导航、回到顶部
- ✍️ 针对中文长文优化的排版（字号、行距、标题层级、引用与表格样式）

## 项目分类

#### 给新人的科普
* [入学基础须知篇](./articles/1.md)
* [分流/转专业篇](./articles/2.md)
* [社团篇](./articles/3.md)
* [绩点/均分篇](./articles/4.md)
* [竞赛/科研篇](./articles/5.md)
* [佛系/奋斗篇](./articles/6.md)
* [社交/恋爱篇](./articles/7.md)
* [番外篇](./articles/8.md)
* [润学篇](./articles/9.md)

#### 专业自救指南
* [物理自救指南](./articles/xjtu_physical_advice.md)

#### 完整合集
* [交大全面建议（完整长文）](./articles/general_advice_for_XJTUers.md)

#### 实验资料
* [实验资料 XJTU-Share](https://github.com/cantjie/XJTU-Share)

#### 润学
* [润学思想大纲](https://github.com/djm-xjtu/run/)
* [国家选择](https://github.com/djm-xjtu/run/tree/main/%E6%B6%A6%E5%AD%A6%E6%96%B9%E6%B3%95%E8%AE%BA/%E5%90%84%E5%9B%BD%E9%80%89%E6%8B%A9)

## 本地预览

```bash
gem install jekyll -v 3.9.5     # 与 GitHub Pages 环境一致
jekyll serve                    # 打开 http://127.0.0.1:4000/XJTU-Survival-Manual/
```

## 目录结构

```
├── index.html          # 首页
├── 404.html            # 404 页
├── search.json         # 全文搜索索引（构建时生成）
├── _config.yml         # 站点配置：标题、导航、拓展资源
├── _layouts/           # default / article 布局
├── _includes/          # 页头、页脚、侧边导航、搜索弹窗
├── assets/css/main.css # 设计系统（含深色模式）
├── assets/js/main.js   # 目录生成、搜索、主题、进度条
└── articles/           # 全部文章（Markdown + front matter）
```

新增文章：在 `articles/` 下创建 Markdown 文件，并添加如下 front matter，首页与侧边栏会自动收录。

```yaml
---
title: "文章标题"
icon: "📌"
category: "给新人的科普"   # 分组名称
order: 12                  # 排序
summary: "一句话简介，会显示在卡片和文章页。"
tags: ["标签一", "标签二"]
article: true              # 必填，标记为文章
---
```
