var vm = new Vue({
    el: '#Page',
    data:{
        shade: false,
        title: '简报',
        submitBtn: false
    },
    methods: {
        
        handin: function(){
            appcan.window.publish('duty-report-add-submit','duty-report-add-submit');
        }
    }
});

function createPopover () {
    var titleHeight = parseFloat($('#Header').height()),
        pageHeight = parseFloat($('#Page').height()),
        pageWidth = parseFloat($('#Page').width());
    
    appcan.window.openPopover({
        name: 'duty-report1-add-page',
        url: 'duty-report1-add-page.html',
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight-titleHeight
    });
};

(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        //appcan.window.close(1);
        appcan.window.evaluatePopoverScript({
            name:'duty-report1-add',
            popName:'duty-report1-add-page',
            scriptContent:'closeedit()'
        });
    });
    
    
    appcan.ready(function() {
        
        // 创建弹出子窗口
        createPopover();
        
        // 禁止ios右滑关闭
        uexWindow.setSwipeCloseEnable(JSON.stringify({
            enable: 0
        }));
        
        // 主窗口阴影
        appcan.window.subscribe("duty-report-add-shade",function(type){
             vm.shade = (type == 'hide' ? false : true);
        });
        
        // 更改标题
        appcan.window.subscribe("duty-report-add-title", function(val){
             vm.title = val;
        });
        
        // 提交按钮
        appcan.window.subscribe('duty-report-add-submitBtn', function (val) {
            vm.submitBtn = (val == 'show') ? true : false;
        });
        
        // 安卓键盘拦截
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                  appcan.window.evaluatePopoverScript({
                    name:'duty-report1-add',
                    popName:'duty-report1-add-page',
                    scriptContent:'closeedit()'
                  });
            }
        };
    });
    
})($);
