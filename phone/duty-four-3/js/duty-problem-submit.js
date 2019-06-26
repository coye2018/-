var platForm = appcan.locStorage.getVal('platForm'); //安卓为1 iOS为0
var ms = null;
Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
    el: '#duty-problem-submit',
    data: {
        nothing: false,
        nonet: false,
        hasSearch: false,
        searchIpt: '',
        isToInput: false,
        list: [],
        listCopy: []
    },
    methods: {
        toggleSearch: function() {
            if (this.nonet) {
                this.hasSearch = false;
                return false;
            }
            this.hasSearch = !this.hasSearch;
        },
        searchToInput: function() {
            //从文本标签切换到输入框
            this.isToInput = true;
        },
        searchToText: function() {
            //从输入框切换到文本标签
            if(this.searchIpt != '') return false;
            this.isToInput = false;
        },
        searchEmpty: function() {
            //清除输入框
            this.searchIpt = '';
            this.isToInput = false;
            this.searchFilter();
        },
        searchFilter: function() {
            //搜索
            var sipt = this.searchIpt.trim(),
                groupArr = [].concat(this.listCopy),
                result = [];
            
            for (var g = 0; g < groupArr.length; g++) {
                var item = groupArr[g];
                var content = item.content.trim(),
                    depart = item.departname.trim();
                
                if (content.indexOf(sipt) < 0 && depart.indexOf(sipt) < 0) {
                    groupArr.splice(g, 1);
                    g--;
                }
            }
            
            this.nothing = (groupArr.length == 0);
            if (groupArr.length != 0) {
                ms.showNoMore();
            } else {
                ms.hideUpScroll();
            }
                
            this.list = [].concat(groupArr);
            
            //搜索框有文字时, 锁定上拉下拉功能
            ms.lockDownScroll(sipt != '');
            ms.lockUpScroll(sipt != '');
        },
        enterDetail: function(itm, idx) {
            //进入'已报送问题详情页'
            appcan.locStorage.setVal('duty-problem-detail-id', itm.id); //问题id
            appcan.locStorage.setVal('duty-problem-detail-state', JSON.stringify({
                state: itm.state,
                stateString: itm.stateString,
                colour: itm.colour
            })); //状态和对应的颜色
            
            if (platForm == '1') {
                appcan.window.open('duty-problem-detail', 'duty-problem-detail.html', 2);
            } else {
                appcan.window.open({
                    name: 'duty-problem-detail',
                    dataType: 0,
                    data: 'duty-problem-detail.html',
                    aniId: 0,
                    type: 1024
                });
            }
        }
    }
});

function closePage() {
    appcan.locStorage.remove('duty-problem-index');
    appcan.locStorage.remove('duty-problem-badge');
    
    //连续关闭N个页面必须这么写
    var closeArr = ['duty-problem-report', 'duty-problem-submit'];
    closeArr.forEach(function(name){
        appcan.window.evaluateScript({
            name: name,
            scriptContent: 'appcan.window.close(1);'
        });
    });
}

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        closePage();
    });
    appcan.button("#nav-right", "btn-act", function() {
    });
    
   // updateBadgeTwo();
    appcan.ready(function() {
        initMeScroll();
        
        //重新加载列表数据
        appcan.window.subscribe('duty-problem-submit-reload', function(e) {
            vm.list.splice(0, vm.list.length);
            vm.listCopy.splice(0, vm.listCopy.length);
            ms.resetUpScroll(true);
        });
        
        //监听系统返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                closePage();
            }
        };
        
        // 禁止ios右滑关闭
        uexWindow.setSwipeCloseEnable(JSON.stringify({
            enable: 0
        }));
    });
})($);

//处理数据
function handleData(obj) {console.log(JSON.stringify(obj));
    var arr = [];
    
    for (var b = 0; b < obj.length; b++) {
        var th = obj[b];
        var cls = '';
        
        var state = th.state;
        var time_format = (isDefine(th.time) ? timeStemp(th.time, 'MM-dd HH:mm').commonDate : '--');
        
        var temp = {
            id: th.id, //数据id
            content: unescape(th.content), //内容
            time: th.time, //提交问题的时间
            time_format: time_format, //提交问题的时间(格式化)
            state: state, //状态
            stateString: dutyMyCommon[state].text, //状态对应的文本字段
            colour: dutyMyCommon[state].colour, //状态对应的颜色字段
            departname: th.managerdepartname, //部门名称
            estimatetime: th.estimatetime, //预计完成时间
        };
        
        arr.push(temp);
    }
    
    vm.list = vm.list.concat(arr);
    vm.listCopy = vm.listCopy.concat(arr);
    vm.nothing = (vm.listCopy.length == 0);
}

function loadData(page) {
    ms.hideUpScroll();
    if (page.num == 1) {
        vm.list.splice(0, vm.list.length);
        vm.listCopy.splice(0, vm.listCopy.length);
    }
    
    var json = {
        path: serverPath + 'focDutyProblemController.do?focGetSendProblemsList',
        data: {
            page: page.num,
            pageSize: page.size
        },
        layer: false,
        layerErr: false
    };
    ajaxRequest(json, function(data, e) {
        if (e == 'success') {
            if(page.num == 1){
              updateBadgeTwo();   
            }
            handleData(data.obj);
            ms.endSuccess(data.obj.length);
            vm.nonet = false;
        } else {
            layerToast('网络错误，请稍后重试。');
            ms.endErr();
            vm.nonet = true;
        }
    });
}

//修改二级菜单角标数
function updateBadgeTwo(){
    var badgeStr = appcan.locStorage.getVal('duty-problem-badge');
    var badge = null;
    console.log(badgeStr);
   
    if (isDefine(badgeStr)) {
        badge = JSON.parse(badgeStr);
    }
    
    //角标为0则不用调接口
    if (!isDefine(badge) || badge.num == 0) return false;
    
    var jsonTwo = {
        path: serverPath + 'focCommonController.do?focclearMessageNum',
        data: {
            model: badge.id,
            num: Number(badge.num)
        },
        layer: false
    };
    ajaxRequest(jsonTwo, function(data, e) {
        if (e == 'success') {
            updateBadgeOne(badge.num);
        }
    });
}

//修改一级菜单角标数
function updateBadgeOne(num) {
    console.log("num:"+num,"optionId:"+appcan.locStorage.getVal('optionFunctionid'))
    var jsonOne = {
        path: serverPath + 'focCommonController.do?focclearMessageNum',
        data: {
            model: appcan.locStorage.getVal('optionFunctionid'),
            num: Number(num)
        },
        layer: false
    };
    ajaxRequest(jsonOne, function(data, e) {
        if (e == 'success') {
            //option页面数据更新
            appcan.window.publish('option-get-num', '1');
        }
    });
}

//初始化mescroll并自动触发上拉加载
function initMeScroll() {
    ms = new MeScroll('mescroll', {
        down: {
            auto: false
        },
        up: {
            auto: true,
            noMoreSize: 3,
            page: {
                num: 0,
                size: 10
            },
            callback: loadData
        }
    });
}
