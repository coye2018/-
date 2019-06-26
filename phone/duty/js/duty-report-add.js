var vm = new Vue({
    el: '#Page',
    data:{
        shade: false
    },
    methods: {
        
        handin: function(){
            appcan.window.publish('duty-report-add-submit','duty-report-add-submit');
        }
    }
});

function createPopover () {
    var titleHeight = parseFloat($('#Header').height()),
        footerHeight = parseFloat($('#Footer').height()),
        pageHeight = parseFloat($('#Page').height()),
        pageWidth = parseFloat($('#Page').width());
    
    appcan.window.openPopover({
        name: 'duty-report-add-page',
        url: 'duty-report-add-page.html',
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight-titleHeight-footerHeight
    });
};

(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        //appcan.window.close(1);
        appcan.window.evaluatePopoverScript({
            name:'duty-report-add',
            popName:'duty-report-add-page',
            scriptContent:'closeedit()'
        });
        
    });
    
    appcan.button("#nav-right", "btn-act", function() {
        //appcan.window.open('duty-report-add', 'duty-report-add.html', 2);
    });
    
    appcan.ready(function() {
        
        // 创建弹出子窗口
        createPopover();
        appcan.window.subscribe("duty-report-add",function(type){
             vm.shade = (type == 'hide' ? false : true);
        })
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.evaluatePopoverScript({
                name:'duty-report-add',
                popName:'duty-report-add-page',
                scriptContent:'closeedit()'
            });
        };
        
        
    });
    
})($);
