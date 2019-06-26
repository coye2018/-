(function($) {
    appcan.ready(function() {
        $('#username').val(appcan.locStorage.getVal("uname"));
        appcan.window.subscribe('login-input', function(msg){
            var uname = $('#username'),
                upswd = $('#password');
            
            var ujson = {
                'uname': $.trim(uname.val()),
                'upswd': upswd.val()
            };
            
            appcan.window.publish('login-input-json', JSON.stringify(ujson));
        });
        
        var bd = $('body'), cls = 'login-input-opacity';
        appcan.window.subscribe('login-opacity', function(msg){
            if(msg=='1'){
                bd.addClass(cls);
            }else{
                bd.removeClass(cls);
            }
        });
    });
        
    //密码是否可见
    $('.seepswd').on('click', function(){
        var that = $(this),
            ipt = that.siblings('.input-oneline-ctr').find('.input-oneline-ipt'),
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