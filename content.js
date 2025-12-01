
const ADDED_BUTTON_CLASS = 'gemini-submit-button-added';
const ADDED_PLAYER_BUTTON_CLASS = 'gemini-player-button-added'; // 新增：标记播放器按钮
const BUTTON_TEXT = '➤ Chat'; // Using a simple arrow icon
const COPIED_TEXT = 'Copied!'; // 新增：复制成功的提示文本

// Default selectors, in case none are stored yet. This should match options.js
const DEFAULT_SELECTORS = {
    searchResultItem: 'ytd-video-renderer',
    searchResultTitle: 'yt-formatted-string.ytd-video-renderer',
    searchResultLink: 'a#video-title',
    otherVideoItems: 'ytd-rich-item-renderer, yt-lockup-view-model, ytd-compact-video-renderer, ytd-grid-video-renderer',
    thumbnailTarget: 'a.yt-lockup-view-model__content-image',
    thumbnailLink: 'a#thumbnail, a.yt-lockup-view-model__content-image'
};

/**
 * Main initializer for the content script.
 * This function is called after the configuration is loaded from chrome.storage.
 * @param {object} CONFIG - The configuration object with selectors.
 */
function initialize(CONFIG) {

  // Function to add a button to a video element (thumbnail version)
  function addButtonToVideo(videoElement) {
    if (videoElement.classList.contains(ADDED_BUTTON_CLASS)) {
      return;
    }
    const linkElement = videoElement.querySelector(CONFIG.selectors.thumbnailTarget);
    if (!linkElement) {
      return;
    }
    videoElement.classList.add(ADDED_BUTTON_CLASS);

    const button = document.createElement('button');
    button.innerText = BUTTON_TEXT;
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
    button.style.opacity = '0';
    button.style.transition = 'opacity 0.2s';
    linkElement.style.position = 'relative';

    const thumbnailImg = linkElement.querySelector('img');
    if (thumbnailImg) {
      thumbnailImg.style.objectFit = 'cover';
    }
    linkElement.appendChild(button);

    linkElement.addEventListener('mouseenter', () => { button.style.opacity = '1'; });
    linkElement.addEventListener('mouseleave', () => { button.style.opacity = '0'; });

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const videoLinkElement = videoElement.querySelector(CONFIG.selectors.thumbnailLink);
      if (videoLinkElement && videoLinkElement.href) {
        navigator.clipboard.writeText(videoLinkElement.href).then(() => {
          button.innerText = COPIED_TEXT;
          setTimeout(() => { button.innerText = BUTTON_TEXT; }, 1500);
        });
        chrome.runtime.sendMessage({ action: "openTabOnly" });
      } else {
        console.error('Could not find the video link.');
      }
    });
  }

  // Function to add a button in front of the video title
  function addButtonToPlayer() {
    if (!window.location.pathname.startsWith('/watch')) return;

    const titleElement = document.querySelector('#title h1.ytd-watch-metadata');
    if (!titleElement || titleElement.classList.contains(ADDED_PLAYER_BUTTON_CLASS)) {
      return;
    }
    titleElement.classList.add(ADDED_PLAYER_BUTTON_CLASS);

    const button = document.createElement('button');
    button.innerText = BUTTON_TEXT;
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    button.style.color = 'white';
    button.style.border = '1px solid white';
    button.style.borderRadius = '4px';
    button.style.padding = '2px 6px';
    button.style.fontSize = '12px';
    button.style.cursor = 'pointer';
    button.style.marginRight = '8px';
    button.style.display = 'inline-block';
    button.style.verticalAlign = 'middle';

    // Insert the button at the beginning of the h1 tag
    titleElement.insertBefore(button, titleElement.firstChild);

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigator.clipboard.writeText(window.location.href).then(() => {
        button.innerText = COPIED_TEXT;
        setTimeout(() => { button.innerText = BUTTON_TEXT; }, 1500);
      });
      chrome.runtime.sendMessage({ action: "openTabOnly" });
    });
  }

  const SEARCH_BUTTON_ADDED_CLASS = 'gemini-search-button-added';

  // Function to add a button to a search result item (title version)
  function addChatButtonToSearchItem(videoElement) {
    const titleElement = videoElement.querySelector(CONFIG.selectors.searchResultTitle);
    if (!titleElement || titleElement.classList.contains(SEARCH_BUTTON_ADDED_CLASS)) {
      return;
    }
    titleElement.classList.add(SEARCH_BUTTON_ADDED_CLASS);

    const button = document.createElement('button');
    button.innerText = BUTTON_TEXT;
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    button.style.color = 'white';
    button.style.border = '1px solid white';
    button.style.borderRadius = '4px';
    button.style.padding = '2px 6px';
    button.style.fontSize = '12px';
    button.style.cursor = 'pointer';
    button.style.marginRight = '8px';
    button.style.display = 'inline-block';
    button.style.verticalAlign = 'middle';
    titleElement.parentNode.insertBefore(button, titleElement);

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const linkElement = videoElement.querySelector(CONFIG.selectors.searchResultLink);
      if (linkElement && linkElement.href) {
        navigator.clipboard.writeText(linkElement.href).then(() => {
          button.innerText = COPIED_TEXT;
          setTimeout(() => { button.innerText = BUTTON_TEXT; }, 1500);
        });
        chrome.runtime.sendMessage({ action: "openTabOnly" });
      } else {
        console.error('Could not find the video link for search item.');
      }
    });
  }

  // Main scanning function
  function scanForVideos() {
    const searchVideos = document.querySelectorAll(CONFIG.selectors.searchResultItem);
    searchVideos.forEach(addChatButtonToSearchItem);

    const otherVideos = document.querySelectorAll(CONFIG.selectors.otherVideoItems);
    otherVideos.forEach(addButtonToVideo);
    
    addButtonToPlayer();
  }

  // --- Observer and Initial Scan ---
  const observer = new MutationObserver(() => {
    clearTimeout(window.geminiTimeoutId);
    window.geminiTimeoutId = setTimeout(scanForVideos, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  scanForVideos();
}

// --- Script Entry Point ---
// Load the configuration from storage and then initialize the script.
chrome.storage.sync.get({
  selectors: DEFAULT_SELECTORS
}, function(items) {
  initialize({ selectors: items.selectors });
});
