// The default selectors, in case none are stored yet.
const DEFAULT_SELECTORS = {
    searchResultItem: 'ytd-video-renderer',
    searchResultTitle: 'yt-formatted-string.ytd-video-renderer',
    searchResultLink: 'a#video-title',
    otherVideoItems: 'ytd-rich-item-renderer, yt-lockup-view-model, ytd-compact-video-renderer, ytd-grid-video-renderer',
    thumbnailTarget: 'a.yt-lockup-view-model__content-image',
    thumbnailLink: 'a#thumbnail, a.yt-lockup-view-model__content-image'
};

// Saves options to chrome.storage
function save_options() {
  const selectors = {
    searchResultItem: document.getElementById('searchResultItem').value,
    searchResultTitle: document.getElementById('searchResultTitle').value,
    searchResultLink: document.getElementById('searchResultLink').value,
    otherVideoItems: document.getElementById('otherVideoItems').value,
    thumbnailTarget: document.getElementById('thumbnailTarget').value,
    thumbnailLink: document.getElementById('thumbnailLink').value,
  };

  chrome.storage.sync.set({ selectors: selectors }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores selector options using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    selectors: DEFAULT_SELECTORS // Use defaults if nothing is stored
  }, function(items) {
    document.getElementById('searchResultItem').value = items.selectors.searchResultItem;
    document.getElementById('searchResultTitle').value = items.selectors.searchResultTitle;
    document.getElementById('searchResultLink').value = items.selectors.searchResultLink;
    document.getElementById('otherVideoItems').value = items.selectors.otherVideoItems;
    document.getElementById('thumbnailTarget').value = items.selectors.thumbnailTarget;
    document.getElementById('thumbnailLink').value = items.selectors.thumbnailLink;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);