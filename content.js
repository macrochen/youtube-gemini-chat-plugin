
const ADDED_BUTTON_CLASS = 'gemini-submit-button-added';
const ADDED_PLAYER_BUTTON_CLASS = 'gemini-player-button-added'; // 新增：标记播放器按钮
const BUTTON_TEXT = '➤ Chat'; // Using a simple arrow icon
const COPIED_TEXT = 'Copied!'; // 新增：复制成功的提示文本

// Function to add a button to a video element
function addButtonToVideo(videoElement) {
  // Check if the main container has already been processed.
  if (videoElement.classList.contains(ADDED_BUTTON_CLASS)) {
    return;
  }

  // Use a more robust selector to find the link/thumbnail container.
  // This handles multiple YouTube layouts, including the main grid, watch page sidebar, and channel pages.
  const linkElement = videoElement.querySelector('a#thumbnail, a.yt-lockup-view-model-wiz__content-image');

  // If no link element is found inside this container, we can't proceed.
  if (!linkElement) {
    return;
  }

  // Mark the main container as processed to avoid adding duplicate buttons.
  videoElement.classList.add(ADDED_BUTTON_CLASS);

  const button = document.createElement('button');
  button.innerText = BUTTON_TEXT;
  
  // Basic styling
  button.style.position = 'absolute';
  button.style.top = '8px';
  button.style.right = '8px';
  button.style.zIndex = '1000';
  button.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  button.style.color = 'white';
  button.style.border = '1px solid white';
  button.style.borderRadius = '4px';
  button.style.padding = '4px 8px';
  button.style.fontSize = '12px';
  button.style.cursor = 'pointer';
  button.style.opacity = '0'; // Initially hidden
  button.style.transition = 'opacity 0.2s';

  // The link element itself is the best place to attach the button and hover events.
  // It needs a position so the absolute-positioned button is relative to it.
  linkElement.style.position = 'relative';
  
  // 保持缩略图原始宽高比
  const thumbnailImg = linkElement.querySelector('img');
  if (thumbnailImg) {
    // 确保图片保持原始宽高比
    thumbnailImg.style.objectFit = 'cover';
  }
  
  // 确保链接元素不会因为相对定位而改变尺寸
  const originalWidth = getComputedStyle(linkElement).width;
  const originalHeight = getComputedStyle(linkElement).height;
  if (originalWidth && originalHeight) {
    linkElement.style.width = originalWidth;
    linkElement.style.height = originalHeight;
  }
  
  linkElement.appendChild(button);

  // Show button on hover
  linkElement.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
  });
  linkElement.addEventListener('mouseleave', () => {
    button.style.opacity = '0';
  });

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const linkElement = videoElement.querySelector('a#thumbnail, a.yt-lockup-view-model-wiz__content-image');
    if (linkElement && linkElement.href) {
      const videoUrl = linkElement.href;
      
      // Copy the URL to the clipboard
      navigator.clipboard.writeText(videoUrl).then(() => {
        console.log('Video URL copied to clipboard:', videoUrl);
        // Optionally, show a brief confirmation to the user
        button.innerText = COPIED_TEXT;
        setTimeout(() => { button.innerText = BUTTON_TEXT; }, 1500);
      }).catch(err => {
        console.error('Failed to copy URL: ', err);
      });

      // Send a message to the background script to open the new tab
      chrome.runtime.sendMessage({ action: "openTabOnly" });

    } else {
      console.error('Could not find the video link.');
    }
  });
}

// 新增：为视频播放器添加按钮的函数
function addButtonToPlayer() {
  // 只在视频播放页面执行
  if (!window.location.pathname.startsWith('/watch')) {
    return;
  }
  
  // 查找视频播放器容器
  const playerContainer = document.getElementById('player');
  if (!playerContainer || playerContainer.classList.contains(ADDED_PLAYER_BUTTON_CLASS)) {
    return;
  }
  
  // 标记播放器已处理
  playerContainer.classList.add(ADDED_PLAYER_BUTTON_CLASS);
  
  // 创建按钮
  const button = document.createElement('button');
  button.innerText = BUTTON_TEXT;
  
  // 设置按钮样式，与缩略图按钮保持一致
  button.style.position = 'absolute';
  button.style.top = '12px';
  button.style.right = '12px';
  button.style.zIndex = '9999'; // 更高的z-index确保按钮在控件上方
  button.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  button.style.color = 'white';
  button.style.border = '1px solid white';
  button.style.borderRadius = '4px';
  button.style.padding = '4px 8px';
  button.style.fontSize = '12px';
  button.style.cursor = 'pointer';
  button.style.opacity = '0'; // 初始隐藏
  button.style.transition = 'opacity 0.2s';
  
  // 确保播放器容器有相对定位
  if (getComputedStyle(playerContainer).position === 'static') {
    playerContainer.style.position = 'relative';
  }
  
  // 添加按钮到播放器
  playerContainer.appendChild(button);
  
  // 鼠标悬停显示按钮
  playerContainer.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
  });
  playerContainer.addEventListener('mouseleave', () => {
    button.style.opacity = '0';
  });
  
  // 点击按钮的处理
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // 获取当前视频URL
    const videoUrl = window.location.href;
    
    // 复制URL到剪贴板
    navigator.clipboard.writeText(videoUrl).then(() => {
      console.log('Video URL copied to clipboard:', videoUrl);
      button.innerText = COPIED_TEXT;
      setTimeout(() => { button.innerText = BUTTON_TEXT; }, 1500);
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
    });
    
    // 发送消息给后台脚本打开新标签页
    chrome.runtime.sendMessage({ action: "openTabOnly" });
  });
}

// Function to scan for new videos and add buttons
function scanForVideos() {
  // This selector now targets videos on the homepage, search results,
  // and the related videos list on the watch page.
  const videos = document.querySelectorAll('ytd-rich-item-renderer, ytd-thumbnail, yt-lockup-view-model, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer');
  videos.forEach(addButtonToVideo);
  
  // 新增：处理视频播放器
  addButtonToPlayer();
}

// Use a MutationObserver to handle dynamically loaded content (infinite scroll)
const observer = new MutationObserver(() => {
  // 使用防抖动处理，避免频繁调用
  clearTimeout(window.geminiTimeoutId);
  window.geminiTimeoutId = setTimeout(scanForVideos, 300);
});

// Start observing the main content area of YouTube
const targetNode = document.body;
const config = { childList: true, subtree: true };
observer.observe(targetNode, config);

// Initial scan
scanForVideos();
