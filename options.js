// Saves options to chrome.storage.sync.
function save_options(e) {
    e.preventDefault();

    let sameTab = document.getElementById('sameTab').checked;
    let removeToilet = document.getElementById('removeToilet').checked;
    let maxWidth = document.getElementById('maxWidth').value;

    chrome.storage.sync.set({
        sameTab: sameTab,
        removeToilet: removeToilet,
        maxWidth: maxWidth
    }, function () {
        // Update status to let user know options were saved.
        document.getElementById('status').style.opacity = 1;

        title = sameTab ? "Open Hive in same tab" : "Open Hive in new tab";
        chrome.browserAction.setTitle({
            'title': title
        })
        setTimeout(function () {
            window.close();
        }, 1000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default sameTab = false, removeToilet = false
    chrome.storage.sync.get({
        sameTab: false,
        removeToilet: false,
        maxWidth: maxWidth
    }, function (settings) {
        document.getElementById('sameTab').checked = settings.sameTab;
        document.getElementById('removeToilet').checked = settings.removeToilet;
        document.getElementById('maxWidth').value = settings.maxWidth;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('settings').addEventListener('submit', save_options);