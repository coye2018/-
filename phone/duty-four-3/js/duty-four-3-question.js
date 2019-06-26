var vm = new Vue({
    el: '#Page',
    data: {
        showBtn: true,
        isSubmit: false,
        shade: false
    },
    methods: {
        submitDataFn: function() {
            appcan.window.publish('duty-four-question-submit');
        }
    }
}); 

(function ($) {
    appcan.button("#nav-left", "btn-act", function() {
        delectMsgCache();
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    //点击提交
    // appcan.button("#approve-all", "btn-act", function() {
        // appcan.window.publish('duty-four-3-question-submit', '0');
    // });
    
    appcan.ready(function() {
        vm.isSubmit = appcan.locStorage.getVal('isSubmit');
        if(vm.isSubmit == 'true'){
            vm.showBtn = false;
        }else{
            vm.showBtn = true;
        }
        var titleHeight = parseInt($('#Header').height()),
            //footerHeight = parseInt($('#Footer').height()),
            pageHeight = parseInt($('#Page').height()),
            pageWidth = parseInt($('#Page').width());
        $('#ScrollContent').css({
            top: titleHeight+'px',
            height: pageHeight-titleHeight+'px'
        });
        appcan.window.openPopover({
            name: 'duty-four-3-question-page',
            url: 'duty-four-3-question-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight
        });    
        resetPage({'header':'Header','content':'Page','name':'duty-four-3-question-page'});
        // 阴影toggle
        appcan.window.subscribe('duty-four-3-question-shade', function (type) {
            vm.shade = (type != 'hide');
        });
        
        // 关闭页面
        appcan.window.subscribe('duty-four-3-question-close', function () {
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
        appcan.locStorage.remove("duty-four-3-question");
        //  草稿
        appcan.window.publish('save-duty-four-question-draft');
    }
    
})($);

//数据传到后台
function sendData(params){
    alert(111)
    var json = {
        path: serverPath + 'focTrackInfoController.do?focAppDoUpdatePerson',
        data: params,
        layer: true
    };
    ajaxRequest(json, function(data, e){
        appcan.window.publish('duty-four-3-question-shade', 'hide');
        if(e == 'success'){
            appcan.window.publish('duty-four-3-question');
            appcan.window.publish('duty-four-3-question-close');
        }else{
            layerToast('上传失败，请检查网络是否正常');
        }
    });
}