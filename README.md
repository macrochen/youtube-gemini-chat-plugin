# YouTube to Gemini Gem Assistant

A Chrome extension that streamlines the process of sending a YouTube video link to your custom Gemini Gem for summarization and conversation.

## Features

-   Adds a "➤ Chat" button directly onto YouTube video thumbnails on hover.
-   One-click action copies the video's URL to your clipboard.
-   Simultaneously opens your custom Gemini Gem in a new tab.
-   Allows for a quick, manual paste (`Cmd+V` or `Ctrl+V`) to start interacting with your video content.
-   The target Gemini Gem URL is configurable via the extension's options page.

## How It Works

This extension is designed to bridge the gap between watching YouTube and analyzing video content with your specialized AI assistant. Instead of manually copying links, opening new tabs, and navigating to your Gem, this tool reduces the entire workflow to two simple steps: a click and a paste.

Due to Chrome's security policies that protect pages like Gemini, extensions are not permitted to automatically paste content. This is a crucial security feature to protect your data. Our extension respects this by simplifying the process as much as possible within these safety boundaries.

## How to Install and Use

### 1. Installation

1.  Download or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the project directory (`youtube-gemini-chat-plugin`).

### 2. Configuration

1.  After installation, find the extension card in your extensions list and click on "Details", then "Extension options". Alternatively, right-click the extension icon in your browser toolbar and select "Options".
2.  In the options page, enter the **full URL of your custom Gemini Gem** (e.g., `https://gemini.google.com/u/1/gem/your_gem_id`).
3.  Click "Save".

### 3. Usage

1.  Navigate to `https://www.youtube.com`.
2.  Hover your mouse over any video thumbnail. A "➤ Chat" button will appear.
3.  **Click the button.** The video's URL is now in your clipboard, and your Gemini Gem page opens in a new tab.
4.  In the Gemini page, **paste the link** (`Cmd+V` or `Ctrl+V`) into the chat input box to begin your analysis.

---

# YouTube 视频链接到 Gemini 智能体助手

本 Chrome 插件旨在简化您的工作流：快速抓取 YouTube 视频链接，并将其发送到您定制的 Gemini Gem（智能体）以进行内容总结和对话。

## 功能特性

-   在 YouTube 视频缩略图上悬停时，会自动显示一个“➤ Chat”按钮。
-   一键点击即可将视频链接复制到您的剪贴板。
-   点击按钮的同时，会在新标签页中打开您定制的 Gemini Gem 页面。
-   您只需在新页面中手动粘贴（`Cmd+V` 或 `Ctrl+V`），即可开始与您的视频内容互动。
-   目标 Gemini Gem 的网址可以通过插件的选项页面进行配置。

## 工作原理

本插件的核心目标是打通“观看 YouTube”与“使用您专属的 AI 助手分析视频”之间的壁垒。它将原本需要手动复制链接、打开新标签、输入网址等一系列繁琐操作，简化为“一次点击，一次粘贴”两个步骤。

出于保护用户数据的核心安全考量，Chrome 浏览器的安全策略禁止任何插件自动将内容粘贴到像 Gemini 这样的受保护页面。本插件在严格遵守此安全规则的前提下，为您提供了最大程度的便利。

## 如何安装与使用

### 1. 安装

1.  下载或克隆此项目代码到您的本地电脑。
2.  打开 Google Chrome 浏览器，访问 `chrome://extensions`。
3.  在页面右上角，打开“开发者模式”的开关。
4.  点击“加载已解压的扩展程序”按钮。
5.  选择本项目的文件夹 (`youtube-gemini-chat-plugin`)。

### 2. 配置

1.  安装成功后，在扩展程序列表中找到本插件，点击“详细信息”，然后选择“扩展程序选项”。或者，您也可以右键点击浏览器工具栏上的插件图标，然后选择“选项”。
2.  在选项页面中，输入您**专属的 Gemini Gem 的完整网址**（例如: `https://gemini.google.com/u/1/gem/your_gem_id`）。
3.  点击“保存”。

### 3. 使用

1.  访问 `https://www.youtube.com`。
2.  将鼠标悬停在任意一个视频的缩略图上，一个“➤ Chat”按钮便会出现。
3.  **点击该按钮。** 此时，视频链接已被复制到您的剪贴板，同时您的 Gemini Gem 页面会在新标签页中打开。
4.  在打开的 Gemini 页面中，将链接**粘贴**（`Cmd+V` 或 `Ctrl+V`）到聊天输入框中，即可开始分析。
