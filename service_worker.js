
var screenshotImage = ""
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log("Background Listener")
    if (request.type == "screenshot") {
        var url = chrome.runtime.getURL("index.html");
        screenshotImage = await chrome.tabs.captureVisibleTab();
        var tab = chrome.tabs.create({ url: url });
        sendResponse({ success: true });
    }
    if (request.type == "requestScreenshot") {
        sendResponse({ screenshotImage: screenshotImage });
    }
});