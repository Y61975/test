let plusReady = (callback)=>{
    if(window.plus){
        callback();
    }else{
        document.addEventListener("plusready",callback)
    }
}

export default plusReady;