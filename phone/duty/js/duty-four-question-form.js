var vm = new Vue({
    el: '#Page',
    data: {
        shade: false,
        isCanEdit:false
    }
});

(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        removeStorageData();
    });
    
    appcan.button("#nav-right", "btn-act", function() {
        appcan.window.publish('duty-four-question-form-page-submit');
    });
    
  
    appcan.ready(function() {
        
        createPopover();
        
        vm.isCanEdit=appcan.locStorage.getVal("isCanEdit");
        
        appcan.window.subscribe('duty-four-question-form-close', function (msg) {
            appcan.window.publish('duty-four-question-form', msg);
            removeStorageData();
        });
        appcan.window.subscribe('duty-four-question-form-shade', function (type) {
            vm.shade = (type == 'hide' ? false : true);
        });
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                removeStorageData();
            }
        };
        
        // 如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            removeStorageData();
        };
        
    });
    
})($);

function removeStorageData () {
    appcan.locStorage.remove('mobandaan');
    appcan.window.close(1); 
};

function createPopover () {
    var titleHeight = parseFloat($('#Header').height()),
        footerHeight = parseFloat($('#Footer').height()),
        pageHeight = parseFloat($('#Page').height()),
        pageWidth = parseFloat($('#Page').width());
    
    appcan.window.openPopover({
        name: 'duty-four-question-form-page',
        url: 'duty-four-question-form-page.html',
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight-titleHeight-footerHeight
    });
};
