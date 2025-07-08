
// Saves options to chrome.storage
const saveOptions = () => {
  const targetUrl = document.getElementById('target-url').value;
  chrome.storage.sync.set(
    { targetUrl: targetUrl },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 1500);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { targetUrl: '' },
    (items) => {
      document.getElementById('target-url').value = items.targetUrl;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
