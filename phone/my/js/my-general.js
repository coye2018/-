(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
        // uexWindow.close({
            // animID: -1,
        // });
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        setFontsizeText();
        //字号有调整, 相应显示文字也需转变
        appcan.window.subscribe('fontsize', function(msg){
            setFontsizeText();
        });
        var platFormC=appcan.locStorage.getVal("platForm");
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
             appcan.window.close(-1); 
        }
        appcan.window.publish("my-yes-click","my-yes-click");
        appcan.window.subscribe('my-general-click', function(msg){
            yesClick($("#fsize"));
            yesClick($("#bg"));
        });
    });
    
    //字体大小
    appcan.button('#fsize', 'btn-act', function(){
        noClick($("#fsize"));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-general-fsize','my-general-fsize.html',2);
        }else{
            appcan.window.open({
                name:'my-general-fsize',
                dataType:0,
                data:'my-general-fsize.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    //聊天背景
    appcan.button('#bg', 'btn-act', function(){
        noClick($("#bg"));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-general-bg','my-general-bg.html',2);
        }else{
            appcan.window.open({
                name:'my-general-bg',
                dataType:0,
                data:'my-general-bg.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    
    //胶囊按钮
    $('.btn-pill').on('click', function(e){
        var that = $(this),
            thatpar = that.parents('.lists-box'),
            dataname = 'value';
            on = 'on';
        
        if(Number(thatpar.data(dataname))){
            that.removeClass(on);
            thatpar.data(dataname, 0);
        }else{
            that.addClass(on);
            thatpar.data(dataname, 1);
        }
        
    });
    
})($);

function setFontsizeText(){
    var fd = window.localStorage.getItem('fontDegree'),
        tx = ['标准', '中', '大'];
    
    if(!isDefine(fd)) fd=1;
    $('#fsize-text').text(tx[Number(fd-1)]);
}
