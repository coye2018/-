(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.locStorage.remove('peoplepick');
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {
        var titleHeight = parseInt($('#Header').height()),
            footerHeight = parseInt($('#Footer').height()),
            pageHeight = parseInt($('#Page').height()),
            pageWidth = parseInt($('#Page').width());
        appcan.window.openPopover({
            name: 'notice-send-page',
            url: 'notice-send-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight-footerHeight
        });
        resetPage({'header':'Header','footer':'Footer','content':'Page','name':'notice-send-page'});
        appcan.window.subscribe('notice-send-shade', function(msg){
            var shade = $('.shade'), cls = 'shade-hide';
            msg=='0'?shade.addClass(cls):shade.removeClass(cls);
        });
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                 appcan.locStorage.remove('peoplepick');
                 appcan.window.close(1);
            }
        };
        
        //右滑关闭, 主窗口浮动窗口分别调用
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
            appcan.locStorage.setVal('peoplepick', '');
            appcan.window.close(1);
        };
    });
    
    //点击提交
    appcan.button("#handin", "btn-act", function() {
        appcan.window.publish('notice-send-page', '1');
    });
    
})($);