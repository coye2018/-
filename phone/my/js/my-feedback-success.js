(function($) {
    var closeArr = ['my-feedback-form', 'my-feedback-success'];
    function closeMultiPages(arr){
        for(var i=0; i<arr.length; i++){
                    appcan.window.evaluateScript({
                        name: arr[i],
                        scriptContent: 'appcan.window.close(1);'
                    });
                }
        
    }
    
    appcan.button("#nav-left", "btn-act",
    function() {
        $('#close').triggerHandler('click');
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
            $('#close').triggerHandler('click');
        }
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                 $('#close').triggerHandler('click');
            }
        };
    });
    
    $('#close').on('click', function(){
        closeMultiPages(closeArr);
    });
})($);