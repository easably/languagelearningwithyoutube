function videoInjection() {
    const video = document.querySelector('video');
    video.addEventListener('timeupdate', timeupdating)
    function timeupdating(e){
        window.ipcRenderer.send('videoControlYoutube', {timeupdate:e.target.currentTime*1000})
    }
    window.ipcRenderer.on('videoControlYoutube',handleMessage);
    function handleMessage(e, data){
        if(data.pause){
            video.pause()
        }else if(data.play){
            video.play()
        }else if (data.changeTime){
            video.currentTime = +(data.changeTime.time/1000).toFixed(10)
        }
    }   
}
module.exports = videoInjection;
