var platForm = appcan.locStorage.getVal('platForm');
var vm = new Vue({
    el: '#Page',
    data: {
        shade: false
    }
}); 

(function ($) {
    appcan.button("#nav-left", "btn-act", function() {
        closePage();
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function() {
        var titleHeight = parseInt($('#Header').height()),
            // footerHeight = parseInt($('#Footer').height()),
            pageHeight = parseInt($('#Page').height()),
            pageWidth = parseInt($('#Page').width());
            
        $('#ScrollContent').css({
            top: titleHeight+'px',
            height: pageHeight-titleHeight+'px'
        });
        appcan.window.openPopover({
            name: 'duty-problem-report-page',
            url: 'duty-problem-report-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight
        });
        resetPage({'header':'Header','content':'Page','name':'duty-problem-report-page'}); 
        // 阴影toggle
        appcan.window.subscribe('duty-problem-report-shade', function (type) {
            vm.shade = (type != 'hide');
        });
        
        // 关闭页面
        appcan.window.subscribe('duty-problem-report-close', function () {
            appcan.window.close(1);
        });
        
        //监听系统返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                closePage();
            }
        };
        
        //如果是ios设备，设置向右滑动关闭页面
        var paramClose = {
            isSupport: (platForm != '1')
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            closePage();
        };
        
    });
    
    function closePage () {
        //appcan.window.publish('save-duty-four-place-draft');
        appcan.locStorage.remove('duty-problem-index');
        appcan.window.close(1);
    }
    
})($);

