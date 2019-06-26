var platForm = appcan.locStorage.getVal('platForm'); //安卓为1 iOS为0
var optionId = appcan.locStorage.getVal('optionFunctionid'); //一级菜单id

//判断是否有option数据
var optionNums = appcan.locStorage.getVal('optionNums');
var optnum = [];
if (isDefine(optionNums)) {
    optnum = JSON.parse(optionNums);
}

var vm = new Vue({
    el: '#duty-problem',
    data: {
        yitibao: '',
        beizhipai: '',
        jijiang: '',
        yichaoshi: '',
        options: [],
        optionsData: []
    },
    methods: {
        enterPage: function(item) {
            var pagename = item.function_path.split('.html')[0];
            var keys = -1;
            
            if (pagename == 'duty-problem-submit' || pagename == 'duty-problem-report') {
                //已报送的问题
                keys = 0;
            } else if (pagename == 'duty-problem-my') {
                //本单位问题
                keys = 1;
            } else if (pagename == 'duty-problem-district') {
                //区域问题
                keys = 2;
            }
            
            if (keys != -1) {
                appcan.locStorage.setVal('duty-problem-index', keys);
                //二级菜单id, 用于清除消息数
                appcan.locStorage.setVal('duty-problem-badge', {
                    id: item.functionid,
                    num: item.reddot
                });
            }
            pageopen(pagename);
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        pageclose();
    });
    appcan.button("#nav-right", "btn-act", function() {
        pageopen('duty-problem-notice')
    });
    
    appcan.ready(function() {
        getMenuData();
        getIndexData();
        
        //重新加载数据
        appcan.window.subscribe('duty-problem-reload', function(e) {
            getIndexData();
        });
        
        //更新二级菜单的角标
        appcan.window.subscribe('duty-problem-get-newnum', function(res) {
            optionNums = appcan.locStorage.getVal('optionNums');
            optnum = [];
            
            if (isDefine(optionNums)) {
                optnum = JSON.parse(optionNums);
            }
            
            handleMenuData(vm.optionsData);
        });
        
        var paramClose = {
            isSupport: (platForm != '1')
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function() {
             pageclose(); 
        };
        
        //监听系统返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                pageclose();
            }
        };
    });
})($);

//处理二级菜单数据
function handleMenuData(obj) {
    var menuarr = [];
    
    //角标的缓存数据
    var badgeHuancun = appcan.locStorage.getVal('duty-problem-badge');
    var badgeJson;
    if (isDefine(badgeHuancun)) {
        badgeJson = JSON.parse(badgeHuancun);
    }
    
    for (var c = 0; c < obj.length; c++) {
        var ct = obj[c];
        var reds = 0, redstr = '';
        
        for (key in optnum) {
            if (key == ct.functionid) {
                reds = optnum[key];
                redstr = optnum[key] > 99 ? '99+' : optnum[key];
            }
        }
        
        menuarr.push({
            'functionid': ct.functionid,
            'function_path': ct.function_path,
            'functionname': ct.functionname,
            'function_icon': ct.function_icon,
            'functionorder': ct.functionorder,
            'reddot': reds,
            'reddot_show': redstr
        });
        
        //停留在二级列表页时, 有新的推送进来, 必须更新缓存数据
        if (isDefine(badgeHuancun) && badgeJson.id == ct.functionid) {
            appcan.locStorage.setVal('duty-problem-badge', {
                id: ct.functionid,
                num: reds
            })
        }
    }
    vm.options = [].concat(menuarr);
}

//获取二级菜单数据
function getMenuData() {
    var jsonRed = {
        path: serverPath + 'function.do?focGetSubmenu',
        data: {
            menuId: optionId
        },
        layer: false
    };
    ajaxRequest(jsonRed, function(data, e) {
        if (e == 'success') {
            vm.optionsData = [].concat(data.obj);
            handleMenuData(data.obj);
        } else {
            layerToast('网络错误，请稍后重试。');
        }
    });
}

//处理首页数据
function handleIndexData(obj) {
    if (obj) {
        vm.yitibao = obj.sendNum;
        vm.beizhipai = obj.receiveNum;
        vm.jijiang = obj.doNumToday;
        vm.yichaoshi = obj.timeOutNumToday;
    } else {
        vm.yitibao = '--';
        vm.beizhipai = '--';
        vm.jijiang = '--'
        vm.yichaoshi = '--';
    }
}

//获取首页数据
function getIndexData() {
    var json = {
        path: serverPath + 'focDutyProblemController.do?focGetMainProblemInfo',
        data: {}
    };
    ajaxRequest(json, function(data, e) {
        handleIndexData(data.obj)
    });
}

function pageopen(pname, psrc){
    var platForm = appcan.locStorage.getVal('platForm');
    if(platForm == '1'){
        appcan.window.open(pname, (psrc || pname) + '.html', 2);
    }else{
        appcan.window.open({
            name: pname,
            dataType: 0,
            data: (psrc || pname) + '.html',
            aniId: 0,
            type: 1024
        });
    }
}

function pageclose() {
    appcan.locStorage.remove('duty-problem-badge');
    appcan.locStorage.remove('problemFunctionid');
    appcan.window.close(1);
}
