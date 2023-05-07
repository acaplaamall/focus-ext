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
    let point_count = await readLocalStorage("point-count");
    document.getElementById("points").textContent = point_count;

    if (is_running == 'true') {
        adjustTime(Date.now())
        interval = setInterval(countUp, 1000)
        document.getElementById("start-button").classList.add("hidden")
        document.getElementById("stop-button").classList.remove("hidden")
        document.getElementById("focus").textContent = "You've been focusing for"
    } else if (is_running == 'false') {
        let end_time = await readLocalStorage("end-time");
        adjustTime(end_time)
    }
}
document.getElementById("start-button").addEventListener("click", async () => {
    document.getElementById("start-button").classList.add("hidden")
    document.getElementById("stop-button").classList.remove("hidden")
    document.getElementById("focus").textContent = "You've been focusing for"
    document.getElementById("timer").textContent = "0:00:00"
    clearInterval(interval);
    interval = setInterval(countUp, 1000)
    await chrome.storage.local.set({ "start-time": Date.now() })
    await chrome.storage.local.set({ "is-running": "true" })
    await chrome.runtime.sendMessage({ message: "on" })
});

document.getElementById("stop-button").addEventListener("click", endTimer);

async function endTimer () {
    document.getElementById("start-button").classList.remove("hidden")
    document.getElementById("stop-button").classList.add("hidden")
    document.getElementById("focus").textContent = "You last focused for"
    await chrome.runtime.sendMessage({ message: "off" })
    await chrome.storage.local.set({ "is-running": "false" })
    clearInterval(interval);
    adjustTime(Date.now())
    await chrome.storage.local.set({ "end-time": Date.now() })

    let point_count = await chrome.storage.local.get(["point-count"])
    document.getElementById("points").textContent = point_count["point-count"] + 10;
    await chrome.storage.local.set({ "point-count": point_count["point-count"] + 10 })
}

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
    updateImage(hh, mm, ss)
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

    updateImage(hh, mm, ss)
    document.getElementById("timer").textContent = hh + ":" + mm + ":" + ss
}

var images = ["images/1.png", "images/2.png", "images/3.png", "images/4.png", "images/5.png", "images/6.png", "images/7.png"]
function updateImage (hrs, mins, secs) {
    var image = document.getElementById("image");

    hrs = parseInt(hrs)
    mins = parseInt(mins)
    secs = parseInt(secs)

    if (hrs >= 1) {
        image.src = images[7]
    }
    else if (mins >= 50) {
        image.src = images[6]
    }
    else if (mins >= 40) {
        image.src = images[5]
    }
    else if (mins >= 30) {
        image.src = images[4]
    }
    else if (mins >= 20) {
        image.src = images[3]
    }
    else if (mins >= 10) {
        image.src = images[2]
    }
    else if (mins >= 5) {
        image.src = images[1]
    }
    else {
        image.src = images[0]
    }
}

window.onload = main();


