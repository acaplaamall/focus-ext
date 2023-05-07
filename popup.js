var interval;

const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function (result) {
            if (result[key] === undefined) {
                reject();
            } else {
                resolve(result[key]);
            }
        });
    });
};


async function main () {
    let is_running = await readLocalStorage("is-running");
    console.log(is_running);
    if (is_running == 'true') {
        adjustTime(Date.now())
        interval = setInterval(countUp, 1000)
        document.getElementById("start-button").classList.add("hidden")
        document.getElementById("stop-button").classList.remove("hidden")
    } else if (is_running == 'false') {
        let end_time = await readLocalStorage("end-time");
        adjustTime(end_time)
    }
}
document.getElementById("start-button").addEventListener("click", async () => {
    document.getElementById("start-button").classList.add("hidden")
    document.getElementById("stop-button").classList.remove("hidden")
    document.getElementById("timer").textContent = "0:00:00"
    clearInterval(interval);
    await chrome.storage.local.set({ "start-time": Date.now() })
    await chrome.storage.local.set({ "is-running": "true" })
    interval = setInterval(countUp, 1000)
});

document.getElementById("stop-button").addEventListener("click", endTimer);

async function endTimer () {
    document.getElementById("start-button").classList.remove("hidden")
    document.getElementById("stop-button").classList.add("hidden")
    await chrome.storage.local.set({ "is-running": "false" })
    clearInterval(interval);
    adjustTime(Date.now())
    await chrome.storage.local.set({ "end-time": Date.now() })
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg === "streak-broken") {
            endTimer();
        }
    }
);

async function adjustTime (date) {
    var start_time = await readLocalStorage("start-time")
    var time = date - start_time
    var msec = time;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    mm = mm.toString()
    if (mm.length <= 1) {
        mm = '0' + mm;
    }
    var ss = Math.floor(msec / 1000);
    ss = ss.toString()
    if (ss.length <= 1) {
        ss = '0' + ss;
    }
    document.getElementById("timer").textContent = hh + ':' + mm + ":" + ss
}

function countUp () {
    var text = document.getElementById("timer").textContent;
    var arr = text.split(":")
    var hh = parseInt(arr[0])
    var mm = parseInt(arr[1])
    var ss = (parseInt(arr[2]) + 1)
    if (ss == 60) {
        ss = 0;
        mm += 1;
    }
    if (mm == 60) {
        mm = 0;
        hh += 1;
    }
    hh = hh.toString();
    mm = mm.toString();
    ss = ss.toString();

    if (ss.length <= 1) {
        ss = '0' + ss;
    }
    if (mm.length <= 1) {
        mm = '0' + mm;
    }

    document.getElementById("timer").textContent = hh + ":" + mm + ":" + ss
}

window.onload = main();


