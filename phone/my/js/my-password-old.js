(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {
        var pw = $('#pswd').val();
        var result = true; //假装是验证旧密码的结果, 测试用
        if($.trim(pw)==''){
            layerToast('密码不能为空。');
            return false;
        }
        if($.trim(pw)!=appcan.locStorage.getVal("upswd")){
            result=false;
        }
        if(result){
            noClick($("#nav-right"));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('my-password-new','my-password-new.html',2);
            }else{
               appcan.window.open({
                    name:'my-password-new',
                    dataType:0,
                    data:'my-password-new.html',
                    aniId:aniId,
                    type:1024
                }); 
            }
            
        }else{
            layerToast('旧密码不正确。');
            return false;
        }
        
    });
    
    appcan.ready(function() {
        appcan.window.publish("my-safety-click","my-safety-click");
        appcan.window.subscribe('my-password-old', function(msg){
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
        appcan.window.subscribe('my-old-click-yes', function(msg){
            yesClick($("#nav-right"));
        });
    });
    
    //密码是否可见
    $('.seepswd').on('click', function(){
        var that = $(this),
            ipt = that.siblings('.lists-item-center').find('.lists-item-ipt'),
            ico = that.find('i'),
            act = 'actives';
        
        if(ipt.attr('type')=='text'){
            ipt.attr('type', 'password');
            ico.removeClass(act);
        }else{
            ipt.attr('type', 'text');
            ico.addClass(act);
        }
    });
})($);