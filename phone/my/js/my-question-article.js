(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
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
    });
    
})($);
