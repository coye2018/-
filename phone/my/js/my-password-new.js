(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {
        var pw_1 = $('#pswd_1').val(),
            pw_2 = $('#pswd_2').val();
        
        if($.trim(pw_1)=='' || $.trim(pw_2)==''){
            layerToast('密码不能为空。');
            return false;
        }
        if(!isPassworkOK(pw_1) || !isPassworkOK(pw_2)){
            layerToast('密码不符合规范。');
            return false;
        }
        var password=appcan.locStorage.getVal("upswd");
        if(pw_1 == pw_2 && pw_1!=password){
            var json={
                path:serverPath+'focUserController.do?focupdatePassword',
                data:{
                    oldPass:appcan.locStorage.getVal("upswd"),
                    newPass:pw_1,
                }
            };
             ajaxRequest(json,function(data,e){
                 if(e=="success"){
                     layerToast('密码修改成功。');
                    uexEasemob.logout(function(data){});
                    appcan.locStorage.remove("upswd");
                    appcan.locStorage.remove("token");
                    var platForm=appcan.locStorage.getVal("platForm");
                    if(platForm=="1"){
                        uexJPush.stopPush();
                    }
                    appcan.locStorage.setVal("isLogin","false");
                    //重置打开index页面的第一tab
                    //appcan.window.publish("reseat","reseat");
                    appcan.window.publish("closeMyPasswordNew","closeMyPasswordNew");
                     
                     
                    
                 }
                 
             })
        }if(pw_1 != pw_2){
            layerToast('两次输入的密码不一致。');
            return false;
        }if(pw_1 == pw_2 && pw_1==password){
            layerToast('新密码与旧密码一致，请重新设置！');
            return false;
        }
    });
    
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
        appcan.window.publish("my-old-click-yes","my-old-click-yes");
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