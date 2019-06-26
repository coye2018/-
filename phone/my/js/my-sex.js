(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        var usex = appcan.locStorage.getVal('usersex');
        if(!isDefine(usex))usex = '男'; //测试用, 开发时删去
        
        $('.lists-box').each(function(i, n){
            if(n.dataset.value==usex){
                $(n).find('.lists-item-right').removeClass('hide');
            }
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
    
    //单选
    $('.lists-radio').on('click', '.lists-box', function(){
        var that = $(this),
            hid = 'hide';
        
        that.siblings().find('.lists-item-right').addClass(hid);
        if(isDefine(that.data('value'))){
            that.find('.lists-item-right').removeClass(hid);
        }
        //alert(that.data('value'));
        appcan.locStorage.setVal('usersex', that.data('value'));
        appcan.window.publish('my-sex', that.data('value'));
    });
    
})($);