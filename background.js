chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchLyrics') {
        fetch(request.url)
            .then(response => response.text())
            .then(html => sendResponse({ success: true, html }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;  // Keep the message channel open for async response
    }
});
