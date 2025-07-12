
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openTabOnly") {
    chrome.storage.sync.get({ targetUrl: '' }, (items) => {
      if (items.targetUrl) {
        chrome.tabs.create({ url: items.targetUrl });
      } else {
        // If no URL is set, open the options page instead.
        chrome.runtime.openOptionsPage();
      }
    });
  }
});

