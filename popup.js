var interval;
if (window.localStorage.getItem("ending-state") != null) {
    document.getElementById("timer").textContent = window.localStorage.getItem("ending-state")
}

document.getElementById("start-button").addEventListener("click", () => {
    document.getElementById("start-button").classList.add("hidden")
    document.getElementById("stop-button").classList.remove("hidden")
    window.localStorage.setItem("start-time", Date.now());
    document.getElementById("timer").textContent = "0:00:00"
    clearInterval(interval);
    interval = setInterval(countUp, 1000)
});

document.getElementById("stop-button").addEventListener("click", () => {
    document.getElementById("start-button").classList.remove("hidden")
    document.getElementById("stop-button").classList.add("hidden")
    clearInterval(interval);
    adjustTime()
    window.localStorage.setItem("ending-state", document.getElementById("timer").textContent);
});

function adjustTime () {
    var time = Date.now() - window.localStorage.getItem("start-time")
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
    var str = (parseInt(arr[2]) + 1).toString();
    if (str.length <= 1) {
        str = '0' + str;
    }
    document.getElementById("timer").textContent = arr[0] + ":" + arr[1] + ":" + str
}



chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    document.getElementById("tabname").textContent = activeTab.url;
});


