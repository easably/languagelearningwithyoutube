export default {
    send: {
        stopReload: () => {
            window.ipcRenderer &&
                window.ipcRenderer.send("navigation", {
                    stopReload: true
                });
        },
        reload: () => {
            window.ipcRenderer &&
                window.ipcRenderer.send("navigation", {
                    reload: true
                });
        },
        goBack: () => {
            window.ipcRenderer &&
                window.ipcRenderer.send("navigation", {
                    goBack: true
                });
        },
        goForward: () => {
            window.ipcRenderer &&
                window.ipcRenderer.send("navigation", {
                    goForward: true
                });
        },
        setURL: url => {
            window.ipcRenderer &&
                window.ipcRenderer.send("navigation", {
                    setURL: url
                });
        }
    },
    on: (ev, cb) => {
        if (!listenerSetted) {
            listenerSetted = true;
            setListener();
        }
        listeners[ev] = cb;
    },
    removeListeners() {
        window.ipcRenderer &&
            window.ipcRenderer.removeListener("toNavigation", toNavigation);
    }
};

let listenerSetted = false;
let listeners = {
    didStartLoading: undefined,
    didStopLoading: undefined,
    canGoForward: undefined,
    canGoBack: undefined,
    changeURL: undefined
};
function toNavigation(e, data) {
    const ev = Object.keys(data)[0]
    listeners[ev] && listeners[ev](data[ev]);
}
function setListener() {
    window.ipcRenderer && window.ipcRenderer.on("toNavigation", toNavigation);
}
