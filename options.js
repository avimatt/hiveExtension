// Saves options to chrome.storage.sync.
function save_options() {
    var sameTab = document.getElementById('sameTab').checked;
    chrome.storage.sync.set({
        sameTab: sameTab
    }, function() {
        // Update status to let user know options were saved.
        document.getElementById('status').textContent = 'Options saved.';
        title = sameTab ? "Open Hive in same tab" : "Open Hive in new tab";
        chrome.browserAction.setTitle({
            'title': title
        })
        setTimeout(function() {
            window.close();
        }, 1000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default sameTab = false.
    chrome.storage.sync.get({
        sameTab: false
    }, function(items) {
        document.getElementById('sameTab').checked = items.sameTab;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
