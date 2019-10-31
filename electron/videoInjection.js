function videoInjection() {
    let mutationObserverOnload;
    let configObserver = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    }
    const messageChannel = "videoControlYoutube";
    if (window.injectedListeners) {
        const { video, messaging, observer } = window.injectedListeners;
        video.dom.removeEventListener("timeupdate", video.listener);
        window.ipcRenderer.removeListener(
            messaging.channel,
            messaging.listener
        );
        observer && observer.disconnect();
    }

    let videoDOM = document.querySelector("video");
    if (!videoDOM) {
        mutationObserverOnload = new MutationObserver(function(mutations) {
            videoDOM = document.querySelector("video");
            if (videoDOM) {
                run();
                return this.disconnect();
            }
            this.takeRecords();
        });
        mutationObserverOnload.observe(document,configObserver)
    } else {
        mutationObserverOnload = undefined;
        run();
    }
    function run() {
        videoDOM.addEventListener("timeupdate", timeupdating);
        window.ipcRenderer.on("test", (e, data) => console.log(data));
        window.ipcRenderer.on(messageChannel, handleMessage);
        window.injectedListeners = {
            video: {
                dom: videoDOM,
                listener: timeupdating
            },
            messaging: {
                channel: messageChannel,
                listener: handleMessage
            },
            observer: mutationObserverOnload
        };
    }
    function timeupdating(e) {
        window.ipcRenderer.send("videoControlYoutube", {
            timeupdate: e.target.currentTime * 1000
        });
    }
    function handleMessage(e, data) {
        if (data.pause) {
            videoDOM.pause();
        } else if (data.play) {
            videoDOM.play();
        } else if (data.changeTime) {
            videoDOM.currentTime = +(data.changeTime.time / 1000).toFixed(10);
        }
    }
}
module.exports = videoInjection;
