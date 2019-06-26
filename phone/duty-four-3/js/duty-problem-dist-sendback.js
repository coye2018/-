var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');
var vm = new Vue({
    el: '#duty-problem-dist-sendback',
    data: {
        text: '',
        textMax: 100
    },
    methods: {
        modalClose: function() {
            pageClose();
        },
        distSendback: function() {
            distSendbackConfirm(this.text);
        }
    }
})

//确认退回, 提交数据
function distSendbackConfirm(text) {
    if(text == ''){
        layerToast('请填写理由后退回',2);
        return ;
    }
    
    if (text.length > vm.textMax) {
        layerToast('理由字数不得超过' + vm.textMax +  '。');
        return false;
    }
    
    var json = {
        path: serverPath + 'focDutyProblemController.do?focAreaRefuseToAcceptProblem',
        data: {
            problemId: dataId,
            reason: escape(text)
        },
        layer: true
    };
    ajaxRequest(json, function(data, e) {
        if (e == 'success') {
            appcan.window.publish('duty-problem-dist-reload', 0);
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
        appcan.window.subscribe('duty-problem-dist-sendback-modal', function(e) {
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
