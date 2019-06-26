var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');
var vm = new Vue({
    el: '#duty-problem-dist-check',
    data: {
        text: '',
        textMax: 100
    },
    methods: {
        modalClose: function() {
            pageClose();
        },
        distCheck: function() {
            distCheckConfirm();
        }
    }
})

//确认验收通过, 提交数据
function distCheckConfirm() {
    if (vm.text.length > vm.textMax) {
        layerToast('备注字数不得超过'+ vm.textMax +'。');
        return ;
    }
    
    var json = {
        path: serverPath + 'focDutyProblemController.do?focChenkProblem',
        data: {
            problemId: dataId,
            checkConclusion: escape(vm.text),
            flag: 1
        },
        layer: true
    };
    ajaxRequest(json, function(data, e) {
        if (e == 'success') {
            appcan.window.publish('duty-problem-dist-reload', 2);
            appcan.window.publish('duty-problem-detail-close', 0);
            pageClose();
        } else {
            layerToast('网络错误，请稍后重试。');
        }
    });
}

//关闭浮动窗口
function pageClose() {
    appcan.window.close();
}

(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('duty-problem-dist-check-modal', function(e) {
            pageClose();
        })
        
        //右滑关闭, 主窗口浮动窗口分别调用
        var paramClose = {
            isSupport: platForm != '1'
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            pageClose();
        };
    });
})($);
