(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        $('#verifyTime').triggerHandler('click');
        appcan.window.publish("my-phone-change-click","my-phone-change-click");
    });
    
    appcan.button("#handin", "btn-act", function() {
        var vfyThis = $('#verify').val();
        var vfyGet = '1'; //验证码, 这个是测试用, 开发要改
        
        if(vfyThis==vfyGet){
            var index = layerLoading();
            //此处ajax提交新手机号到后台的代码, setTimeout模拟ajax效果
            setTimeout(function(){
                layerRemove(index);
                addAlert({
                    content: '更改成功！',
                    yes: function(i){
                        appcan.window.publish('my-phone', appcan.locStorage.getVal('thisphone'));
                        appcan.window.publish('my-phone-change', '0'); //关闭前一个页面
                        appcan.window.close(0);
                        layerRemove(i);
                    }
                });
            }, 1000);
            
        }else{
            layerToast('验证码错误，请重新输入或重新获取。');
            return false;
        }
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
    
    var countdown = 60, cdflag = true;
    $('#verifyTime').on('click', function(){
        if(!cdflag) return;
        $(this)[0].setVerifyTime();
    });
    //验证码函数
    Object.prototype.setVerifyTime = function(){
        var obj = this;
        var txt = obj.getElementsByTagName('span')[0];
        txt = typeof txt == 'undefined' ? obj : txt;
        
        if(countdown == 0){
            cdflag = true;
            txt.innerText = "获取验证码"; 
            countdown = 60;
            return;
        }else{
            cdflag = false;
            txt.innerText = "重新发送(" + countdown + ")";
            countdown--;
        }
        
        setTimeout(function(){
            obj.setVerifyTime();
        },1000);
    };
    
})($);