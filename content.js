
const ADDED_BUTTON_CLASS = 'gemini-submit-button-added';
const BUTTON_TEXT = '➤ Chat'; // Using a simple arrow icon

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

    // The href is on the linkElement we found earlier.
    if (linkElement.href) {
      const videoUrl = linkElement.href;
      console.log('Video URL found:', videoUrl);
      
      // Send the URL to the background script.
      chrome.runtime.sendMessage({ action: "openAndSubmit", url: videoUrl });
    } else {
      console.error('Could not find the video link href.');
    }
  });
}

// Function to scan for new videos and add buttons
function scanForVideos() {
  // This selector now targets videos on the homepage, search results,
  // and the related videos list on the watch page.
  const videos = document.querySelectorAll('ytd-rich-item-renderer, ytd-thumbnail, yt-lockup-view-model, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer');
  videos.forEach(addButtonToVideo);
}

// Use a MutationObserver to handle dynamically loaded content (infinite scroll)
const observer = new MutationObserver((mutations) => {
  // We can debounce this if it becomes too noisy
  scanForVideos();
});

// Start observing the main content area of YouTube
const targetNode = document.body;
const config = { childList: true, subtree: true };
observer.observe(targetNode, config);

// Initial scan
scanForVideos();
