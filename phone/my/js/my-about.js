(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        var appInfo = uexWidgetOne.getCurrentWidgetInfo();
        $('#thisyear').html(_thisyear);
        $("#version").html("V"+appInfo.version)
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
    });
    
    appcan.button("#list", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-about-list','my-about-list.html',2);
        }else{
            appcan.window.open({
                name:'my-about-list',
                dataType:0,
                data:'my-about-list.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    
})($);