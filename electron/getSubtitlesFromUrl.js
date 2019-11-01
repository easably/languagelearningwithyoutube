const youtubedl = require("youtube-dl");
const parser = require("subtitles-parser-vtt");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

function getSubtitlesFromUrl(url, langauges = [], webContents) {
    return getVideoInfo(url, langauges, webContents).then(info =>
        fetchSubtitlesFromRequestedSubtitles(
            info.requested_subtitles,
            Object.keys(info.subtitles).length === 0
        )
    );
}

function fetchSubtitlesFromRequestedSubtitles(
    requestedSubtitles,
    automatic = false
) {
    if (!requestedSubtitles) {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }
    let promisesList = [];
    Object.keys(requestedSubtitles).forEach(lang => {
        let prom = new Promise((resolve, reject) => {
            const subtitle = {};
            axios
                .get(requestedSubtitles[lang].url)
                .then(resp => {
                    const subs = parseSubtitle(resp.data, automatic);
                    subtitle[lang] = subs;
                    resolve(subtitle);
                })
                .catch(e => reject(e));
        });
        promisesList.push(prom);
    });
    return Promise.all(promisesList).then(subtitles => {
        return new Promise((resolve, reject) => {
            let newObj = {};
            subtitles.forEach(s => {
                newObj = Object.assign(newObj, s);
            });
            resolve(newObj);
        });
    });
}

function getVideoInfo(url, langauges, webContents) {
    return new Promise((resolve, reject) => {
        const args = [
            "-j",
            // '--skip-download',
            "--write-sub",
            "--write-auto-sub",
            "--sub-lang",
            langauges.join(","),
            "--sub-format",
            "vtt"
        ];
        let customBinaryPath;
        if (process.platform === "win32") {
            customBinaryPath = path.join(__dirname, "bin", "youtube-dl.exe");
        } else {
            customBinaryPath = path.join(__dirname, "bin", "youtube-dl");
        }
        youtubedl.setYtdlBinary(customBinaryPath);
        youtubedl.exec(url, args, {}, (err, output) => {
            if (err) {
                reject(err);
                throw err;
            }
            resolve(JSON.parse(output[0]));
        });
    });
}
function clearTagsFromText(text) {
    return text.replace(/<\/?[^<>]+>/gi, "");
}
function parseSubtitle(data, automatic) {
    let isAutoCaption = undefined;
    if (data.indexOf("<c>") !== -1 && automatic) {
        isAutoCaption = "orig";
    } else if (automatic) {
        isAutoCaption = "translated";
    }
    let subtitles = parser.fromSrt(data, true, isAutoCaption === 'orig');
    if (isAutoCaption === "orig") {
        subtitles.forEach(s => {
            s.text = clearTagsFromText(s.text);
        });
    } else if (isAutoCaption === "translated") {
        subtitles.forEach((s, i, arr) => {
            if (arr[i + 1]) {
                s.endTime = arr[i + 1].startTime;
            }
        });
    }
    return subtitles;
}
module.exports = getSubtitlesFromUrl;
