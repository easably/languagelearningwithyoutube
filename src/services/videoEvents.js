export default {
    setTime: function(time) {
        window.ipcRenderer.send("videoControl", {
            changeTime: {
                time: time
            }
        });
    }
};
