document.addEventListener('DOMContentLoaded', () => {
    const addGemForm = document.getElementById('add-gem-form');
    const gemUrlListContainer = document.getElementById('gem-url-list');
    const status = document.getElementById('status');
    const saveSelectorsBtn = document.getElementById('save-selectors');

    // --- Main function to render the list ---
    const renderUrlList = () => {
        chrome.storage.sync.get({ geminiUrlList: [], activeGeminiUrl: '' }, (data) => {
            gemUrlListContainer.innerHTML = ''; // Clear current list
            const { geminiUrlList, activeGeminiUrl } = data;

            if (geminiUrlList.length === 0) {
                gemUrlListContainer.innerHTML = '<li>No Gems saved yet.</li>';
                return;
            }

            geminiUrlList.forEach(gem => {
                const listItem = document.createElement('li');
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'active-gem';
                radio.value = gem.url;
                radio.checked = (gem.url === activeGeminiUrl);
                radio.addEventListener('change', handleSetActive);

                const nameSpan = document.createElement('span');
                nameSpan.className = 'name';
                nameSpan.textContent = gem.name;

                const urlSpan = document.createElement('span');
                urlSpan.className = 'url';
                urlSpan.textContent = gem.url;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.dataset.id = gem.id;
                deleteBtn.addEventListener('click', handleDelete);

                listItem.appendChild(radio);
                listItem.appendChild(nameSpan);
                listItem.appendChild(deleteBtn);
                listItem.appendChild(urlSpan); // Appending URL span at the end to be on a new line with CSS
                gemUrlListContainer.appendChild(listItem);
            });
        });
    };

    // --- Event Handlers ---
    const handleAdd = (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('gem-name');
        const urlInput = document.getElementById('gem-url');
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (name && url) {
            chrome.storage.sync.get({ geminiUrlList: [] }, (data) => {
                const newList = [...data.geminiUrlList, { id: Date.now(), name, url }];
                chrome.storage.sync.set({ geminiUrlList: newList }, () => {
                    nameInput.value = '';
                    urlInput.value = '';
                    showStatus('Gem saved!');
                    renderUrlList();
                });
            });
        }
    };

    const handleDelete = (e) => {
        const idToDelete = parseInt(e.target.dataset.id, 10);
        chrome.storage.sync.get({ geminiUrlList: [], activeGeminiUrl: '' }, (data) => {
            const newList = data.geminiUrlList.filter(gem => gem.id !== idToDelete);
            const activeWasDeleted = data.activeGeminiUrl && !newList.some(gem => gem.url === data.activeGeminiUrl);
            
            const newState = { geminiUrlList: newList };
            if (activeWasDeleted) {
                newState.activeGeminiUrl = '';
                newState.targetUrl = ''; // Also clear the background script's targetUrl
            }

            chrome.storage.sync.set(newState, () => {
                showStatus('Gem deleted.');
                renderUrlList();
            });
        });
    };

    const handleSetActive = (e) => {
        const newActiveUrl = e.target.value;
        // The key for the background script is `targetUrl`
        chrome.storage.sync.set({ activeGeminiUrl: newActiveUrl, targetUrl: newActiveUrl }, () => {
            showStatus('Active Gem updated!');
            // No need to re-render, radio button state is already updated by the browser
        });
    };

    const showStatus = (message) => {
        status.textContent = message;
        setTimeout(() => { status.textContent = ''; }, 2000);
    };

    // --- Selector Management (from old logic) ---
    const DEFAULT_SELECTORS = {
        searchResultItem: 'ytd-video-renderer',
        searchResultTitle: 'yt-formatted-string.ytd-video-renderer',
        searchResultLink: 'a#video-title',
        otherVideoItems: 'ytd-rich-item-renderer, yt-lockup-view-model, ytd-compact-video-renderer, ytd-grid-video-renderer',
        thumbnailTarget: 'a.yt-lockup-view-model__content-image',
        thumbnailLink: 'a#thumbnail, a.yt-lockup-view-model__content-image'
    };

    function save_selectors() {
        const selectors = {
            searchResultItem: document.getElementById('searchResultItem').value,
            searchResultTitle: document.getElementById('searchResultTitle').value,
            searchResultLink: document.getElementById('searchResultLink').value,
            otherVideoItems: document.getElementById('otherVideoItems').value,
            thumbnailTarget: document.getElementById('thumbnailTarget').value,
            thumbnailLink: document.getElementById('thumbnailLink').value,
        };
        chrome.storage.sync.set({ selectors: selectors }, () => showStatus('Selectors saved.'));
    }

    function restore_selectors() {
        chrome.storage.sync.get({ selectors: DEFAULT_SELECTORS }, (items) => {
            document.getElementById('searchResultItem').value = items.selectors.searchResultItem;
            document.getElementById('searchResultTitle').value = items.selectors.searchResultTitle;
            document.getElementById('searchResultLink').value = items.selectors.searchResultLink;
            document.getElementById('otherVideoItems').value = items.selectors.otherVideoItems;
            document.getElementById('thumbnailTarget').value = items.selectors.thumbnailTarget;
            document.getElementById('thumbnailLink').value = items.selectors.thumbnailLink;
        });
    }

    // --- Initial Setup ---
    addGemForm.addEventListener('submit', handleAdd);
    saveSelectorsBtn.addEventListener('click', save_selectors);
    renderUrlList();
    restore_selectors();
});
