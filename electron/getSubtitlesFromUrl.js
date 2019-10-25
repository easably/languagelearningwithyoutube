const youtubedl = require("youtube-dl");
const fs = require("fs");
const electron = require("electron");
const app = electron.app;
const path = require("path");
const parser = require("subtitles-parser-vtt");

function getSubtitlesFromUrl(url, langauges = []) {
    return new Promise((resolve, reject) => {
        const tempFolder = path.join(app.getPath("temp"), app.getName());
        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder);
        }
        dowloandSubtitlesFromUrl(url, tempFolder, langauges)
            .then(files => {
                let promisesList = [];
                files.forEach(f => {
                    let prom = new Promise((resolve, reject) => {
                        let subtitle = {};
                        const arrFileName = f.split(".");
                        const lang = arrFileName[arrFileName.length - 2];
                        fs.readFile(
                            path.join(tempFolder, f),
                            "utf8",
                            (err, data) => {
                                if (err) reject(err);
                                subtitle[lang] = parseSubtitle(data);
                                fs.unlink(path.join(tempFolder, f), err => {
                                    reject(err);
                                });
                                resolve(subtitle);
                            }
                        );
                    });
                    promisesList.push(prom);
                });
                Promise.all(promisesList).then(subtitles => {
                    let newObj = {};
                    subtitles.forEach(s => {
                        newObj = Object.assign(newObj, s);
                    });
                    resolve(newObj);
                });
            })
            .catch(e => reject(e));
    });
}

function dowloandSubtitlesFromUrl(url, folder, langauges) {
    return new Promise((resolve, reject) => {
        const options = {
            auto: true,
            all: false,
            lang: langauges.join(","),
            format: "ttf",
            cwd: folder
        };
        youtubedl.getSubs(url, options, (err, files) => {
            if (err) reject();
            resolve(files);
        });
    });
}
function clearTagsFromText(text){
    return text.replace(/<\/?[^<>]+>/gi, '')
}
function parseSubtitle(data){
    let subtitles = clearTagsFromText(data)
    subtitles = parser.fromSrt(subtitles);
    subtitles.forEach(s=>{
        if( s.startTime.search(/\d\d:\d\d:\d\d/) !== -1){
            s.startTime = timeToMs(s.startTime)
        }
        if( s.endTime.search(/\d\d:\d\d:\d\d/) !== -1){
            s.endTime = timeToMs(s.endTime)
        }
    })
    return subtitles;
}
function timeToMs(t){
    let timeArr = t.split(':')
    return Number(timeArr[0]) * 60 * 60 * 1000 + Number(timeArr[1]) * 60 * 1000 + Number(timeArr[2])*1000;
}
module.exports = getSubtitlesFromUrl;
