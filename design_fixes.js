chrome.storage.sync.get({
    removeToilet: false,
    maxWidth: null
}, function (settings) {
    // Remove toilet button (if opt-in) 
    if (settings.removeToilet) {
        document.querySelector("#quick_toilet_request").style.display = "none";
    }
    // Set main block maximum width (if set up) 
    if (settings.maxWidth) {
        document.querySelector("#main").style.maxWidth = settings.maxWidth + "px";
    }
});