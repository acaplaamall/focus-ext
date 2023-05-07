chrome.runtime.onInstalled.addListener(async () => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
    chrome.action.setBadgeBackgroundColor({ color: '#5a703e' })
    await chrome.storage.local.set({ "point-count": 0 })
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.action.setBadgeBackgroundColor({ color: '#5a703e' })
        if (request.message == "on")
            chrome.action.setBadgeText({
                text: "ON ",
            });

        else {
            chrome.action.setBadgeText({
                text: "OFF",
            });
        }

    });


blacklist = ["https://www.google.com/"]
whitelist = []

var running = false;

chrome.tabs.onUpdated.addListener(
    async (tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete") {
            setTimeout(async () => {

                const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
                console.log(activeTab.url)
                let is_running = await chrome.storage.local.get(["is-running"]);
                if (blacklist.includes(activeTab.url) && is_running['is-running'] == "true") {
                    console.log("here!")
                    await chrome.storage.local.set({ "is-running": "false" })
                    await chrome.storage.local.set({ "end-time": Date.now() })
                    chrome.action.setBadgeText({
                        text: "OFF",
                    });

                    chrome.tabs.create({ url: "streak-break.html" });
                }
            }, 200)
        }
    });


chrome.tabs.onActivated.addListener(
    async () => {
        setTimeout(async () => {

            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            console.log(activeTab.url)
            let is_running = await chrome.storage.local.get(["is-running"]);
            if (blacklist.includes(activeTab.url) && is_running['is-running'] == "true") {
                console.log("here!")
                await chrome.storage.local.set({ "is-running": "false" })
                await chrome.storage.local.set({ "end-time": Date.now() })
                chrome.action.setBadgeText({
                    text: "OFF",
                });
                chrome.tabs.create({ url: "streak-break.html" });
            }
        }, 200)
    });


