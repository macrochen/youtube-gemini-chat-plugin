// ==UserScript==
// @name         Gemini 混合模式 (v3.1 "自动清空"版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  保留手动按钮，在自动发送成功后清空剪贴板。
// @author       Gemini-Helper
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式定义 (用于按钮) ---
    GM_addStyle(`
        .paste-and-send-button {
            position: fixed;
            bottom: 110px;
            right: 20px;
            z-index: 9999;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 8px;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        .paste-and-send-button:hover {
            background-color: #45a049;
        }
    `);

    /**
     * 等待指定的元素出现在页面上
     * @param {string} selector - CSS 选择器
     * @param {number} timeout - 最长等待时间（毫秒）
     * @returns {Promise<Element>} - 找到的元素
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 200;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
                elapsedTime += intervalTime;
                if (elapsedTime >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`等待超时: 未在 ${timeout}ms 内找到元素 "${selector}"`));
                }
            }, intervalTime);
        });
    }

    // --- 核心功能函数 ---
    async function pasteAndSubmit(isAuto = false) {
        try {
            const textToPaste = await navigator.clipboard.readText();

            if (isAuto) {
                const requiredPattern = /^https:\/\/www\.youtube\.com\/watch\?v=/;
                if (!requiredPattern.test(textToPaste)) {
                    console.log('Gemini 自动脚本：剪贴板内容不是YouTube链接，已跳过自动发送。');
                    console.log('【实际内容为】:', textToPaste);
                    return;
                }
                console.log('Gemini 自动脚本：检测到YouTube链接，准备自动发送...');
            }

            const editorDiv = await waitForElement('div.ql-editor');
            const p_element = editorDiv.querySelector('p');
            if (p_element) {
                p_element.textContent = textToPaste;
            } else {
                editorDiv.textContent = textToPaste;
            }
            editorDiv.classList.remove('ql-blank');
            editorDiv.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

            await new Promise(resolve => setTimeout(resolve, 100));

            const sendButton = await waitForElement('button[aria-label*="Send"], button[aria-label*="发送"]');
            sendButton.click();
            
            // --- 【本次更新】 ---
            // 在成功发送后，用空字符串覆盖剪贴板内容，实现清空
            await navigator.clipboard.writeText('');
            // --- 更新结束 ---

            console.log(`Gemini 脚本：内容已通过 ${isAuto ? '自动' : '手动'} 方式发送，并且剪贴板已清空！`);

        } catch (err) {
            console.error(`Gemini 脚本操作失败: ${err.message}`);
        }
    }

    // --- 创建按钮 (用于手动操作) ---
    function createButton() {
        if (document.querySelector('.paste-and-send-button')) return;

        const button = document.createElement('button');
        button.textContent = '粘贴并发送';
        button.className = 'paste-and-send-button';
        button.addEventListener('click', () => pasteAndSubmit(false));
        document.body.appendChild(button);
    }

    // --- 启动脚本 ---
    console.log('Gemini 混合模式脚本 (v3.1) 已启动。');
    waitForElement('main', 10000)
        .then(() => {
            console.log('Gemini 脚本：页面框架已加载。');
            createButton();
            console.log('Gemini 脚本：手动按钮已创建。');
            pasteAndSubmit(true);
        })
        .catch(err => {
            console.error(`Gemini 脚本启动失败: ${err.message}`);
        });

})();