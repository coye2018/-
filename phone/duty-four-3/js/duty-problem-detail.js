var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');
var stateObj = JSON.parse(appcan.locStorage.getVal('duty-problem-detail-state'));
var entry = Number(appcan.locStorage.getVal('duty-problem-index'));

//模版语法  
Vue.component('my-component', {
    template: '#myComponent'
});

var vm = new Vue({
    el: '#dutyProblemDetail',
    data: {
        dataId: '',
        problemDetail: {},
        progress: [],
        progMore: false,
        progMoreMax: 4,
        cmmtMore: false,
        cmmtMoreMax: 4,
        isModalReceive: false,
        isModalSendback: false,
        isModalFinish: false,
        isModalDisabled: false,
        isModalDistSendback: false,
        isModalDistOther: false,
        isModalDistReceive: false,
        isModalCheck: false,
        isModalCheckNot: false,
        entryIndex: -1,
        btnIndex: -1,
        comment: []
    },
    created: function() {
        //保存问题id, 及时删掉对应的缓存值
        this.dataId = dataId;
        this.entryIndex = entry;
        
        //及时拿到状态, 判断显示哪些底部按钮
        if (isDefine(stateObj)) {
            var ss = stateObj.state;
            if (entry == 0) {
                //已报送的问题
                if (ss == 3) {
                    //已退回
                    this.btnIndex = 1;
                }
            } else if (entry == 1) {
                //本单位问题
                if  (ss == 4 || ss == 9) {
                    //待接收 或者 验收不通过
                    this.btnIndex = 2;
                } else if (ss == 7 || ss == 11) {
                    //整改中
                    this.btnIndex = 3;
                }
            } else if (entry == 2) {
                //区域问题
                if  (ss == 1 || ss == 2 || ss==5 ) {
                    //待转派or重新提交or部门单位已拒收
                    this.btnIndex = 4;
                } else if (ss == 8) {
                    //整改完成
                    this.btnIndex = 5;
                }
            }
        }
    },
    methods: {
        previewPic: function (arr, index) {
            var preJson = {
                displayActionButton: true,
                displayNavArrows: true,
                enableGrid: true,
                //startOnGrid:true,
                startIndex: index,
                data: arr
            };
            uexImage.openBrowser(preJson, function() {});
        },
        progressShowMore: function() {
            this.progMore = !this.progMore;
        },
        commentShowMore: function() {
            this.cmmtMore = !this.cmmtMore;
        },
        editAgain: function() {
            //重新编辑
            var editData = {
                id: this.dataId,
                findtime: this.problemDetail.findtime,
                text: escape(this.problemDetail.content),
                pic: this.problemDetail.sendpictures,
                note: this.problemDetail.remark
            };
            appcan.locStorage.setVal('problemEditData', JSON.stringify(editData));
            
            if (platForm == '1') {
                appcan.window.open('duty-problem-report-again', 'duty-problem-report-again.html', 2);
            } else {
                appcan.window.open({
                    name: 'duty-problem-report-again',
                    dataType: 0,
                    data: 'duty-problem-report-again.html',
                    aniId: 0,
                    type: 1024
                });
            }
        },
        commentReply: function(){
            if (platForm == '1') {
                appcan.window.open('duty-problem-commentpage', 'duty-problem-commentpage.html', 2);
            } else {
                appcan.window.open({
                    name: 'duty-problem-commentpage',
                    dataType: 0,
                    data: 'duty-problem-commentpage.html',
                    aniId: 0,
                    type: 1024
                });
            }
        }
    },
    computed: {
        progMoreText: function() {
            return (this.progMore ? '收起' : '查看更多');
        },
        progMoreArr: function() {
            return (this.progMore ? '' : 'actives');
        },
        cmmtMoreText: function() {
            return (this.cmmtMore ? '收起' : '查看更多');
        },
        cmmtMoreArr: function() {
            return (this.cmmtMore ? '' : 'actives');
        }
    }
});

function pageClose() {
    appcan.locStorage.remove('duty-problem-detail-id');
    appcan.locStorage.remove('duty-problem-detail-status');
    appcan.window.publish('duty-problem-submit-reload','1');
    setTimeout(function() {
        appcan.window.close(1);
    }, 1);
}

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        pageClose();
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    loadDutyDetail(true);
    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg) {
            quanjuFontsize();
        });
    
        $('#ScrollContent').on('click', '.task-prog-detail-more', function(e){
            var quanwen  = $(this).siblings('.task-prog-detail');
            quanwen.toggleClass('in3line');
            
            $(this).find('span').text(quanwen.hasClass('in3line')?'更多>':'收起∧');
        });
        
        $(document).on('click', '#problemReceive', function() {
            //本单位问题-未接受-点击接收
            vm.isModalReceive = true;
            openFrame('duty-problem-receive');
            
        }).on('click', '#problemSendback', function() {
            //本单位问题-未接受-点击退回
            vm.isModalSendback = true;
            openFrame('duty-problem-sendback');
            
        }).on('click', '#problemFinish', function() {
            //本单位问题-整改中-点击完成
            vm.isModalFinish = true;
            openFrame('duty-problem-finish');
            
        }).on('click', '#problemDisabled', function() {
            //本单位问题-整改中-点击无法整改
            vm.isModalDisabled = true;
            openFrame('duty-problem-disabled');
            
        }).on('click', '#problemDistSendback', function() {
            //区域问题-转派问题-不是本区域的问题，我要退回
            vm.isModalDistSendback = true;
            openFrame('duty-problem-dist-sendback');
            
        }).on('click', '#problemDistOther', function() {
            //区域问题-转派问题-接收并转派给其他单位处理
            vm.isModalDistOther = true;
            //区域问题被退回 继续派发 获取state
            if (vm.problemDetail.state == 5) {
                appcan.locStorage.setVal('problemState', vm.problemDetail.state)
            }
            openFrame('duty-problem-dist-other');
            
        }).on('click', '#problemDistReceive', function() {
            //区域问题-转派问题-是本单位的问题，我要自己处理
            vm.isModalDistReceive = true;
            openFrame('duty-problem-dist-receive');
            
        }).on('click', '#problemCheck', function() {
            //区域问题-验收问题-验收通过
            vm.isModalDistCheck = true;
            openFrame('duty-problem-dist-check');
            
        }).on('click', '#problemCheckNot', function() {
            //区域问题-验收问题-验收不通过
            vm.isModalDistCheckNot = true;
            openFrame('duty-problem-dist-checknot');
            
        })
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                //有弹出框则优先关闭弹出框, 否则关闭页面
                if (vm.isModalReceive) {
                    appcan.window.publish('duty-problem-receive-modal', 0);
                    vm.isModalReceive = false;
                    
                } else if (vm.isModalSendback) {
                    appcan.window.publish('duty-problem-sendback-modal', 0);
                    vm.isModalSendback = false;
                    
                } else if (vm.isModalFinish) {
                    appcan.window.publish('duty-problem-finish-modal', 0);
                    vm.isModalFinish = false;
                    
                } else if (vm.isModalDisabled) {
                    appcan.window.publish('duty-problem-disabled-modal', 0);
                    vm.isModalDisabled = false;
                    
                } else if (vm.isModalDistSendback) {
                    appcan.window.publish('duty-problem-dist-sendback-modal', 0);
                    vm.isModalDistSendback = false;
                    
                } else if (vm.isModalDistOther) {
                    appcan.window.publish('duty-problem-dist-other-modal', 0);
                    vm.isModalDistOther = false;
                    
                } else if (vm.isModalDistReceive) {
                    appcan.window.publish('duty-problem-dist-receive-modal', 0);
                    vm.isModalDistReceive = false;
                    
                } else if (vm.isModalDistCheck) {
                    appcan.window.publish('duty-problem-dist-check-modal', 0);
                    vm.isModalDistCheck = false;
                    
                } else if (vm.isModalDistCheckNot) {
                    appcan.window.publish('duty-problem-dist-checknot-modal', 0);
                    vm.isModalDistCheckNot = false;
                    
                } else {
                    pageClose();
                }
            }
        };
        
        appcan.window.subscribe('duty-problem-detail-reload', function() {
            loadDutyDetail();
        });

        //关闭当前详情页
        appcan.window.subscribe('duty-problem-detail-close', function(){
            pageClose();
        })
        var paramClose = {
            isSupport: (platForm != '1')
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function() {
            pageClose();
        };
    });
})($);

function handleDutyDetail(obj) {
    var findtime = obj.findtime,
        sendtime = obj.sendtime,
        estimatetime = obj.estimatetime,
        finishtime = obj.finishtime,
        state = obj.state;
    
    //报送图片
    var thisArr = [];
    for (var p = 0; p < obj.sendpictures.length; p++) {
        thisArr.push(serverPath + obj.sendpictures[p].url);
    }
    obj.sendpic = [].concat(thisArr);
    
    //整改后图片
    var thatArr = [];
    for (var p = 0; p < obj.finishpictures.length; p++) {
        thatArr.push(serverPath + obj.finishpictures[p].url);
    }
    obj.finishpic = [].concat(thatArr);
    
    //报送单位
    obj.tibao = obj.senddepartname || '--';
    //报送人
    obj.tibaoren = obj.sendrusername || '';
    //归属区域
    obj.guishu = obj.managerdepartname || '--';
    //转派人
    obj.zhipairen = obj.managerusername || '';
    //责任单位
    obj.zeren = obj.dodepartname || '--';
    //当前值班人
    obj.dangban = obj.dutyperson || '';
    
    //报送时间
    if(isDefine(findtime)) {
        obj.find_time = timeStemp(findtime, 'yyyy-MM-dd').date;
    }else{
        obj.find_time = '--';
    }
    
    //提交时间
    if(isDefine(sendtime)) {
        obj.send_time = timeStemp(sendtime, 'yyyy-MM-dd').date;
    }else{
        obj.send_time = '--';
    }
    
    //预计完成时间
    if(isDefine(estimatetime)) {
        obj.estimate_time = timeStemp(estimatetime, 'yyyy-MM-dd').date;
    }else{
        obj.estimate_time = '--';
    }
    
    //实际完成时间
    if(isDefine(finishtime)) {
        obj.finish_time = timeStemp(finishtime, 'yyyy-MM-dd').date;
    }else{
        obj.finish_time = '--';
    }
    
    //备注
    obj.note = unescape(obj.remark).replace(/\n/g,"</br>") || '无';
    obj.content = unescape(obj.content).replace(/\n/g,"</br>");
    
    //状态和颜色
    if (this.entryIndex == 2) {
        obj.stateString = dutyDisCommon[obj.state].text; //状态对应的文本字段
        obj.colour = dutyDisCommon[obj.state].colour; //状态对应的颜色字段
    } else {
        obj.stateString = dutyMyCommon[obj.state].text; //状态对应的文本字段
        obj.colour = dutyMyCommon[obj.state].colour; //状态对应的颜色字段
    }
    
    //动态
    handleProgressDetail(obj.problemprogress);
    //回复
    handleCommentData(obj.problemreplys);
    
    vm.problemDetail = obj;
}

//处理动态进展数据
function handleProgressDetail(obj) {
    var arrs = [];
    var cls_0 = 'icon-20-t-begin',
        cls_1 = 'icon-20-t-run',
        cls_2 = 'icon-20-t-end';
    
    for (var i = 0; i < obj.length; i++) {
        var itm = obj[i];
        var states = itm.optionflag;
        var contents = unescape(itm.optioncontent);
        var codes = itm.optioncode;
        var cls_itm = '';
        
        //状态图标
        if (states == 1) {
            cls_itm = cls_0;
        } else if (states == 6 || states == 10) {
            cls_itm = cls_2;
        } else {
            cls_itm = cls_1;
        }
        
        //如果用户没有填写内容，把code末尾的冒号替换成句号
        if (contents == '') {
            codes = codes.replace(/\:/g, '。').replace(/：/g, '。');
        }
        
        var aim = {
            dept: itm.optiondepartname,
            user: itm.optionuser,
            timestamp: itm.optiontime,
            time: timeStemp(itm.optiontime, 'MM-dd HH:mm').commonDate,
            flag: states,
            flagclass: cls_itm,
            status: codes,
            reply: contents
        };
        
        arrs = arrs.concat(aim);
    }
    vm.progress = [].concat(arrs);
    
    Vue.nextTick(function() {
        var nodes = $('#progress').find('.task-prog-detail');
        var node_0 = $(nodes[0]);
        var node_lineheight = parseFloat(node_0.css('line-height'));
        var node_minheight = node_lineheight * 3;
        nodes.each(function(i, n) {
            if (parseFloat($(n).children().height()) > node_minheight) {
                $(n).addClass('in3line');
                $(n).siblings('.task-prog-detail-more').removeClass('hide');
            }
        })
    });
}

//处理评论回复数据
function handleCommentData(obj) {
    var arrt = [];
    for (var j = 0; j < obj.length; j++) {
        var itn = obj[j];
        var bim = {
            id: itn.id,
            departname: itn.departname,
            sendname: itn.sendname,
            time: timeStemp(itn.time, 'MM-dd HH:mm').commonDate,
            content: unescape(itn.content)
        };
        arrt = arrt.concat(bim);
    }
    vm.comment = [].concat(arrt);
}

//获取问题详情数据
function loadDutyDetail(layer) {
    //从列表页存入缓存的id
    var json = {
        path: serverPath + 'focDutyProblemController.do?focGetProblemDetail',
        data: {
            problemId: dataId
        },
        layer: layer || false,
        layerErr: false
    };
    ajaxRequest(json, function(data, e) {
        console.log(JSON.stringify(data));
        if (e == 'success') {
            vm.nonet = false;
            handleDutyDetail(data.obj);
        } else {
            vm.nonet = true;
        }
    });
}

//打开frame
function openFrame(urls) {
    appcan.frame.open({
        id: urls,
        url: urls + '.html',
        left: 0,
        top: 0
    });
}

//点击外部键盘消失
function onKeyBoardShow(json) {
    var keyBoardToggleData = JSON.parse(json);
    if (keyBoardToggleData.status == 0) {
        uexInputTextFieldView.close();
    }
};

/**
 * 回复发送插件按钮回调事件 
 * @param {Object} data
 */
function onCommitJson(data) {
    var text = data.emojiconsText;
    if (!isDefine(text)) {
        uexInputTextFieldView.close();
        layerToast('回复内容不能为空');
        return false;
    }
}