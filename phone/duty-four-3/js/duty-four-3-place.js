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
    
    //点击提交
    // appcan.button("#approve-all", "btn-act", function() {
        // appcan.window.publish('duty-four-3-place-submit', '0');
    // });
    
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
            name: 'duty-four-3-place-page',
            url: 'duty-four-3-place-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight
        });     
        resetPage({'header':'Header','content':'Page','name':'duty-four-3-place-page'});
        // 阴影toggle
        appcan.window.subscribe('duty-four-3-place-shade', function (type) {
            vm.shade = (type != 'hide');
        });
        
        // 关闭页面
        appcan.window.subscribe('duty-four-3-place-close', function () {
            appcan.window.close(13);
        });
        
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
    
    function delectMsgCache () {
        // 页面数据
        appcan.locStorage.remove("duty-four-3-place");
        //草稿
        //appcan.window.publish('save-duty-four-place-draft');
        appcan.window.close(13);
    }
    
})($);

