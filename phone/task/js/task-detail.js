//模版语法  
 Vue.component('my-component', {
            template: '#myComponent'
        })


var vm = new Vue({
    el: '#task-detail',
    data: {
        //2已完成 1进行中 0指派了待接收
        taskFlag: 0,
        isCopy: appcan.locStorage.getVal("isCopy"),
        progress: [],
        repaly: [],
        taskDetail: {},
        nonet: false,
        comment: [],
        commentReply: [],
        targetIndex: true,
        isrecive:false,
        isReply:true
    },
    methods: {
        unclick: function(data) {
            var taskUnReceiver = new Array();
            var taskReceiver = new Array();
            for (var i = 0; i < data.length; i++) {
                if (data[i].state == 2) {
                    taskReceiver.push(data[i]);
                } else {
                    taskUnReceiver.push(data[i]);
                }
            };

            appcan.locStorage.setVal("taskUnReceiver", JSON.stringify(taskUnReceiver));
            appcan.locStorage.setVal("taskReceiver", JSON.stringify(taskReceiver));
            var platForm = appcan.locStorage.getVal("platForm");
            var aniId = 0;
            //Android
            if (platForm == "1") {
                appcan.window.open('task-detail-dolist', 'task-detail-dolist.html', 2);
            } else {
                appcan.window.open({
                    name: 'task-detail-dolist',
                    dataType: 0,
                    data: 'task-detail-dolist.html',
                    aniId: aniId,
                    type: 1024
                });
            }
        },
        commentReply:function(){
               var dataId = appcan.locStorage.getVal("taskId");
               appcan.locStorage.setVal('dataId',dataId);
              //打开回复图片页面
                var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                    appcan.window.open("task-commentpage","task-commentpage.html",2);
                }else{
                      appcan.window.open({
                        name:'task-commentpage',
                        dataType:0,
                        data:'task-commentpage.html',
                        aniId:aniId,
                        type:1024
                    });  
                } 
        },
        reply: function() {
        	//任务进展权限
			if(vm.taskFlag==2){
				layerToast('任务已完成不能添加进展。');
			   	return false;
			};  
            appcan.locStorage.setVal("flag", 1);
            var data = {
                emojicons: "res://emojicons/emojicons.xml",
                placeHold: "请输入内容"
            };
            uexInputTextFieldView.open(data);
            uexInputTextFieldView.setInputFocused();
        },
        replys: function(id,puid) {
            //聊天点击进来不能回复
        	if( appcan.locStorage.getVal("TaskShareButton")=='1'){
        	    return;
        	}
            if (id == null) {
                id = '';
            }
            if (puid == null) {
                puid = '';
            }
            appcan.locStorage.setVal("puid", puid);
            appcan.locStorage.setVal("pcid", id);
            appcan.locStorage.setVal("flag", 2);
            var data = {
                emojicons: "res://emojicons/emojicons.xml",
                placeHold: "请输入内容"
            };
            uexInputTextFieldView.open(data);
            uexInputTextFieldView.setInputFocused();
        },
        openImg: function(item, index) {
            var imgArray = new Array();
            for (var i = 0; i < item.length; i++) {
                imgArray.push(item[i].file_path);
            };
            var data = {
                displayActionButton: true,
                displayNavArrows: true,
                enableGrid: true,
                //startOnGrid:true,
                startIndex: index,
                data: imgArray
            }
            uexImage.openBrowser(data, function() {});
        },
        openImge:function(item){
            var imgArray = new Array();
            imgArray.push(item);
             var data = {
                        displayActionButton: true,
                        displayNavArrows: true,
                        enableGrid: true,
                        //startOnGrid:true,
                        // startIndex:0,
                        data: imgArray
                    }
             uexImage.openBrowser(data, function() {});
        }
    },
    updated:function(){
    	if($('.listboxs').children().hasClass('listbox')){
    		$('.listContent').addClass('listsbox');
    	}
    	
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
        function() {
            appcan.window.publish("reloadTaskList", "reloadTaskList");
            appcan.window.close(1);
        });
    appcan.button("#nav-right", "btn-act",
        function() {
            if(!vm.isReply){
                return;
            }
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
             //任务执行人
            var receiveInfoStr="";
            for (var i=0; i < vm.taskDetail.receivesInfo.length; i++) {
                 receiveInfoStr =receiveInfoStr+" "+vm.taskDetail.receivesInfo[i].realname;
            };
            appcan.locStorage.setVal("taskReceiveInfoStr",receiveInfoStr);
            //任务创建时间
            appcan.locStorage.setVal("taskSendTime",vm.taskDetail.create_time_second);
            //任务正文
            appcan.locStorage.setVal("taskSendContent",vm.taskDetail.content);
            //表示从任务跳转到转发页面的。
            appcan.locStorage.setVal("chatDutyProblem",0);
            
            
            
            //Android
            if(platForm=="1"){
                appcan.window.open('chat-forward', '../chat/chat-forward.html', 2);
            }else{
                  appcan.window.open({
                    name:'chat-forward',
                    dataType:0,
                    data:'../chat/chat-forward.html',
                    aniId:aniId,
                    type:1024
                });  
            } 
        });
    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg) {
            quanjuFontsize();
        });
        //监听回复评论页面刷新detail
        appcan.window.subscribe("reloadTaskComment",function(msg){
           loadTaskDetail(false);
        })
        appcan.window.subscribe('confirmTashShare', function(msg) {
            //刷新会话列表
            appcan.window.subscribe("loadRecent","loadRecent");
            layerToast('分享成功');
        });
        //加载任务详细信息。
        loadTaskDetail(true);
        //键盘弹出收起
        uexInputTextFieldView.onKeyBoardShow = onKeyBoardShow;
        //键盘输入点击发送的时候的监听函数        
        uexInputTextFieldView.onCommitJson = onCommitJson;
        //ios300ms延时
        FastClick.attach(document.body);
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.window.publish("reloadTaskList", "reloadTaskList");
                appcan.window.close(1);
            }
        };
        var platFormC = appcan.locStorage.getVal("platForm");
        var isSupport = true;
        if (platFormC == "1") {
            isSupport = false;
        }
        var paramClose = {
            isSupport: isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function() {
                appcan.window.publish("reloadTaskList", "reloadTaskList");
                appcan.window.close(1);
            }
    });

    //执行人
    /*
     appcan.button("#dolist", "btn-act", function() {
            appcan.window.open('task-detail-dolist', 'task-detail-dolist.html', 2);
        });*/


    //最底部按钮
    appcan.button("#task-btn", "btn-act", function() {
        if (vm.taskFlag == 0) {
            addConfirm({
                content: '确定接受该任务吗？',
                yes: function(i) {
                    layerRemove(i);
                    var json = {
                        path: serverPath + 'focTaskController.do?focConfirmTask',
                        data: {
                            taskId: appcan.locStorage.getVal("taskId")
                        }
                    }
                    ajaxRequest(json, function(data, e) {
                        if (e == "success") {
                            vm.taskFlag = 1;
                            layerToast('接收成功！');
                            loadTaskDetail(false);
                        }
                    });
                }
            });
        } else if (vm.taskFlag == 1) {
            addConfirm({
                content: '确定该任务完成了吗？',
                yes: function(i) {
                    layerRemove(i);
                    var json = {
                        path: serverPath + 'focTaskController.do?focFinishTask',
                        data: {
                            taskId: appcan.locStorage.getVal("taskId")
                        }
                    }
                    ajaxRequest(json, function(data, e) {
                        if (e == "success") {
                            vm.taskFlag = 2;
                            layerToast('该任务已完成。');
                            loadTaskDetail(false);
                        }
                    });

                }
            });
        }
    });

    $('.task-tab-box').on('click', '.task-tab', function() {
        var that = $(this),
            idx = that.index(),
            act = 'actives',
            hid = 'hide';
        if (idx == 0) {
            vm.targetIndex = true;
        } else if (idx == 1) {
            vm.targetIndex = false;
        }

        that.addClass(act).siblings().removeClass(act);
        $('.task-tab-con').eq(idx).removeClass(hid).siblings('.task-tab-con').addClass(hid);
    });   
})($);

function loadTaskDetail(layer) {
    //从列表页存入缓存的任务id
    var taskId = appcan.locStorage.getVal("taskId");
    var userName = appcan.locStorage.getVal("userCode");
    //如果为true 则是抄送人
    var isCopy = appcan.locStorage.getVal("isCopy");
    var json = {
        path: serverPath + "focTaskController.do?focgetTaskInfo",
        data: {
            taskId: taskId
        },
        layer: layer,
        layerErr: false
    };
    ajaxRequest(json, function(data, e) {
        // console.log(data);
        if (e == "success") {
            // console.log(JSON.parse(JSON.stringify(data)));
            vm.nonet = false;
            //供分享任务所用
            data.obj.create_time_second=data.obj.create_time;
            data.obj.create_time = timeStemp(data.obj.create_time, 'MM-dd').commonDate;
            var timer=null;
			if(isDefine(data.obj.finish_time)){
				timer = timeStempCopy(data.obj.finish_time, 'MM-dd').commonDate;
			}
            data.obj.finish_time = timer;
            data.obj.content = unescape(data.obj.content);
            //判断任务是否是自己发起的。如果是
            if (data.obj.username == userName || isCopy == "true") {
                //vm.taskFlag=0;
                //判断任务的所有人及完成的人数，如果相等则表示任务已完成！
                if (data.obj.finishPeople == data.obj.allPeople) {
                    //已完成
                    vm.taskFlag = 2;
                } else {
                    vm.taskFlag = 3;
                }
            } else {
                for (var i = 0; i < data.obj.receivesInfo.length; i++) {
                	if(data.obj.receivesInfo[i].user_id==appcan.locStorage.getVal("userID")){
                		vm.isrecive=true;
                	}
                    if (data.obj.receivesInfo[i].usercode == userName) {
                        vm.taskFlag = Number(data.obj.receivesInfo[i].state);
                    }

                };
            }
            for (var i = 0; i < data.obj.fileInfo.length; i++) {
                if (isDefine(data.obj.fileInfo[i].file_path)) {
                    data.obj.fileInfo[i].file_path = serverPath + data.obj.fileInfo[i].file_path;
                }

            };
            if(appcan.locStorage.getVal("chatFromTaskShareButton")=='1'){
                buttonCtrl();
                appcan.locStorage.setVal("TaskShareButton",'1');
                appcan.locStorage.remove("chatFromTaskShareButton");
            }else{
                appcan.locStorage.remove("TaskShareButton");
            }
            //处理执行人的显示
            // if(data.obj.receivesInfo.length>1){
            // data.obj.receiver=data.obj.receivesInfo[0].realname+" 等"+data.obj.receivesInfo.length+"人";
            // }else{
            // data.obj.receiver=data.obj.receivesInfo[0].realname
            // }
            // //处理抄送人的显示
            // if(data.obj.copyInfo.length>1){
            // data.obj.copyPerson=data.obj.copyInfo[0].realname+" 等"+data.obj.copyInfo.length+"人";
            // }else if(data.obj.copyInfo.length==1){
            // data.obj.copyPerson=data.obj.copyInfo[0].realname;
            // }else{
            // data.obj.copyPerson="";
            // } 
            vm.taskDetail = data.obj;
			// console.log(vm.taskDetail)
        } else {
            vm.nonet = true;
        }
    });
    var taskDynamicJson = {
        path: serverPath + "focTaskController.do?focGetProcessInfo",
        data: {
            page: 0,
            size: 1000,
            taskId: taskId
        },
        layer: false,
        layerErr: false
    }
    ajaxRequest(taskDynamicJson, function(data, e) {
        // console.log(data);
        if (e == "success") {
            // console.log(JSON.parse(JSON.stringify(data)));
            var replyData = new Array()
            for (var i = 0; i < data.obj.length; i++) {
                data.obj[i].dept = data.obj[i].realname;
                data.obj[i].time = timeStemp(data.obj[i].create_time, 'MM-dd HH:mm').commonDate;
                if (data.obj[i].type == 0) {
                    data.obj[i].flag = "1";
                    data.obj[i].reply = filterBrow(unescape(data.obj[i].content));
                    data.obj[i].status = "添加了";
                    replyData.push(data.obj[i]);
                } else {
                    if (data.obj[i].content == "0") {
                        data.obj[i].status = "指派了";
                    } else if (data.obj[i].content == "1") {
                        data.obj[i].status = "接收了";
                    } else if (data.obj[i].content == "2") {
                        data.obj[i].status = "完成了";
                    }
                    data.obj[i].flag = data.obj[i].content;
                    data.obj[i].reply = '';
                }
            };
            vm.progress = data.obj;
            vm.repaly = replyData;

        }
    });
    //评论ajax
    var commentJson = {
        path: serverPath + "focTaskCommentsController.do?focGetTaskCommentsList",
        data: {
            taskinfoid: taskId
        },
        layer: false,
        layerErr: false
    }
    ajaxRequest(commentJson, function(data, e) {
        if (e == "success") {
            for (var i = 0; i < data.obj.length; i++) {
            	var commentReplyData = new Array();
                data.obj[i].time = timeStemp(data.obj[i].createDate, 'MM-dd HH:mm').commonDate;
                data.obj[i].reply = unescape(JSON.parse(data.obj[i].content).content);
                if(isDefine(JSON.parse(data.obj[i].content).img)){
                    data.obj[i].img = serverPath+JSON.parse(data.obj[i].content).img;
                }else{
                    data.obj[i].img=false;
                }
                if(data.obj[i].pcidList!=null){
                	commentReplyData = data.obj[i].pcidList;
                for (var j = 0; j < commentReplyData.length; j++) {
	                commentReplyData[j].time = timeStemp(commentReplyData[j].createDate, 'MM-dd HH:mm').commonDate;
	                commentReplyData[j].reply = unescape(JSON.parse(commentReplyData[j].content).content);
            	};
            		data.obj[i].pcidList=commentReplyData;
            		commentReplyData=[];
                }else{
                	commentReplyData=[];
                	data.obj[i].pcidList=[];
                }
            };
            vm.comment = data.obj;
        }
    });

}
//点击外部键盘消失
function onKeyBoardShow(json) {
   var keyBoardToggleData = JSON.parse(json)
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
    //发送ajax
    var flag = appcan.locStorage.getVal('flag');
    if (flag == 1) {
        var json = {
            path: serverPath + "focTaskController.do?focsaveTaskReply",
            data: {
                taskId: appcan.locStorage.getVal("taskId"),
                content: escape(text)
            },
            layer: false
        };
        ajaxRequest(json, function(data, e) {
            
            if (e == "success") {
               
                loadTaskDetail(false);
                uexInputTextFieldView.close();
            }
        })
    } else if (flag == 2) {
    	var json1 = {
            content:escape(text)
            } 
        var json = {
            path: serverPath + "focTaskCommentsController.do?focDoAdd",
            data: {
                userid:appcan.locStorage.getVal("userID"),
                pcid:appcan.locStorage.getVal("pcid"),
                puserid:appcan.locStorage.getVal("puid"),
                taskinfoid: appcan.locStorage.getVal("taskId"),
                content: JSON.stringify(json1)
            },
            layer: false
        };
        ajaxRequest(json, function(data, e) {
            if (e == "success") {
                loadTaskDetail(false);
                uexInputTextFieldView.close();
            }
        })
    }

}

/**
 * 聊天分享点击按钮隐藏 
 * @param {Object} data
 */
function buttonCtrl(){
    vm.isCopy=true;
    vm.isrecive=false;
    vm.isReply=false;
}
function timeStempCopy(d,e){
    //判断是否为数字
    if(typeof(d)=='number'){
        //判断是否为秒级
        if(d.toString().length==10){
           d=d*1000;
        }
    }
    var todayDate=new XDate.today();
    var date=new XDate(d);
    var num=todayDate.diffDays(new XDate(date.toString("yyyy-MM-dd")));
    var commonDate=date.toString(e);
    var hours=date.getHours();
    var minutes=date.getMinutes();
    if(hours<10){
        hours="0"+ hours;
    }
    if(minutes<10){
        minutes="0"+ minutes;
    }
    if(num==-1){
        if(hours == '00'){
            hours = '24';
        }
        if(minutes == '00'){
            minutes = '00';
        }
        commonDate="昨天 "+hours+":"+minutes;
    }else if(num==-2){
        if(hours == '00'){
            hours = '24';
        }
        if(minutes == '00'){
            minutes = '00';
        }
        commonDate="前天 "+hours+":"+minutes;
    }else if(num==0){
        if(hours == '00'){
            hours = '23';
        }
        if(minutes == '00'){
            minutes = '59';
        }
        commonDate="今天 "+hours+":"+minutes;
    }else if(num==1){
        commonDate="明天 "+hours+":"+minutes;
    }else if(num==2){
        commonDate="后天 "+hours+":"+minutes;
    }
    var weekList = ['周日','周一','周二','周三','周四','周五','周六'];
    var json={
        date:date.toString(e),//转换出来的格式。
        weekDay:weekList[date.getDay()],//这个是星期几
        dateTimeSecond:Math.round(date.getTime()/1000),//秒数
        dateTime:date.getTime(),//毫秒数
        commonDate:commonDate
    }
    return json;
}