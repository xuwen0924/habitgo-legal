# HabitGo 法律与支持页统一设计

## 目标

将 `privacy.html`、`terms.html`、`support.html` 统一为 HabitGo 首页的视觉、主题、品牌和语言体验。隐私政策与用户协议正文分别以用户提供的 Notion 页面为内容基准；支持页保留现有信息结构并完成 HabitGo 品牌适配和中英文翻译。

## 内容边界

- 隐私页保留页面标题区和现有 2026 生效/更新日期，删除其后的旧“道格”正文，换为 Notion `Privacy Policy` 的完整结构与内容。
- 条款页保留页面标题区和现有 2026 生效日期，删除其后的旧“道格”正文，换为 Notion `Terms & Conditions` 的完整结构与内容。
- 来源正文中的 `HabitDone`、`Dison`、`disonstudio@gmail.com`、`2024-01-15` 分别适配为 `HabitGo`、`XuWen`、`xuwen0924@outlook.com` 和页面顶部对应的 2026 日期。
- 保留 Google Play Services 与 RevenueCat 的官方外链。
- 支持页保留联系卡、回复时间、常见问题和社群结构，将“道格”替换为 HabitGo，并提供语义一致的英文版。
- 三页页脚统一为 `Habitgo · © 2026 XuWen`。

## 架构

新增一份法律页共享样式和一份共享运行时，避免三页复制主题与语言逻辑。每个 HTML 页面保留可访问的英文无脚本正文，并通过 `data-i18n` 键映射到页面专属的中英文 locale 文件。共享运行时只负责主题、语言解析和 DOM 翻译，不依赖首页隐藏的语言弹窗。

文件职责：

- `styles/legal-pages.css`：三页布局、首页同款主题变量、浅色 `#F2F7FB`、深色 `#233355`、正文卡片、链接和页脚样式。
- `scripts/legal-pages.js`：解析 `isDark=true|false`、系统主题、`language=en|zh-CN`、已存语言、系统语言及英文兜底；应用标题、文本和属性翻译。
- `locales/legal-en.js` / `locales/legal-zh-CN.js`：按 `privacy`、`terms`、`support` 命名空间保存三页文案。
- 三个 HTML：提供语义结构、英文 fallback、共享资源引用和页面命名空间。

## 主题与语言契约

主题默认跟随 `prefers-color-scheme`；`isDark=true` 强制深色，`isDark=false` 强制浅色，非法值回退系统。背景颜色与首页完全一致，并同步 `theme-color`。

语言优先级为 URL `language` 参数、`habitgo.language` 本地值、系统语言、英文。支持 `en` 与 `zh-CN`，默认英文，不展示手动切换入口。页面 `<html lang>`、`<title>` 和全部可见正文同步更新。

## 展示

三页沿用窄阅读列、温暖卡片、圆角边框和舒展行距。顶部导航与页脚保持一致；页脚上方使用首页同款分隔线。窄屏从 320 CSS 像素起不产生横向滚动，长链接允许换行。

## 验证

先增加标准库 HTML 验收测试并确认旧页面失败，再实现最小改动。测试覆盖：三页共享资源、精确主题颜色与参数契约、双语 key 完整性、Notion 核心段落、外链、HabitGo/XuWen/新邮箱/2026 日期、旧主体信息消失、精确页脚。最后执行 JavaScript 语法检查、OpenSpec 严格校验、diff 检查和桌面/移动浏览器的中英文与深浅色验证。

## 非目标

- 不增加手动语言切换界面。
- 不修改 `index.html` 的内容或交互。
- 不对来源法律条款做超出品牌、联系方式、日期和忠实翻译之外的法律重写。
