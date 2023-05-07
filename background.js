chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

blacklist = ["https://www.google.com/"]
whitelist = []

var running = false;

chrome.tabs.onUpdated.addListener(
    async () => {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log(activeTab.url + " updated")
    }
)


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
                chrome.tabs.create({ url: "background.html" });
            }
        }, 200)
    });


/*chrome.action.onClicked.addListener(async (tab) => {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });
});*/
