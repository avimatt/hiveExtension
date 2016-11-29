// Saves options to chrome.storage.sync.
function save_options() {
    var sameTab = document.getElementById('sameTab').checked;
    chrome.storage.sync.set({
        sameTab: sameTab
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            // status.textContent = '';
            window.close();
        }, 750);
    });
}
sameTab = false;
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default sameTab = false.
    chrome.storage.sync.get({
        sameTab: false
    }, function(items) {
        document.getElementById('sameTab').checked = items.sameTab;
        sameTab = items.sameTab;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);