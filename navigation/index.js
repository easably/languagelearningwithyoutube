document.addEventListener("DOMContentLoaded", ready);

function ready(){
    console.log(window.ipcRenderer)
    let backBtn = document.querySelector('.btn.back');
    let forwardBtn = document.querySelector('.btn.forward');
    let reloadBtn = document.querySelector('.btn.reload');
    let urlInput = document.querySelector('.url');

    let reloadBtnState = 'reloaded';
    backBtn.addEventListener('click',(e)=>{
        window.ipcRenderer.send('navigation',{goBack: true})
    })
    forwardBtn.addEventListener('click',(e)=>{
        window.ipcRenderer.send('navigation',{goForward: true})
    })
    reloadBtn.addEventListener('click',(e)=>{
        if (reloadBtnState === 'reloaded'){
            window.ipcRenderer.send('navigation',{reload: true})
        }else if (reloadBtnState === 'reload'){
            window.ipcRenderer.send('navigation',{stopLoad: true}) 
        }
    })
    urlInput.addEventListener('change',(e)=>{
        window.ipcRenderer.send('navigation',{setURL: e.target.value})
    })
    window.ipcRenderer.on('toNavigation', (e,data)=>{
        console.log(data)
        if (data.didStartLoading){
            reloadBtn.querySelector('img').src='img/stop.svg';
            reloadBtnState = 'reload'
        }else if (data.didStopLoading){
            reloadBtn.querySelector('img').src='img/reload.svg';
            reloadBtnState = 'reloaded'
            
        }else if (data.canGoForward !== undefined){
            if(data.canGoForward === true){
                forwardBtn.classList.remove('noActive')
            }else{
                forwardBtn.classList.add('noActive')
            }
            
        }else if (data.canGoBack !== undefined){
                if(data.canGoBack === true){
                    backBtn.classList.remove('noActive')
                }else{
                    backBtn.classList.add('noActive')
                }
            
        }
    })
}