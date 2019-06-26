var mescroll = ['mescroll0', 'mescroll1', 'mescroll2'];
var platForm = appcan.locStorage.getVal('platForm');
Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
    el: '#duty-problem-my',
    data: {
        searchIpt: '',
        isToInput: false,
        hasSearch: false,
        nonet: false,
        nonetRecive: false,
        tagIndex: 0,
        listleftData: [],
        listleftDataQuery: [],
        listmiddleData: [],
        listmiddleDataQuery: [],
        listrightData: [],
        listrightDataQuery: [],
        mescrollArr: new Array(3),
        num: 0,
        hasdata: [true, true, true]
    },
    methods: {
        searchToggle: function() {
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
        searchEmpty: function(){
            //清除输入框
            this.searchIpt = '';
            this.isToInput = false;
            this.searchFilter();
        },
        searchFilter: function(){
            //搜索
            if (vm.tagIndex == 0) {
                if (!isDefine(this.searchIpt)) {
                    vm.listleftData = [].concat(vm.listleftDataQuery);
                    this.isunLock();
                } else {
                    var listleftDataQuerySave = [];
                    
                    for (var i = 0; i < vm.listleftDataQuery.length; i++) {
                        var listleft = vm.listleftDataQuery[i];
                        if (listleft.content.indexOf(this.searchIpt) > -1 || listleft.managerdepartname.indexOf(this.searchIpt) > -1) {
                            listleftDataQuerySave.push(listleft);
                        }
                    }
                    vm.listleftData = listleftDataQuerySave;
                    this.isLock();
                }
                
                // this.hasdata[this.tagIndex] = (vm.listleftData.length != 0);
                if (vm.listleftData.length != 0) {
                    this.hasdata[this.tagIndex] = true;
                    mescroll[0].showNoMore();
                } else {
                    this.hasdata[this.tagIndex] = false;
                    mescroll[0].hideUpScroll();
                }
                
            } else if (vm.tagIndex == 1) {
                if (!isDefine(this.searchIpt)) {
                    vm.listmiddleData = [].concat(vm.listmiddleDataQuery);
                    this.isunLock();
                } else {
                    var listmiddleDataQuerySave = [];
                    for (var i = 0; i < vm.listmiddleDataQuery.length; i++) {
                        var listmiddle = vm.listmiddleDataQuery[i];
                        
                        if(listmiddle.content.indexOf(this.searchIpt) > -1 || listmiddle.managerdepartname.indexOf(this.searchIpt) > -1) {
                            listmiddleDataQuerySave.push(listmiddle);
                        }
                    }
                    vm.listmiddleData = listmiddleDataQuerySave;
                    this.isLock();
                }
                
                // this.hasdata[this.tagIndex] = (vm.listmiddleData.length != 0);
                if (vm.listmiddleData.length != 0) {
                    this.hasdata[this.tagIndex] = true;
                    mescroll[1].showNoMore();
                } else {
                    this.hasdata[this.tagIndex] = false;
                    mescroll[1].hideUpScroll();
                }
                
            } else if (vm.tagIndex == 2) {
                if(!isDefine(this.searchIpt)){
                    vm.listrightData = [].concat(vm.listrightDataQuery);
                    this.isunLock();
                } else {
                    var listrightDataQuerySave = [];
                    for (var i = 0; i < vm.listrightDataQuery.length; i++) {
                        var listright = vm.listrightDataQuery[i];
                        
                        if (listright.content.indexOf(this.searchIpt) > -1 || listright.managerdepartname.indexOf(this.searchIpt) > -1) {
                          listrightDataQuerySave.push(vm.listrightDataQuery[i]);
                        }
                    }
                    vm.listrightData = listrightDataQuerySave;
                    this.isLock();
                }
                
                // this.hasdata[this.tagIndex] = (vm.listrightData.length != 0);
                if (vm.listrightData.length != 0) {
                    this.hasdata[this.tagIndex] = true;
                    mescroll[2].showNoMore();
                } else {
                    this.hasdata[this.tagIndex] = false;
                    mescroll[2].hideUpScroll();
                }
                
            }
        },
        enterProblemDetail: function(itm, idx) {
            //进入'已报送问题详情页'
            appcan.locStorage.setVal('duty-problem-detail-id', itm.id); //问题id
            appcan.locStorage.setVal('duty-problem-detail-state', JSON.stringify({
                state: itm.state,
                stateString: itm.stateString,
                colour: itm.colour
            })); //状态和对应的颜色
            
            if (platForm == "1"){
                appcan.window.open('duty-problem-detail', 'duty-problem-detail.html', 2);
            }else{
                appcan.window.open({
                    name: 'duty-problem-detail',
                    dataType: 0,
                    data: 'duty-problem-detail.html',
                    aniId: 0,
                    type: 1024
                });  
            }
        },
        isLock: function() {
            //禁止下拉
            mescroll[0].lockDownScroll(true);
            mescroll[1].lockDownScroll(true);
            mescroll[2].lockDownScroll(true);
            
            mescroll[0].lockUpScroll(true);
            mescroll[1].lockUpScroll(true);
            mescroll[2].lockUpScroll(true); 
        },
        isunLock: function() {
            //恢复下拉
            mescroll[0].lockDownScroll(false);
            mescroll[1].lockDownScroll(false);
            mescroll[2].lockDownScroll(false);
            
            mescroll[0].lockUpScroll(false);
            mescroll[1].lockUpScroll(false);
            mescroll[2].lockUpScroll(false);
        },
        tabSwitch: function(i) {
            this.tagIndex = i;
            $('body').scrollTop(0);
            
            if (event.type == 'click') {
                mescroll[i].resetUpScroll(true);
            }
        }
    }
});

function initMescroll(mescrollId, index){
    // 上下拉加载
    mescroll[index] = new MeScroll(mescrollId, {
        down: {
            auto: false
        },
        up: {
            auto: true,
            noMoreSize: 1,
            page: {
                num: 0,
                size: 10,
                index: index
            },
            htmlNodata: '<p class="upwarp-nodata">-- 已到底部 --</p>',
            callback: loadDutyProblem
        }
    });
    return mescroll[index];
}

function handleDutyProblem(obj, idx) {
    var arr = [];
    
    for (var b = 0; b < obj.length; b++) {
        var th = obj[b];
        var cls = '';
        
        var state = th.state;
        var sendtime_format = (isDefine(th.sendtime) ? timeStemp(th.sendtime, 'MM-dd HH:mm').commonDate : '--');
        var finishtime_format = (isDefine(th.finishtime) ? timeStemp(th.finishtime, 'MM-dd HH:mm').commonDate : '--');
        
        var temp = {
            id: th.id, //数据id
            content: unescape(th.content), //内容
            sendtime: th.sendtime, //报送时间
            sendtime_format: sendtime_format, //报送时间(格式化)
            finishtime: th.finishtime, //整改完成时间、无法整改提交时间
            finishtime_format: finishtime_format, //整改完成时间、无法整改提交时间(格式化)
            state: state, //状态
            stateString: dutyMyCommon[state].text, //状态对应的文本字段
            colour: dutyMyCommon[state].colour, //状态对应的颜色字段
            dodepartname: th.dodepartname, //责任单位
            managerdepartname:th.managerdepartname//转派单位
		};
        
		arr.push(temp);
    }
    
    return arr;
} 

/**
 * 值班问题列表 
 * @param {Object} page 
 * @param {Object} size
 * 
 */
function loadDutyProblem(page) {
    mescroll[0].hideUpScroll();
    mescroll[1].hideUpScroll();
    mescroll[2].hideUpScroll();
    
    if (page.num == 1) {
        switch (page.index) {
            case 0:
            	//整改中
                vm.listleftData.splice(0, vm.listleftData.length);
                break;
            case 1:
            	//整改完成
                vm.listmiddleData.splice(0, vm.listmiddleData.length);
                break;
            case 2:
            	//无法整改
                vm.listrightData.splice(0, vm.listrightData.length);
                break;
        }
    }
        
	//flag=1整改中    flag=2整改完成   flag=3无法整改
    var dataIndex = page.index;
    var json = {
        path: serverPath + 'focDutyProblemController.do?focGetReceiveProblemsList',
        data:{
            page: page.num,
            pageSize: page.size,
            flag: (dataIndex + 1)
        },
        layer: false
    };
    ajaxRequest(json, function(data, e) {
        if (e == 'success') {
            vm.nonetRecive = false;
            
            if (dataIndex == 0) {
                if(page.num == 1){
                    updateBadgeTwo();
                }
                vm.listleftData = vm.listleftData.concat(handleDutyProblem(data.obj, dataIndex));
                vm.listleftDataQuery = [].concat(vm.listleftData);
                
                vm.hasdata[dataIndex] = (vm.listleftData.length != 0);
            } else if (dataIndex == 1) {
                vm.listmiddleData = vm.listmiddleData.concat(handleDutyProblem(data.obj, dataIndex));
                vm.listmiddleDataQuery = [].concat(vm.listmiddleData);
                
                vm.hasdata[dataIndex] = (vm.listmiddleData.length != 0);
            } else if (dataIndex == 2) {
                vm.listrightData = vm.listrightData.concat(handleDutyProblem(data.obj, dataIndex));
                vm.listrightDataQuery = [].concat(vm.listrightData);
                
                vm.hasdata[dataIndex] = (vm.listrightData.length != 0);
            }
            mescroll[dataIndex].endSuccess(data.obj.length);
            
            if (vm.hasSearch && isDefine(vm.searchIpt)) {
                vm.searchFilter();
            }
        } else {
            vm.nonetRecive = true;
            vm.hasdata = [false, false, false];
            mescroll[dataIndex].endErr();
        }
    })
}

//修改二级菜单角标数
function updateBadgeTwo(){
    var badgeStr = appcan.locStorage.getVal('duty-problem-badge');
    console.log(badgeStr);
    var badge = null;
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

function pageClose() {
    appcan.locStorage.remove('duty-problem-index');
    appcan.locStorage.remove('duty-problem-badge');
    appcan.window.close();
}

(function($) {
    //updateBadgeTwo();
    
    appcan.button("#nav-left", "btn-act", function() {
        pageClose();
    });
    appcan.ready(function() {
        /*创建MeScroll对象*/
        initMescroll('mescroll' + 0, 0);
        initMescroll('mescroll' + 1, 1);
        initMescroll('mescroll' + 2, 2);
        
        appcan.window.subscribe('fontsize', function(msg) {
            quanjuFontsize();
        });

        //重新加载列表数据
        appcan.window.subscribe('duty-problem-my-reload', function(e) {
            mescroll[0].resetUpScroll(true);
            mescroll[1].resetUpScroll(true);
            mescroll[2].resetUpScroll(true);
			if (e != '-1') {
                vm.tabSwitch(e);
            }
        })
        
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                pageClose();
            }
        };
        
        //如果是ios设备，设置向右滑动关闭页面
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platForm != '1')
        }));
        uexWindow.onSwipeRight = function() {
            pageClose();
        };
        
       //ios300ms延时
        FastClick.attach(document.body); 
    });
    
})($);
 
