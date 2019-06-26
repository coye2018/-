var dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
var now = new Date(),
    nowYear = now.getFullYear(),
    nowMonth = now.getMonth(),
    nowDay = now.getDate(),
    nowHour = now.getHours(),
    nowMinute = now.getMinutes();
var min = new Date(nowYear, nowMonth, nowDay, nowHour, nowMinute),
    max = new Date(nowYear+3, nowMonth, nowDay, nowHour, nowMinute);

var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');
var vm = new Vue({
    el: '#duty-problem-receive',
    data: {
        text: '',
        textMax: 100,
        expecttime: {
            time: '',
            timestamp: ''
        }
    },
    mounted: function() {
        var times = nowYear + '/' + (nowMonth + 1) + '/'+nowDay;
        
        this.expecttime = {
            time: times,
            timestamp: parseInt(timeStemp(times).dateTimeSecond) + 86399
        };
    },
    methods: {
        modalClose: function() {
            pageClose();
        },
        receive: function() {
            receiveConfirm();
        }
    }
})

//确认接收, 提交数据
function receiveConfirm() {
    if(!isDefine(vm.text)){
        layerToast('请填写整改措施再提交。')
        return;
    }
    
    if (vm.text.length > vm.textMax) {
        layerToast('整改措施字数不得超过' + vm.textMax + '。');
        return;
    }
    
    var json = {
        path: serverPath + 'focDutyProblemController.do?focReceiveProblem ',
        data: {
            problemId: dataId,
            plan: escape(vm.text),
            estimateTime: vm.expecttime.timestamp
        },
        layer: true
    };
    
    ajaxRequest(json, function(data, e) {
        if (e == 'success') {
            appcan.window.publish('duty-problem-my-reload', 0);
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
        initMobiscroll();
        
        //detail页
        appcan.window.subscribe('duty-problem-receive-modal', function(e) {
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

//日期选择组件初始化
function initMobiscroll() {
    var instance = mobiscroll.date('#picktime', {
        lang: 'zh',
        theme: 'ios',
        display: 'bottom',
        headerText: '日期选择',
        min: min,
        max: max,
        minWidth: 130,
        dateFormat: 'yy/mm/dd',
        // dateWheels: 'yy m dd DD',
        showLabel: true,
        onInit: function (evtObj, obj) {
        },
        onBeforeShow: function (evtObj, obj) {
        },
        onSet: function (evtObj, obj) {
            vm.expecttime = {
                time: evtObj.valueText,
                timestamp: parseInt(timeStemp(evtObj.valueText).dateTimeSecond) +86399
            };
        }
    });
}