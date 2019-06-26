//模版语法  
 Vue.component('my-component', {
    template: '#myComponent'
});

var vm = new Vue({
    el: '#dutyProblemDetail',
    data: {
        isCopy: false,  //未接受状态颜色
        islook:false,   //整改中状态颜色
        isTimeout:false,//已超时状态颜色
        isShow:false,   //待审核状态颜色
        isClose:false,  //已关闭状态颜色
        dutyFlag:true,  //回复按钮及分享按钮
        Send:false, //isSend：0,1
        progress: [],
        repaly: [],
        problemDetail: {},
        nonet: false,
        comment: [],
        targetIndex: true,
        recvdepartlength:0,//责任单位完成数量
        allrecvdepartlength:0,//责任单位总数量
        picShow:false,     //整改后照片显示
        isFinish:false, //完成按钮显示
        isDutyCount:false, //判断是否是当前值班帐号完成按钮不能显示  
        isView:false,//审核按钮显示
        srcName:false,//来源人
        isrecive:false,//指派
        stateShow:{}
    },
    methods: {
        unclick: function(data) {
            appcan.locStorage.setVal("taskReceiver", JSON.stringify(data));
            var platForm = appcan.locStorage.getVal("platForm");
            var aniId = 0;
            //Android
            if (platForm == "1") {
                appcan.window.open('duty-problem-dolist', 'duty-problem-dolist.html', 2);
            } else {
                appcan.window.open({
                    name: 'duty-problem-dolist',
                    dataType: 0,
                    data: 'duty-problem-dolist.html',
                    aniId: aniId,
                    type: 1024
                });
            }
        },
        reply: function() {
            appcan.locStorage.setVal("flag", 1);
            var data = {
                emojicons: "res://emojicons/emojicons.xml",
                placeHold: "请输入内容"
            };
            uexInputTextFieldView.open(data);
            uexInputTextFieldView.setInputFocused();
        },
        replys: function(id,departId) {
            //聊天点击进来不能回复
            if(appcan.locStorage.getVal("dutyProblemButton")=='1'){
                return;
            }
            if (id == null) {
                id = '';
            }
            if (departId == null) {
                departId = '';
            }
            appcan.locStorage.setVal("departId", departId);
            appcan.locStorage.setVal("pcid", id);
            appcan.locStorage.setVal("flag", 2);
            var data = {
                emojicons: "res://emojicons/emojicons.xml",
                placeHold: "请输入内容"
            };
            uexInputTextFieldView.open(data);
            uexInputTextFieldView.setInputFocused();
        },
        commentReply:function(){
               var dataId = appcan.locStorage.getVal('dataId');
               appcan.locStorage.setVal('dataId',dataId);
              //打开回复图片页面
                var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                    appcan.window.open("duty-problem-commentpage","duty-problem-commentpage.html",2);
                }else{
                      appcan.window.open({
                        name:'duty-problem-commentpage',
                        dataType:0,
                        data:'duty-problem-commentpage.html',
                        aniId:aniId,
                        type:1024
                    });  
                } 
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
        },
        accept:function(){
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("duty-problem-acceptance","duty-problem-acceptance.html",2);
            }else{
                  appcan.window.open({
                    name:'duty-problem-acceptance',
                    dataType:0,
                    data:'duty-problem-acceptance.html',
                    aniId:aniId,
                    type:1024
                });  
            } 
        },
        finish:function(){
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("duty-problem-finishpage","duty-problem-finishpage.html",2);
            }else{
                  appcan.window.open({
                    name:'duty-problem-finishpage',
                    dataType:0,
                    data:'duty-problem-finishpage.html',
                    aniId:aniId,
                    type:1024
                });  
            } 
        },
        passCheck:function(){
                     addConfirm({
                        content: '确定审核通过吗？',
                        yes: function(i) {
                            layerRemove(i);
                            var json = {
                                path: serverPath + 'focDutyFeedbackInfo.do?focExamineInfo',
                                data: {
                                    infoId: appcan.locStorage.getVal("dataId"),
                                    content:'',
                                    examineState:1,
                                    userId:appcan.locStorage.getVal("userID")
                                }
                            }
                            ajaxRequest(json, function(data, e) {
                                if (e == "success") {
                                    appcan.window.publish("reloadTaskList", "reloadTaskList");
                                    var closeArr = ['duty-problem-detail'];
                                        closeArr.forEach(function(name){
                                            appcan.window.evaluateScript({
                                                name:name,
                                                scriptContent:'appcan.window.close(-1);'
                                            });
                                        });
                                    layerToast('审核通过成功！');
                                }
                            });
                        }
                });   
        },
        nopassCheck:function(){
           var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("duty-problem-noauditpage","duty-problem-noauditpage.html",2);
            }else{
                  appcan.window.open({
                    name:'duty-problem-noauditpage',
                    dataType:0,
                    data:'duty-problem-noauditpage.html',
                    aniId:aniId,
                    type:1024
                });  
            } 
       }
    },
    updated:function(){
        this.$nextTick(function(){
            if($('.listboxs').children().hasClass('listbox')){
                $('.listContent').addClass('listsbox');
            }
            //设置图片容器宽度
            var img=$('.dure-li-pig>img');
            var imgWid=parseInt(img.width());
            var len=img.length;
            $('.dure-item').width(imgWid*len);
            
            $('.task-prog-item').each(function(i, n){
                var outer = $(n).find('.task-prog-detail').height(),
                    inner = $(n).find('.task-prog-detail-text').height(),
                    more = $(n).find('.task-prog-detail-more');
                
                if(isDefine(inner) && outer<inner){
                    more.removeClass('hide');
                }else{
                    more.addClass('hide');
                }
            });
        });
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
            if(!vm.dutyFlag){
                return;
            }
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //责任单位
            var departStr="";
            for (var i=0; i < vm.problemDetail.recvdepartinfos.length; i++) {
                 departStr =departStr+" "+vm.problemDetail.recvdepartinfos[i].description;
            };
            //值班问题责任部门
            appcan.locStorage.setVal("dutyProblemRecvdepart",departStr);
            //值班问题提交时间
            appcan.locStorage.setVal("dutyProblemTime",vm.problemDetail.dutyProblemTime);
            //值班问题正文
            appcan.locStorage.setVal("dutyProblemContent",vm.problemDetail.content);
            //表示从值班问题跳转到转发页面的。
            appcan.locStorage.setVal("chatDutyProblem",1);
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
        appcan.window.subscribe("reloadDutyComment",function(msg){
           loadDutyDetail(false);
        })
        appcan.window.subscribe('confirmDutyProblem', function(msg) {
            //刷新会话列表
            appcan.window.subscribe("loadRecent","loadRecent");
            layerToast('分享成功');
        });
        //判断是否是值班账号
        if(appcan.locStorage.getVal("isDutyAccount")=='1'){
             //判断是否是当前值班帐号完成按钮不能显示   
            vm.isDutyCount=true;
        }else{
            vm.isDutyCount=false;
        }
        //获取isSend
        if(appcan.locStorage.getVal("isSend")==1){
           vm.Send=true;
           vm.isrecive=false;
        }else if(appcan.locStorage.getVal("isSend")==0){
            //问题指派人无法添加进展
           vm.isrecive=true;
        }
        //加载任务详细信息。
        loadDutyDetail(false);
        
        //键盘弹出收起
        uexInputTextFieldView.onKeyBoardShow = onKeyBoardShow;
        
        //键盘输入点击发送的时候的监听函数        
        uexInputTextFieldView.onCommitJson = onCommitJson;
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
    
    $('.lists-item-free').on('tap', '.task-prog-detail-more', function(e){
        e.stopPropagation();
        e.preventDefault();
        
        var quanwen  = $(this).siblings('.task-prog-detail');
        quanwen.toggleClass('in3line');
        
        $(this).find('span').text(quanwen.hasClass('in3line')?'更多>':'收起∧');
    });
    
})($);
 /**
 * 详情：状态  state,未接受：0,整改中：1,超时：2,审核中：3,关闭：4
 * @param {Object} data
 */
function loadDutyDetail(layer) {
    //从列表页存入缓存的id
    var dataId = appcan.locStorage.getVal("dataId");
    var json = {
        path: serverPath + "focDutyFeedbackInfo.do?focGetDutyInfoDesc",
        data: {
            infoId: dataId,
             userId:appcan.locStorage.getVal("userID")
        },
        layer: layer,
        layerErr: false
    };
    ajaxRequest(json, function(data, e) {
         var recvdepartinfo=new Array();
        if (e == "success") {
            vm.nonet = false;
            data.obj.dutyProblemTime=data.obj.create_time;
            if(data.obj.create_time!=0&&isDefine(data.obj.create_time)){
                data.obj.create_time = timeStemp(data.obj.create_time, 'MM-dd HH:mm').commonDate;
            }else{
                data.obj.create_time='- -';
            };
            if(data.obj.finish_time!=0&&isDefine(data.obj.finish_time)){
                data.obj.finish_time = timeStemp(data.obj.finish_time, 'yyyy-MM-dd').date;
            }else {
                data.obj.finish_time='- -';
            };
            if(data.obj.pre_finish_time!=0&&isDefine(data.obj.pre_finish_time)){
                data.obj.pre_finish_time = timeStemp(data.obj.pre_finish_time, 'yyyy-MM-dd').date;
            }else{
               data.obj.pre_finish_time="- -"; 
            };
            data.obj.content = unescape(data.obj.content);
            //责任单位总数
            vm.allrecvdepartlength=data.obj.recvdepartinfos.length;
            //isSend：0代表接收的问题，1代表指派的问题            
           if(appcan.locStorage.getVal("isSend")==0){
               //记录责任单位完成数量
              for(var i=0;i<data.obj.recvdepartinfos.length;i++){
                if(data.obj.recvdepartinfos[i].state=='3'||data.obj.recvdepartinfos[i].state=='4'){
                    recvdepartinfo.push(data.obj.recvdepartinfos[i]);
                   }   
                //判断部门id和责任单位id是否一致   
               if(appcan.locStorage.getVal("deptId")==data.obj.recvdepartinfos[i].recv_depart_id){
                      if(data.obj.recvdepartinfos[i].state=='0'){//未接受
                          if(data.obj.state=='4'||data.obj.state=='5'||data.obj.state=='6'){
                                vm.isClose=true;
                                data.obj.statetext='已关闭';
                                vm.stateShow.text='已关闭';
                          }else{
                                vm.isCopy=true;
                                data.obj.statetext='未接受';
                            }       
                        }else if(data.obj.recvdepartinfos[i].state=='1'){//整改中
                                 vm.islook=true;//整改中按钮颜色
                                 vm.isFinish=true;
                                 data.obj.statetext=data.obj.recvdepartinfos[i].state_text;
                        }else if(data.obj.recvdepartinfos[i].state=='2'){//超时
                                vm.isTimeout=true;
                                data.obj.statetext='已超时';
                        }else if(data.obj.recvdepartinfos[i].state=='3'&&data.obj.state!='3'){//审核中
                                 vm.islook=true;
                                 data.obj.statetext='整改中';
                        }else if(data.obj.recvdepartinfos[i].state=='4'||data.obj.recvdepartinfos[i].state=='5'||data.obj.recvdepartinfos[i].state=='6'){
                                 vm.isClose=true;
                                 data.obj.statetext='已关闭'; //关闭
                                 vm.stateShow.text='已关闭';
                        }
                    }
                   }
               }else{
                   //记录责任单位完成数量
                   for(var i=0;i<data.obj.recvdepartinfos.length;i++){
                       if(data.obj.recvdepartinfos[i].state=='3'||data.obj.recvdepartinfos[i].state=='4'){
                        recvdepartinfo.push(data.obj.recvdepartinfos[i]);
                   } 
                  }
                  //isSend为1时执行的状态控制
                   if(data.obj.state=='0'){
                         vm.isCopy=true;
                         data.obj.statetext='未接受'
                     }
                     else if(data.obj.state=='1'){
                        vm.isFinish=true;
                        vm.islook=true;
                    }else if(data.obj.state=='2'){
                        vm.isTimeout=true;
                        data.obj.statetext='已超时';
                    }else if(data.obj.state=='3'){
                        vm.isShow=true;
                        data.obj.statetext='待审核';
                    }else if(data.obj.state=='4'||data.obj.state=='5'||data.obj.state=='6'){
                        vm.isClose=true;
                        data.obj.statetext='已关闭';
                        vm.stateShow.text='已关闭';
                    }
               } 
                //审核按钮显示
                if(data.obj.state=='3'){
                    vm.isView=true;
                    vm.isShow=true;
                    vm.stateShow.text='待审核';
                    data.obj.statetext='待审核';
                }
                //判断是否是聊天转发过来的
                if(appcan.locStorage.getVal("chatFromdutyProblemButton")=='1'){
                    buttonCtrl();     
                    appcan.locStorage.setVal("dutyProblemButton",'1');
                    appcan.locStorage.remove("chatFromdutyProblemButton");
                }else{
                    appcan.locStorage.remove("dutyProblemButton");
                    //关闭状态进展不能添加
                    if(vm.isClose==true){
                         vm.srcName=false;
                         vm.isrecive=false;
                    }else {
                        //判断任务来源人和指派人不能添加进展
                        if((appcan.locStorage.getVal("userID")!=data.obj.task_src_id)&&(data.obj.user_id!=appcan.locStorage.getVal("userID"))){
                             vm.srcName=true;
                             vm.isrecive=true;
                         }else{
                             vm.srcName=false;
                             vm.isrecive=false; 
                         }
                    } 
                }
                
            //完成责任单位数量
            vm.recvdepartlength=recvdepartinfo.length;
            //图片路径
            if(isDefine(data.obj.filesinfos)){
                
                for(var j=0;j<data.obj.filesinfos.length;j++){
                    
                    data.obj.filesinfos[j].file_path=serverPath + data.obj.filesinfos[j].file_path;
                }
            }else{
                vm.picShow=true;
            }
            
            vm.problemDetail = data.obj;
        } else {
            vm.nonet = true;
        }
    });
    
 /**
 * 进展 
 * @param {Object} data
 */
    var taskDynamicJson = {
        path: serverPath + "focDutyFeedbackInfo.do?focGetDutyProcessInfo",
        data: {
            page: 1,
            size: 1000,
            infoId: appcan.locStorage.getVal("dataId"),
             userId:appcan.locStorage.getVal("userID")
        },
        layer: false,
        layerErr: false
    }
    ajaxRequest(taskDynamicJson, function(data, e) {
        if (e == "success") {
            var replyData = new Array()
            for (var i = 0; i < data.obj.length; i++) {
                data.obj[i].dept = data.obj[i].departname;
                data.obj[i].time = timeStemp(data.obj[i].create_time, 'MM-dd HH:mm').commonDate;
                if (data.obj[i].process_status == 0) {
                        data.obj[i].status = "指派了";
                        data.obj[i].reply='';
                    } else if (data.obj[i].process_status == 1) {
                        data.obj[i].status = "接受了";
                        data.obj[i].flag = 1;
                        data.obj[i].reply=filterBrow(unescape(data.obj[i].content));
                    } else if (data.obj[i].process_status == 2) {
                        data.obj[i].status = "待审核";
                        data.obj[i].flag = 1;
                        data.obj[i].reply=filterBrow(unescape(data.obj[i].content));
                    }else if(data.obj[i].process_status == 3){
                        data.obj[i].status = "审核不通过";
                        data.obj[i].flag = 1;
                         data.obj[i].reply=filterBrow(unescape(data.obj[i].content));
                    }else if(data.obj[i].process_status == 4){
                        data.obj[i].status = "审核通过";
                        data.obj[i].flag = 2;
                         data.obj[i].content='';
                    }else{
                        data.obj[i].flag = 1;
                        data.obj[i].reply = filterBrow(unescape(data.obj[i].content));
                        data.obj[i].status = "添加了";
                        replyData.push(data.obj[i]);
                    }
            };
            vm.progress = data.obj;
            vm.repaly = replyData;
        }
    });
    /**
     * 回复ajax 
     * @param {Object} data
     */
    var commentJson = {
        path: serverPath + "focDutyFeedbackInfo.do?focGetInfoCommentsList",
        data: {
            infoId: appcan.locStorage.getVal("dataId"),
            userId:appcan.locStorage.getVal("userID")
        },
        layer: false,
        layerErr: false
    }
    ajaxRequest(commentJson, function(data, e) {
        if (e == "success") {  
            for (var i = 0; i < data.obj.length; i++) {
                var commentReplyData = new Array();
                var timer=null;
                if(isDefine(data.obj[i].createTime)){
                    timer=timeStemp(data.obj[i].createTime, 'MM-dd HH:mm').commonDate;
                }
                data.obj[i].createTime = timer;
                data.obj[i].reply = unescape(JSON.parse(data.obj[i].content).content);
                if(isDefine(JSON.parse(data.obj[i].content).img)){
                    data.obj[i].img = serverPath+JSON.parse(data.obj[i].content).img;
                }else{
                    data.obj[i].img=false;
                }
                if(data.obj[i].pcidList!=null){
                    commentReplyData = data.obj[i].pcidList;
                for (var j = 0; j < commentReplyData.length; j++) {
                    commentReplyData[j].time = timeStemp(commentReplyData[j].createTime, 'MM-dd HH:mm').commonDate;
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
            path: serverPath + "focDutyFeedbackInfo.do?focSaveProcess",
            data: {
                infoId: appcan.locStorage.getVal("dataId"),
                content: escape(text),
                userId:appcan.locStorage.getVal("userID")
            },
            layer: false
        };
        ajaxRequest(json, function(data, e) {
            if (e == "success") {
                loadDutyDetail(false);
                uexInputTextFieldView.close();
            }
        })
    } else if (flag == 2) {
        var json1 = {
            content:escape(text)
            } 
        var json = {
            path: serverPath + "focDutyFeedbackInfo.do?focDoAdd",
            data: {
                userId:appcan.locStorage.getVal("userID"),
                pcid:appcan.locStorage.getVal("pcid"),
                puserid:appcan.locStorage.getVal("departId"),
                infoId:appcan.locStorage.getVal("dataId"),
                content:JSON.stringify(json1)
            },
            layer: false
        };
        ajaxRequest(json, function(data, e) {
            if (e == "success") {
                loadDutyDetail(false);
                uexInputTextFieldView.close();
            }
        })
    }

}
/**
 * 在聊天中打开进展等按钮隐藏
 * @param {Object} data
 */
function buttonCtrl(){
    vm.isrecive=false;
    vm.srcName=false;
    vm.isView=false;
    vm.isFinish=false;
    vm.isDutyCount=false;
    vm.dutyFlag=false;
}
