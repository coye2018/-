var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');
var problemState = appcan.locStorage.getVal('problemState');
var vm = new Vue({
    el: '#duty-problem-dist-other',
    created: function () {
        this.getDepartment()
    },
    data: {
        selected: '',
        text: '',
        textMax: 100,
        option: []
    },
    mounted: function () {
        //ios300ms延时
        FastClick.attach(document.body);
    },
    methods: {
        modalClose: function () {
            pageClose();
        },
        distOther: function () {
            disdistOtherConfirm();
        },
        getDepartment: function () {
            var that = this;
            var json = {
                path: serverPath + 'focDutyProblemController.do?focGetDoDepartsList',
                data: {},
                layer: false
            };
            ajaxRequest(json, function (data, e) {
                console.log(data)
                if (e == 'success') {
                    var departId=appcan.locStorage.getVal('deptId');
                    var op = [{
                        text: '请选择',
                        value: ''
                    }];
                    for (var a = 0; a < data.obj.length; a++) {
                        var _this = data.obj[a];
                        if(_this.id==departId){
                            continue;
                        }
                        op.push({
                            text: _this.departname,
                            value: _this.id
                        })
                    }
                    that.option = [].concat(op);
                    that.initMobiscroll();
                } else {
                    layerToast('网络错误，请重新打开弹出框重试。');
                }
            });
        },
        initMobiscroll: function() {
            var that = this;
            mobiscroll.select('#selected', {
                lang: 'zh',
                theme: 'ios', 
                display: 'bottom',
                headerText: '责任单位',
                data: that.option,
                onSet: function (evtObj, obj) {
                    that.selected = obj.getVal();
                }
            });
        }
    }
})
//转派给其他单位处理, 提交数据
function disdistOtherConfirm() {
    if (!isDefine(vm.selected)) {
        layerToast('请选择责任单位', 2);
        return;
    }

    if (vm.text.length > vm.textMax) {
        layerToast('附言字数不得超过'+ vm.textMax +'。');
        return;
    }

    var json = {
        path: serverPath + 'focDutyProblemController.do?focAreaAcceptProblem',
        data: {
            problemId: dataId,
            toDepartId: $('#selected').val(),
            remark: escape(vm.text)
        },
        layer: true
    };
    if (isDefine(problemState)) {
        //区域问题被退回 继续派发
        json.path = serverPath + 'focDutyProblemController.do?focAreaAgainAcceptProblem',
        ajaxRequest(json, function (data, e) {
            console.log(data, e)
            if (e == 'success') {
                appcan.locStorage.remove('problemState');
                appcan.window.publish('duty-problem-dist-reload', 0);
                appcan.window.publish('duty-problem-detail-close', 0);
                pageClose();
            } else {
                appcan.locStorage.remove('problemState');
                layerToast('网络错误，请稍后重试。');
            }
        });
    } else {
        ajaxRequest(json, function (data, e) {
            console.log(data, e)
            if (e == 'success') {
                appcan.locStorage.remove('problemState');  
                appcan.window.publish('duty-problem-dist-reload', 0);
                appcan.window.publish('duty-problem-detail-close', 0);
                pageClose();
            } else {
                appcan.locStorage.remove('problemState');
                layerToast('网络错误，请稍后重试。');
            }
        });
    }
}

//关闭浮动窗口
function pageClose() {
    appcan.locStorage.remove('problemState');
    appcan.window.close(1);
}

(function ($) {
    appcan.ready(function () {
        appcan.window.subscribe('duty-problem-dist-other-modal', function (e) {
            pageClose();
        })

        //右滑关闭, 主窗口浮动窗口分别调用
        var paramClose = {
            isSupport: platForm != '1'
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function () {
            pageClose();
        };
    });

})($);