const baseSize = 16

function setRem(){
    let scale = document.documentElement.clientWidth / 750

    document.documentElement.style.fontSize = (baseSize*Math.min(scale,2)) + 'px'
}
setRem()

window.onresize = function(){
    setRem()
}