const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const BrowserView = electron.BrowserView;
const ipcMain = electron.ipcMain;
const path = require("path");
const isDev = require("electron-is-dev");
const getSubtitlesFromUrl = require("./electron/getSubtitlesFromUrl");
const videoInjection = require("./electron/videoInjection");

if (isDev) {
    require("electron-reload")(__dirname, {
        electron: path.join(__dirname, "./", "node_modules", ".bin", "electron")
    });
}

let win;
let youtubeView;
let navigationView;
let subtitlesView;
let pageId;
let navHeight = 40;
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});

addResendingEvents();

function createWindow() {
    const point = electron.screen.getCursorScreenPoint();
    const curArea = electron.screen.getDisplayNearestPoint(point).workArea;
    win = new BrowserWindow({
        x: curArea.x,
        y: curArea.y,
        width: isDev ? curArea.width / 2 : curArea.width,
        height: curArea.height,
        minHeight: 400,
        minWidth: 600,
        show: false,
        webPreferences: {
            devTools: false
        }
    });
    if (isDev) {
        win.showInactive();
    } else {
        win.show();
        win.maximize();
    }

    createViews();
    addEventsToYoutube();
    addNavigationEvents();

    win.on("closed", () => (win = null));
}

function createViews() {
    youtubeView = new BrowserView({
        webPreferences: {
            devTools: isDev,
            preload: __dirname + "/electron/preload.js"
        }
    });
    navigationView = new BrowserView({
        webPreferences: {
            devTools: isDev,
            preload: __dirname + "/electron/preload.js"
        }
    });
    subtitlesView = new BrowserView({
        webPreferences: {
            devTools: isDev,
            preload: __dirname + "/electron/preload.js"
        }
    });
    win.addBrowserView(youtubeView);
    win.addBrowserView(navigationView);
    win.addBrowserView(subtitlesView);
    youtubeView.webContents.loadURL("https://www.youtube.com");
    navigationView.webContents.loadURL(
        isDev
            ? "http://localhost:3001"
            : `file://${path.join(__dirname, "./build/navigation/index.html")}`
    );
    subtitlesView.webContents.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "./build/app/index.html")}`
    );
    const winSize = win.getContentBounds();
    youtubeView.setBounds({
        x: 0,
        y: navHeight,
        width: (winSize.width * 2) / 4,
        height: winSize.height - navHeight
    });
    navigationView.setBounds({
        x: 0,
        y: 0,
        width: (winSize.width * 2) / 4,
        height: navHeight
    });
    subtitlesView.setBounds({
        x: (winSize.width * 2) / 4,
        y: 0,
        width: (winSize.width * 2) / 4,
        height: winSize.height
    });
    const autoResizeSetting = {
        width: true,
        height: true,
        horizontal: true,
        vertical: true
    };
    youtubeView.setAutoResize({ ...autoResizeSetting, vertical: false });
    navigationView.setAutoResize({
        ...autoResizeSetting,
        vertical: false,
        height: false
    });
    subtitlesView.setAutoResize(autoResizeSetting);
    // youtubeView.webContents.openDevTools();
    // navigationView.webContents.openDevTools();
    subtitlesView.webContents.openDevTools();
}

function addEventsToYoutube() {
    let currentUrl = "";
    youtubeView.webContents.on("dom-ready", e => {
        const history = e.sender.history;
        const url = history[history.length - 1];
        didNavigate(url);
    });
    youtubeView.webContents.on("did-navigate-in-page", (e, url) => {
        if (url !== currentUrl) {
            didNavigate(url);
            currentUrl = url;
        }
    });
    youtubeView.webContents.on("did-start-loading", () => {
        navigationView.webContents.send("toNavigation", {
            didStartLoading: true
        });
    });
    youtubeView.webContents.on("did-stop-loading", () => {
        navigationView.webContents.send("toNavigation", {
            didStopLoading: true
        });
    });
    youtubeView.webContents.on("enter-html-full-screen", _ => {
        hideNavigation(true);
    });
    youtubeView.webContents.on("leave-html-full-screen", _ => {
        hideNavigation(false);
    });
}

function didNavigate(url) {
    pageId = `f${(+new Date()).toString(16)}`;
    let curPageId = pageId;

    navigationView.webContents.send("toNavigation", {
        canGoForward: youtubeView.webContents.canGoForward()
    });
    navigationView.webContents.send("toNavigation", {
        canGoBack: youtubeView.webContents.canGoBack()
    });
    navigationView.webContents.send("toNavigation", {
        changeURL: url
    });
    subtitlesView.webContents.send("changePage");
    if (url.indexOf("?v=") !== -1) {
        youtubeView.webContents.executeJavaScript(
            "(" + videoInjection.toString() + ")()"
        );
        getSubtitlesFromUrl(url, ["ru", "en"])
            .then(s => {
                if (curPageId === pageId) {
                    subtitlesView.webContents.send("subtitles", {
                        list: s
                    });
                }
            })
            .catch(e => {
                if (curPageId === pageId) {
                    subtitlesView.webContents.send("subtitles", {
                        error: e
                    });
                }
            });
    } else {
        subtitlesView.webContents.send("subtitles", {
            no: true
        });
    }
}

function addResendingEvents() {
    ipcMain.on("videoEventsYoutube", (e, data) => {
        subtitlesView.webContents.send("videoEvents", data);
    });

    ipcMain.on("videoAction", (e, data) => {
        youtubeView.webContents.send("videoActionYoutube", data);
    });
}

function addNavigationEvents() {
    ipcMain.on("navigation", (e, data) => {
        if (data.goBack) {
            youtubeView.webContents.goBack();
        } else if (data.goForward) {
            youtubeView.webContents.goForward();
        } else if (data.reload) {
            youtubeView.webContents.reload();
        } else if (data.stopLoad) {
            youtubeView.webContents.stop();
        } else if (data.setURL) {
            youtubeView.webContents.loadURL(data.setURL);
        }
    });
}
function hideNavigation(hide = true) {
    const winSize = win.getContentBounds();
    if (hide) {
        navigationView.setBounds({
            x: 0,
            y: 0,
            width: (winSize.width * 2) / 4,
            height: 0
        });
        youtubeView.setBounds({
            x: 0,
            y: 0,
            width: (winSize.width * 2) / 4,
            height: winSize.height
        });
    } else {
        navigationView.setBounds({
            x: 0,
            y: 0,
            width: (winSize.width * 2) / 4,
            height: navHeight
        });
        youtubeView.setBounds({
            x: 0,
            y: navHeight,
            width: (winSize.width * 2) / 4,
            height: winSize.height - navHeight
        });
    }
}
