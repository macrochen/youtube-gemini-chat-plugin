
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openAndSubmit") {
    const videoUrl = request.url;

    // 1. Get the target URL from storage
    chrome.storage.sync.get({ targetUrl: '' }, (items) => {
      const targetUrl = items.targetUrl;
      if (!targetUrl) {
        console.error("Target URL is not set. Please set it in the options page.");
        // Maybe open the options page for the user?
        chrome.runtime.openOptionsPage();
        return;
      }

      // 2. Open a new tab with the target URL
      chrome.tabs.create({ url: targetUrl }, (newTab) => {
        // 3. Use a listener to know when the tab is fully loaded
        const listener = (tabId, changeInfo, tab) => {
          if (tabId === newTab.id && changeInfo.status === 'complete') {
            // 4. Inject the script to fill the form
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              func: fillAndSubmitForm,
              args: [videoUrl]
            });
            // Clean up the listener
            chrome.tabs.onUpdated.removeListener(listener);
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });
    });
  }
  return true; // Indicates that the response is sent asynchronously
});

// This function will be injected into the target page
function fillAndSubmitForm(videoUrl) {
  // Find the rich text editor's editable div element
  const editorDiv = document.querySelector('div.ql-editor[contenteditable="true"]');

  if (!editorDiv) {
    console.error("Could not find the rich text editor input field.");
    alert("Gemini-Plugin: Could not find the specified rich text input field.");
    return;
  }

  // Step 1: Set the text content
  // It's better to set the innerText of the paragraph inside the editor
  const paragraph = editorDiv.querySelector('p');
  if (paragraph) {
    paragraph.innerText = videoUrl;
  } else {
    // Fallback if the structure is different
    editorDiv.innerText = videoUrl;
  }

  // Step 2: Dispatch an 'input' event to let the page's framework (Angular) know
  // that the content has changed. This is crucial for reactive frameworks.
  editorDiv.dispatchEvent(new Event('input', {
    bubbles: true,
    cancelable: true,
  }));
  
  // Step 3: Give the framework a moment to process the input event
  setTimeout(() => {
    // Step 4: Simulate pressing "Enter" in the editor div
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    editorDiv.dispatchEvent(enterEvent);
  }, 100); // A short delay of 100ms is usually enough
}
