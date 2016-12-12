// Runs after icon click
function iconClicked() {
    chrome.storage.sync.get({
        sameTab: false
    }, function (items) {
        openHive(items.sameTab);
    });
}

// Open Hive page
function openHive(sameTab) {
    HIVE_URL = "http://hive.itcapp.com";
    if (sameTab) {
        chrome.tabs.update({
            "url": HIVE_URL
        });
    } else {
        chrome.tabs.create({
            "url": HIVE_URL
        });
    }
}

// Runs after start
chrome.browserAction.onClicked.addListener(iconClicked);
chrome.storage.sync.get({
        sameTab: false
    }, function (items) {
        title = items.sameTab ? "Open Hive in same tab" : "Open Hive in new tab";
    });
