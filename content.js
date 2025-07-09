
const ADDED_BUTTON_CLASS = 'gemini-submit-button-added';
const BUTTON_TEXT = 'Chat'; // Using a simple arrow icon

// Function to add a button to a video element
function addButtonToVideo(videoElement) {
  // Check if a button has already been added
  if (videoElement.classList.contains(ADDED_BUTTON_CLASS)) {
    return;
  }

  // Mark this element as processed
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


  // Find the thumbnail container to make its position relative
  const thumbnailContainer = videoElement.querySelector('#thumbnail');
  if (thumbnailContainer) {
    thumbnailContainer.style.position = 'relative';
    thumbnailContainer.appendChild(button);

    // Show button on hover
    thumbnailContainer.addEventListener('mouseenter', () => {
      button.style.opacity = '1';
    });
    thumbnailContainer.addEventListener('mouseleave', () => {
      button.style.opacity = '0';
    });
  } else {
      // Fallback if #thumbnail is not found
      videoElement.style.position = 'relative';
      videoElement.appendChild(button);
  }


  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Find the video link within the element
    const linkElement = videoElement.querySelector('a#thumbnail');
    if (linkElement && linkElement.href) {
      const videoUrl = linkElement.href;
      console.log('Video URL found:', videoUrl);
      
      // Send the URL to the background script.
      // We don't use a callback here to avoid the "context invalidated" error
      // if the page navigates after the click.
      chrome.runtime.sendMessage({ action: "openAndSubmit", url: videoUrl });

    } else {
      console.error('Could not find the video link.');
    }
  });
}

// Function to scan for new videos and add buttons
function scanForVideos() {
  // This selector now targets videos on the homepage, search results,
  // and the related videos list on the watch page.
  const videos = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer');
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
