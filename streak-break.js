async function adjustPoints () {
    let point_count = await chrome.storage.local.get(["point-count"])
    await chrome.storage.local.set({ "point-count": point_count["point-count"] - 10 })
}

window.onload = adjustPoints();
