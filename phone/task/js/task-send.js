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
    
    appcan.button("#approve-all", "btn-act", function() {
        appcan.window.publish('task-send-submit', '0');
    });
    
    appcan.ready(function() {
        
        var titleHeight = parseInt($('#Header').outerHeight()),
            footerHeight = parseInt($('#Footer').height()),
            pageHeight = parseInt($('#Page').height()),
            pageWidth = parseInt($('#Page').width());
            
        $('#ScrollContent').css({
            top: titleHeight+'px',
            height: pageHeight-titleHeight-footerHeight+'px'
        });
        appcan.window.openPopover({
            name: 'task-send-page',
            url: 'task-send-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight-footerHeight
        });
        resetPage({'header':'Header','footer':'Footer','content':'Page','name':'task-send-page'});    
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            delectMsgCache();
        };
        
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                delectMsgCache();
            }
        };
        
        appcan.window.subscribe('task-send-shade', function (type) {
            vm.shade = (type == 'hide' ? false : true);
        });
        
    });
    
})($);

function delectMsgCache () {
    //执行人缓存删除
    appcan.locStorage.remove('peoplepick_1');
    //抄送人缓存删除
    appcan.locStorage.remove('peoplepick_2');
    //提醒删除
    appcan.locStorage.remove('task-send-alarm');   
    //任务类型删除
    appcan.locStorage.remove('task-type');
    appcan.window.close(1);
};




