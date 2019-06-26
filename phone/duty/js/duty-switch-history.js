var vm = new Vue({
   el: '#Page',
   data: {
       
   }
});

(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {});

    appcan.ready(function() {
        
        createPopover();
        appcan.window.publish('duty-switch-back', '1');
        
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
        name: 'duty-switch-history-page',
        url: 'duty-switch-history-page.html',
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight-titleHeight-footerHeight
    });
};
