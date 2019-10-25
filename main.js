const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const BrowserView = electron.BrowserView;
const ipcMain = electron.ipcMain;
const path = require("path");
const isDev = require("electron-is-dev");
const getSubtitlesFromUrl = require("./electron/getSubtitlesFromUrl");
const videoInjection=require('./electron/videoInjection')

if (isDev) {
    require("electron-reload")(__dirname, {
        electron: path.join(__dirname, "./", "node_modules", ".bin", "electron")
    });
}

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

    win.on("closed", () => (win = null));
}

function createViews() {
    youtubeView = new BrowserView({
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
    win.addBrowserView(subtitlesView);
    youtubeView.webContents.loadURL("https://www.youtube.com");
    subtitlesView.webContents.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "./build/index.html")}`
    );
    const winSize = win.getContentBounds();
    youtubeView.setBounds({
        x: 0,
        y: 0,
        width: (winSize.width * 2) / 4,
        height: winSize.height
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
    youtubeView.setAutoResize(autoResizeSetting);
    subtitlesView.setAutoResize(autoResizeSetting);
    // youtubeView.webContents.openDevTools();
    // subtitlesView.webContents.openDevTools();
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
    youtubeView.webContents.on("enter-html-full-screen", _ => {
        console.log("enter-html-full-screen");
    });
    youtubeView.webContents.on("leave-html-full-screen", _ => {
        console.log("leave-html-full-screen");
    });
}

function didNavigate(url) {
    subtitlesView.webContents.send("changePage");
    if (url.indexOf("?v=") !== -1) {
        youtubeView.webContents.executeJavaScript('('+videoInjection.toString()+')()');
        getSubtitlesFromUrl(url, ["ru", "en"]).then(s => {
            subtitlesView.webContents.send("subtitles", {
                list: s
            });
        }).catch(e=>{
            subtitlesView.webContents.send("subtitles", {
                error: e
            });
        });
    } else {
        subtitlesView.webContents.send("subtitles",{
            no: true
        });
    }
}

function addResendingEvents(){
    ipcMain.on('videoControlYoutube',(e,data)=>{
        subtitlesView.webContents.send('videoControl',data)
    })
    
    ipcMain.on('videoControl',(e,data)=>{
        youtubeView.webContents.send('videoControlYoutube',data)
    })
}