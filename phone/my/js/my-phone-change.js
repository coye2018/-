(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        appcan.window.publish("my-phone-click","my-phone-click");
        appcan.window.subscribe("my-phone-change-click",function(msg){
            yesClick($("#nextStep"));
        })
        appcan.window.subscribe('my-phone-change', function(msg){
            appcan.window.close(0);
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
        
    });
    
    appcan.button("#nextStep", "btn-act", function() {
        var phone = $('#phone').val(),
            oldphone = appcan.locStorage.getVal('userphone');
        
        //oldphone = '13533421010'; //测试用, 开发要删去
        
        //手机号码验证
        if($.trim(phone)==''){
            layerToast('请输入手机号码。');
            return false;
        }else if(!isPhoneNumber(phone)){
            layerToast('请输入格式正确的手机号码。');
            return false;
        }else if(phone==oldphone){
            layerToast('与当前手机号码一致，无须更换。');
            return false;
        }else{
            noClick($("#nextStep"));
            appcan.locStorage.setVal('thisphone', phone);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('my-phone-yzm','my-phone-yzm.html',2);
            }else{
                appcan.window.open({
                    name:'my-phone-yzm',
                    dataType:0,
                    data:'my-phone-yzm.html',
                    aniId:aniId,
                    type:1024
                });
            }
            
        }
    });
    
})($);