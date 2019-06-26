var vm = new Vue({
       el: '#ScrollContent',
       data: {
           uname:''
       }
});
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        vm.uname=appcan.locStorage.getVal("uname");
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
        appcan.window.subscribe("my-safety-click",function(msg){
            yesClick($("#password-change"));
        })
    });
    
    appcan.button("#password-change", "btn-act", function() {
        noClick($("#password-change"));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-password-old','my-password-old.html',2);
        }else{
            appcan.window.open({
                name:'my-password-old',
                dataType:0,
                data:'my-password-old.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    
})($);