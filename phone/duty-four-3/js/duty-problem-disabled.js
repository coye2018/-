var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');

var vm = new Vue({
    el: '#duty-problem-disabled',
    data: {
        text: '',
        textMax: 100
    },
    methods: {
        modalClose: function() {
            pageClose();
        },
        disables: function() {
            disabledConfirm();
        }
    }
})

//无法整改, 提交数据
function disabledConfirm() {
    if (vm.text == '') {
        layerToast('请填写无法整改理由。');
        return;
    }
    
    if (vm.text.length > vm.textMax) {
        layerToast('理由字数不得超过'+ vm.textMax +'。');
        return;
    }
    
    var json = {
        path: serverPath + 'focDutyProblemController.do?focCanNotFinishProblem',
        data: {
            content: escape(vm.text),
            problemId: dataId
        },
        layer: true
    };
    ajaxRequest(json, function(data, e) {
        if (e == 'success') {
            appcan.window.publish('duty-problem-my-reload', 2);
            appcan.window.publish('duty-problem-detail-close', 0);
            pageClose();
        } else {
            layerToast('网络错误，请稍后重试。');
        }
    });
}

//关闭浮动窗口
function pageClose() {
    appcan.window.close(1);
}

(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('duty-problem-disabled-modal', function(e) {
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
