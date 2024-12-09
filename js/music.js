!function () {
    var curAudio = document.querySelector(".shell input:checked+audio");
    function getCurAudioID() {
        const inputGroup = document.querySelectorAll(".shell audio");
        for (let i = 0; i < inputGroup.length; i++)
            if (curAudio == inputGroup[i]) return i;
        return 0;
    }
    function getPlayerTimeEl() {
        return document.querySelector(".player #song-info-" + (getCurAudioID() + 1) + " .time");
    }
    const ctrlEl = document.querySelector("#player-control");
    const progressEl = document.querySelector("#progress");
    var playerTimeEl = getPlayerTimeEl();
    const updateTimeInfo = function () {
        const curTime = curAudio.currentTime;
        const fullTime = curAudio.duration;
        const curMin = String(parseInt(curTime / 60)).padStart(2, "0");
        const curSec = String(parseInt(curTime % 60)).padStart(2, "0");
        const fullMin = String(parseInt(fullTime / 60)).padStart(2, "0");
        const fullSec = String(parseInt(fullTime % 60)).padStart(2, "0");
        playerTimeEl.innerHTML = `${curMin}:${curSec} / ${fullMin}:${fullSec}`;
        progressEl.style.width = `${curTime * 100 / fullTime}%`;
    }
    updateTimeInfo();
    const tooglePlay = function (e, isPlay) {
        if (isPlay === true || (isPlay !== false && curAudio.paused)) {
            ctrlEl.classList.add("playing");
            curAudio.play();
        } else {
            ctrlEl.classList.remove("playing");
            curAudio.pause();
        }
    }
    ctrlEl.addEventListener("click", tooglePlay);
    document.querySelectorAll("input[name='music']").forEach(e => {
        e.addEventListener("click", function () {
            const lastStatus = !curAudio.paused;
            curAudio.pause();
            curAudio = document.querySelector(".shell input:checked+audio");
            playerTimeEl = getPlayerTimeEl();
            tooglePlay(undefined, lastStatus);
        })
    })
    const progressBarEl = document.querySelector(".progress-bar");
    const dragAudioProgress = function (e, target) {
        const expected = e.clientX - target.getBoundingClientRect().x;
        const width = parseFloat(getComputedStyle(target).width);
        curAudio.currentTime = curAudio.duration * expected / width;
        updateTimeInfo();
    }
    var onMouseDown = false;
    progressBarEl.addEventListener("mousedown", function (e) {
        onMouseDown = true;
        dragAudioProgress(e, e.target);
    });
    window.addEventListener("mousemove", function (e) {
        if (onMouseDown) dragAudioProgress(e, progressBarEl);
    });
    window.addEventListener("mouseup", function (e) {
        onMouseDown = false
    });
    setInterval(updateTimeInfo, 100);
}()