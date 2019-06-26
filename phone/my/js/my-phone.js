var vm = new Vue({
       el: '#ScrollContent',
       data: {
           phone:''
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
        appcan.window.publish("my-info-click","my-info-click");
        appcan.window.subscribe("my-phone-click",function(msg){
            yesClick($("#btn"));
        })
        appcan.window.subscribe('my-phone', function(msg){
            $('#thisphone').text(hidePhoneNumber(msg));
        });
        var mobilePhone=appcan.locStorage.getVal("mobilePhone");
        vm.phone=hidePhoneNumber(mobilePhone);
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
    
    //跳转到更换手机号页面
    appcan.button("#btn", "btn-act", function() {
        noClick($("#btn"));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-phone-change','my-phone-change.html',2);
        }else{
            appcan.window.open({
                name:'my-phone-change',
                dataType:0,
                data:'my-phone-change.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    
})($);