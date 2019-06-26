var vm = new Vue({
    el: '#Page',
    data: {
        shade: false
    }
}); 

(function ($) {
    appcan.button("#nav-left", "btn-act", function() {
        delectMsgCache();
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
            name: 'duty-four-3-special-page',
            url: 'duty-four-3-special-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight
        });         
        resetPage({'header':'Header','content':'Page','name':'duty-four-3-special-page'});
        // 阴影toggle
        appcan.window.subscribe('duty-four-3-special-shade', function (type) {
            vm.shade = (type != 'hide');
        });
        
        // 关闭页面
        appcan.window.subscribe('duty-four-3-special-close', function () {
            appcan.window.close(13);
        });
        appcan.window.subscribe('cs',function(){
            alert(1)
        })
        //如果是ios设备，设置向右滑动关闭页面
        // var platFormC = appcan.locStorage.getVal("platForm");
        // uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            // isSupport: (platFormC != "1")
        // }));
        // uexWindow.onSwipeRight = function(){
            // delectMsgCache();
        // };
        
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                delectMsgCache();
            }
        };
        
    });
    
    // close page
    function delectMsgCache () {
        // 删除由列表页传递过来的页面数据
        appcan.locStorage.remove("duty-four-3-special");
        appcan.locStorage.remove("duty-four-3-special-id");
        appcan.window.publish('save-duty-four-special-draft');
    }
    
})($);

