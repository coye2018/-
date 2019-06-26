var vm = new Vue({
    el: '#Page'
});

(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {
        appcan.window.publish('duty-four-special-save');
    });
    
    appcan.ready(function() {
        
        createPopover();
        
        appcan.window.subscribe('duty-four-special-page-close', function (msg){
            appcan.window.publish('duty-four-special', msg);
            appcan.window.close(1);
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
    });
    
})($);


function createPopover () {
    var titleHeight = parseFloat($('#Header').height()),
        footerHeight = parseFloat($('#Footer').height()),
        pageHeight = parseFloat($('#Page').height()),
        pageWidth = parseFloat($('#Page').width());
    
    appcan.window.openPopover({
        name: 'duty-four-special-page',
        url: 'duty-four-special-page.html',
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight-titleHeight-footerHeight
    });
};

