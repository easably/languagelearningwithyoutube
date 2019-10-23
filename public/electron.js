const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const BrowserView = electron.BrowserView;
const path = require("path");
const isDev = require("electron-is-dev");
const youtubedl = require("youtube-dl");

require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../", "node_modules", ".bin", "electron")
});

let win;
let youtubeView;
let subtitlesView;
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

    win.on("closed", () => (win = null));
}

function createViews() {
    youtubeView = new BrowserView({
        webPreferences: {
            devTools: isDev
        }
    });
    subtitlesView = new BrowserView({
        webPreferences: {
            devTools: isDev
        }
    });
    win.addBrowserView(youtubeView);
    win.addBrowserView(subtitlesView);
    youtubeView.webContents.loadURL("https://youtube.com");
    subtitlesView.webContents.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    const winSize = win.getSize();
    youtubeView.setBounds({
        x: 0,
        y: 0,
        width: winSize[0] / 2,
        height: winSize[1]
    });
    subtitlesView.setBounds({
        x: winSize[0] / 2,
        y: 0,
        width: winSize[0] / 2,
        height: winSize[1]
    });
    const autoResizeSetting = {
        width: true,
        height: true,
        horizontal: true,
        vertical: true
    };
    youtubeView.setAutoResize(autoResizeSetting);
    subtitlesView.setAutoResize(autoResizeSetting);
    // youtubeView.webContents.openDevTools();
    // subtitlesView.webContents.openDevTools();
}

function addEventsToYoutube() {
    youtubeView.webContents.executeJavaScript('console.log("Hello")');
    youtubeView.webContents.on("dom-ready", e => {
        console.log("dom-ready");
        // var url = "https://www.youtube.com/watch?v=GEQhDeNyM8s&t=68s";
        // var options = {
        //     auto: false,
        //     all: true,
        //     format: "vtt",
        //     cwd: path.join(__dirname, "subtitles")
        // };
        // youtubedl.getSubs(url, options, function(err, files) {
        //     if (err) throw err;

        //     console.log("subtitle files downloaded:", files);
        // });
    });
    youtubeView.webContents.on("did-navigate-in-page", (e, url) => {
        console.log("did-navigate-in-page");
        console.log(e.sender.history, url);
    });
    youtubeView.webContents.on("enter-html-full-screen", _ => {
        console.log("enter-html-full-screen");
    });
    youtubeView.webContents.on("leave-html-full-screen", _ => {
        console.log("leave-html-full-screen");
    });
}
