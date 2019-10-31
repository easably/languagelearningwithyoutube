const youtubedl = require("youtube-dl");
const parser = require("subtitles-parser-vtt");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

function getSubtitlesFromUrl(url, langauges = [], webContents) {
    return getVideoInfo(url, langauges, webContents).then(info =>
        fetchSubtitlesFromRequestedSubtitles(info.requested_subtitles)
    );
}

function fetchSubtitlesFromRequestedSubtitles(requestedSubtitles) {
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
                    const subs = parseSubtitle(resp.data);
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
            // '-v',
            "-j",
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
        youtubedl.exec(
            url,
            args,
            {},
            (err, output) => {
                if (err) {
                    reject(err);
                    throw err;
                }
                resolve(JSON.parse(output[0]));
            },
            webContents
        );
    });
}
function clearTagsFromText(text) {
    return text.replace(/<\/?[^<>]+>/gi, "");
}
function parseSubtitle(data) {
    let isAutoCaption = false;
    if (data.indexOf('<c>') !== -1){
        isAutoCaption = true;
    }
    let subtitles = parser.fromSrt(data);
    console.log(subtitles)
    subtitles = subtitles.map(s => {
        if (s.startTime.search(/\d\d:\d\d:\d\d/) !== -1) {
            s.startTime = timeToMs(s.startTime);
        }
        if (s.endTime.search(/\d\d:\d\d:\d\d/) !== -1) {
            s.endTime = timeToMs(s.endTime);
        }
        if (isAutoCaption){

            if(s.text.indexOf('<c>') !== -1){
                // s.text = clearTagsFromText(s.text)
                return s;
            }else{
                return s
            }
        }else{
            return s
        }
    }).filter(e=>e);
    console.log(subtitles)
    return subtitles;
}
function timeToMs(t) {
    let timeArr = t.split(":");
    return (
        Number(timeArr[0]) * 60 * 60 * 1000 +
        Number(timeArr[1]) * 60 * 1000 +
        Number(timeArr[2]) * 1000
    );
}
module.exports = getSubtitlesFromUrl;
