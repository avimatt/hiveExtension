function main() {
    chrome.storage.sync.get({
        sameTab: false
    }, function (items) {
        openHive(items.sameTab);
    });
}

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

chrome.browserAction.onClicked.addListener(main);
chrome.storage.sync.get({
        sameTab: false
    }, function (items) {
        title = items.sameTab ? "Open Hive in same tab" : "Open Hive in new tab";
    });
