function quanjuFontsize(){
    var fontdg = window.localStorage.getItem('fontDegree'),
        defaultdg = '1';
    
    if(fontdg == null){
        fontdg = defaultdg;
        window.localStorage.setItem('fontDegree', defaultdg);
    }
    document.getElementById('fsize-set').setAttribute('href', '../css/font-size/fsize-'+fontdg+'.css');
    //console.log('全局字号等级:'+fontdg);
}
quanjuFontsize();