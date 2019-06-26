//转发聊天消息的处理逻辑
//f是判断是否新建群 0不需1需要
var textRegN = new RegExp("\\n", "g");
var textRegR = new RegExp("\\r", "g");
function forwardMessage(f){
    var confirmContent = '';
    var chatMessageOnlong = JSON.parse(appcan.locStorage.getVal('chatMessageOnlong'));
    //为空时表示是转发消息。为1时表示从值班问题过来的。为0时表示从任务过来的。
    var chatDutyProblem=$.trim(appcan.locStorage.getVal('chatDutyProblem'));
    if(!isDefine(chatDutyProblem)){
        //以下数据测试用
        if(chatMessageOnlong.ownerType=='text'){
            confirmContent = '<div class="in3line"><span class="fz-md fc-title">'+filterBrow(chatMessageOnlong.messageBody.text)+'</span></div>';
        }
        if(chatMessageOnlong.ownerType=='image'){
            confirmContent = '<img src="'+chatMessageOnlong.messageBody.remotePath+'">';
        }
        if(chatMessageOnlong.ownerType=='video'){
            confirmContent = '<img src="'+chatMessageOnlong.messageBody.thumbnailRemotePath+'">';
        }if(chatMessageOnlong.ownerType=='file'){
            confirmContent = '<div class="in3line"><span class="fz-md fc-title">'+'已选择文件名：'+chatMessageOnlong.messageBody.displayName+'</span></div>';
        }if(chatMessageOnlong.ownerType=='dutyProblem'){
            var dutyProblemContent=chatMessageOnlong.messageBody.text.split("#")[1];
            var dutyProblemRecvdepart=chatMessageOnlong.messageBody.text.split("#")[2];
            var dutyProblemTime=chatMessageOnlong.messageBody.text.split("#")[3];
            var dataId=chatMessageOnlong.messageBody.text.split("#")[4];
            confirmContent = '<div class="in3line"><span class="fz-md fc-title">'+dutyProblemContent+'</span><span class="fz-md fc-title"><br>责任部门：'+dutyProblemRecvdepart+'   '+dutyProblemTime+'</span></div>';
        }
        if(chatMessageOnlong.ownerType=='taskShare'){
            var taskSendContent=chatMessageOnlong.messageBody.text.split("#")[1];
            var taskReceiveInfoStr=chatMessageOnlong.messageBody.text.split("#")[2];
            var taskSendTime=chatMessageOnlong.messageBody.text.split("#")[3];
            if(!isNaN(taskSendTime)){
                taskSendTime=timeStemp(Number(taskSendTime), 'MM-dd HH:mm').commonDate;
            }
            var dataId=chatMessageOnlong.messageBody.text.split("#")[4];
            confirmContent = '<div class="in3line"><span class="fz-md fc-title">'+taskSendContent+'</span><span class="fz-md fc-title"><br>执行人：'+taskReceiveInfoStr+'   '+taskSendTime+'</span></div>';
        }
        addConfirm({
            title: '确定转发该聊天内容吗？',
            content: confirmContent,
            yes: function(i){
                var from = appcan.locStorage.getVal('forwardto');
                if(f == 0){
                    dailogForward(0,0);
                    
                    appcan.window.publish("reloadRecentFromForward","reloadRecentFromForward");
                    var isAddress=appcan.locStorage.getVal("isAddress");
                    var closeArr = ['chat-dialog','chat-forward'];
                    if(isAddress=="true"){
                        closeArr = ['chat-forward'];
                    }
                    //var closeArr = [ 'chat-dialog','chat-forward'];
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
                }else if(f == 1){
                    //建群
                    dailogForward(1,0);
                    appcan.window.publish("reloadRecentFromForward","reloadRecentFromForward");
                    var isAddress=appcan.locStorage.getVal("isAddress");
                    var closeArr = ['chat-dialog','address-pick','chat-forward'];
                    if(isAddress=="true"){
                        closeArr = ['address-pick','chat-forward'];
                    }
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
                }
                layerRemove(i);
            },
            no: function(i){
                layerRemove(i);
            }
        });
    }
    else if(chatDutyProblem=="1"){
        //值班问题责任部门
        var dutyProblemRecvdepart = appcan.locStorage.getVal("dutyProblemRecvdepart");
        //值班问题提交时间
        var dutyProblemTime = appcan.locStorage.getVal("dutyProblemTime");
         if(!isNaN(dutyProblemTime)){
                dutyProblemTime=timeStemp(Number(dutyProblemTime), 'MM-dd HH:mm').commonDate;
        }
        //值班问题正文
        var dutyProblemContent = appcan.locStorage.getVal("dutyProblemContent");
        confirmContent = '<div class="in3line"><span class="fz-md fc-title">'+dutyProblemContent+'</span><span class="fz-md fc-title"><br>责任部门：'+dutyProblemRecvdepart+'   '+dutyProblemTime+'</span></div>';
        addConfirm({
            title: '确定分享值班问题到聊天嘛？',
            content: confirmContent,
            yes: function(i){
                var from = appcan.locStorage.getVal('forwardto');
                if(f == 0){
                    dailogForward(0,1);
                    appcan.locStorage.remove('chatDutyProblem');
                    //appcan.window.publish("reloadRecentFromForward","reloadRecentFromForward");
                    appcan.window.publish("confirmDutyProblem","confirmDutyProblem");
                    var isAddress=appcan.locStorage.getVal("isAddress");
                    var closeArr = [ 'chat-dialog','chat-forward'];
                    if(isAddress=="true"){
                        closeArr = ['chat-forward'];
                    }
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
                }else if(f == 1){
                    //建群
                    dailogForward(1,1);
                    appcan.locStorage.remove('chatDutyProblem');
                    //appcan.window.publish("reloadRecentFromForward","reloadRecentFromForward");
                    appcan.window.publish("confirmDutyProblem","confirmDutyProblem");
                    var isAddress=appcan.locStorage.getVal("isAddress");
                    var closeArr = ['chat-dialog','address-pick','chat-forward'];
                    if(isAddress=="true"){
                        closeArr = ['address-pick','chat-forward'];
                    }
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
                }
                layerRemove(i);
            },
            no: function(i){
                layerRemove(i);
            }
        });
    }
    else if(chatDutyProblem=="0"){
        var taskReceiveInfoStr=appcan.locStorage.getVal("taskReceiveInfoStr");
        //任务创建时间
        var taskSendTime=appcan.locStorage.getVal("taskSendTime");
        if(!isNaN(taskSendTime)){
                taskSendTime=timeStemp(Number(taskSendTime), 'MM-dd HH:mm').commonDate;
        }
        //任务问题正文
        var taskSendContent=appcan.locStorage.getVal("taskSendContent");
        confirmContent = '<div class="in3line"><span class="fz-md fc-title">'+taskSendContent+'</span><span class="fz-md fc-title"><br>执行人：'+taskReceiveInfoStr+'   '+taskSendTime+'</span></div>';
        addConfirm({
            title: '确定分享任务到聊天嘛？',
            content: confirmContent,
            yes: function(i){
                var from = appcan.locStorage.getVal('forwardto');
                if(f == 0){
                    dailogForward(0,2);
                    appcan.locStorage.remove('chatDutyProblem');
                    //appcan.window.publish("reloadRecentFromForward","reloadRecentFromForward");
                    appcan.window.publish("confirmTashShare","confirmTashShare");
                    var isAddress=appcan.locStorage.getVal("isAddress");
                    var closeArr = [ 'chat-dialog','chat-forward'];
                    if(isAddress=="true"){
                        closeArr = ['chat-forward'];
                    }
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
                }else if(f == 1){
                    //建群
                    dailogForward(1,2);
                    appcan.locStorage.remove('chatDutyProblem');
                    //appcan.window.publish("reloadRecentFromForward","reloadRecentFromForward");
                    appcan.window.publish("confirmTashShare","confirmTashShare");
                    var isAddress=appcan.locStorage.getVal("isAddress");
                    var closeArr = ['chat-dialog','address-pick','chat-forward'];
                    if(isAddress=="true"){
                        closeArr = ['address-pick','chat-forward'];
                    }
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
                }
                layerRemove(i);
            },
            no: function(i){
                layerRemove(i);
            }
        });
        
        
    }
    
    
    
    
    
}
function dailogForward(w,h){
    
    var chatMessageOnlong = JSON.parse(appcan.locStorage.getVal('chatMessageOnlong'));
    if(w==0){
        //要转发的人
        for (var i=0; i < vm.recentPick.length; i++) {
            var MyMessageId=uuid(36,32);
            if(h==0){
                if(chatMessageOnlong.ownerType=='text'){
                    var param = {
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":chatMessageOnlong.messageBody.text.replace(textRegN, "<br>").replace(textRegR, "<br>"),//文本内容
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                        //"pushTitle":appTitle
                     };
                     uexEasemob.sendText(param);
                }
                if(chatMessageOnlong.ownerType=='image'){
                    var platForm = appcan.locStorage.getVal("platForm");
                    var wAndH="";
                    var ext=chatMessageOnlong.ext;
                    var orientation=0;
                    if(ext.indexOf("@")!=-1){
                        if(ext.split("@").length>=3){
                            orientation=ext.split("@")[2];
                        }
                    }
                    if(ext.indexOf("#")!=-1){
                        if(ext.split("#").length>=3){
                            orientation=ext.split("#")[2];
                        }
                    }
                    
                    if(chatMessageOnlong.messageBody.hasOwnProperty("height")){
                     wAndH="#"+chatMessageOnlong.messageBody.height+"#"+chatMessageOnlong.messageBody.width;
                    }
                    
                    var param={
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":"Picture#"+chatMessageOnlong.messageBody.remotePath+wAndH,//图片文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId+"#"+orientation,
                        "forceNotification":true
                     };
                    uexEasemob.sendText(param);
                }
                if(chatMessageOnlong.ownerType=='video'){
                    var param = {
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":"Video#"+chatMessageOnlong.messageBody.remotePath+"#"+chatMessageOnlong.messageBody.thumbnailRemotePath,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }
                if(chatMessageOnlong.ownerType=='file'){
                    var fileName="";
                    var files=chatMessageOnlong.messageBody.displayName;
                        fileName=files.substring(0,files.length-(files.split(".")[files.split(".").length-1]).length-1);
                    var param = {
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":"File#"+chatMessageOnlong.messageBody.remotePath+"#"+chatMessageOnlong.messageBody.thumbnailRemotePath+"#"+chatMessageOnlong.messageBody.displayName,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId+"#"+fileName+new Date().getTime()+"."+chatMessageOnlong.messageBody.displayName.split(".")[chatMessageOnlong.messageBody.displayName.split(".").length-1],
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }if(chatMessageOnlong.ownerType=='dutyProblem'){
                    var param = {
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":chatMessageOnlong.messageBody.text,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }if(chatMessageOnlong.ownerType=='taskShare'){
                    var param = {
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":chatMessageOnlong.messageBody.text,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }
            }
            //值班问题
            if(h==1){
                    //值班问题责任部门
                    var dutyProblemRecvdepart = appcan.locStorage.getVal("dutyProblemRecvdepart");
                    //值班问题提交时间
                    var dutyProblemTime = appcan.locStorage.getVal("dutyProblemTime");
                    //值班问题正文
                    var dutyProblemContent = appcan.locStorage.getVal("dutyProblemContent");
                    var param = {
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":"DutyProblem#"+dutyProblemContent+"#"+ dutyProblemRecvdepart+"#"+dutyProblemTime+"#"+appcan.locStorage.getVal("dataId") ,//文本内容
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                        //"pushTitle":appTitle
                     };
                     uexEasemob.sendText(param);
            }
            //任务
            if(h==2){
                    var taskReceiveInfoStr=appcan.locStorage.getVal("taskReceiveInfoStr");
                    //任务创建时间
                    var taskSendTime=appcan.locStorage.getVal("taskSendTime");
                    //任务问题正文
                    var taskSendContent=appcan.locStorage.getVal("taskSendContent");
                    var param = {
                        "username":vm.recentPick[i].chatter,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":vm.recentPick[i].chatType,//0-单聊,1-群聊
                        "content":"TaskShare#"+taskSendContent+"#"+ taskReceiveInfoStr+"#"+taskSendTime+"#"+appcan.locStorage.getVal("taskId") ,//文本内容
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                        //"pushTitle":appTitle
                     };
                     uexEasemob.sendText(param);
            }
            
        }; 
    }else{
        //要转发的人
        for (var i=0; i < vm.peoplePick.length; i++) {
            var MyMessageId=uuid(36,32);
            if(h==0){
                if(chatMessageOnlong.ownerType=='text'){
                    var param = {
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":chatMessageOnlong.messageBody.text.replace(textRegN, "<br>").replace(textRegR, "<br>"),//文本内容
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                        //"pushTitle":appTitle
                     };
                     uexEasemob.sendText(param);
                }
                if(chatMessageOnlong.ownerType=='image'){
                    var platForm = appcan.locStorage.getVal("platForm");
                    var wAndH="";
                    
                        if(chatMessageOnlong.messageBody.hasOwnProperty("height")){
                         wAndH="#"+chatMessageOnlong.messageBody.height+"#"+chatMessageOnlong.messageBody.width;
                        }
                    
                    var ext=chatMessageOnlong.ext;
                    var orientation=0;
                    if(ext.indexOf("@")!=-1){
                        if(ext.split("@").length>=3){
                            orientation=ext.split("@")[2];
                        }
                    }
                    if(ext.indexOf("#")!=-1){
                        if(ext.split("#").length>=3){
                            orientation=ext.split("#")[2];
                        }
                    }
                    
                    var param={
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":"Picture#"+chatMessageOnlong.messageBody.remotePath+wAndH,//图片文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId+"#"+orientation,
                        "forceNotification":true
                     };
                    uexEasemob.sendText(param);
                }
                if(chatMessageOnlong.ownerType=='video'){
                    var param = {
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":"Video#"+chatMessageOnlong.messageBody.remotePath+"#"+chatMessageOnlong.messageBody.thumbnailRemotePath,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }if(chatMessageOnlong.ownerType=='file'){
                    
                    var fileName="";
                    var files=chatMessageOnlong.messageBody.displayName;
                        fileName=files.substring(0,files.length-(files.split(".")[files.split(".").length-1]).length-1);
                    var param = {
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":"File#"+chatMessageOnlong.messageBody.remotePath+"#"+chatMessageOnlong.messageBody.thumbnailRemotePath+"#"+chatMessageOnlong.messageBody.displayName,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId+"#"+fileName+new Date().getTime()+"."+chatMessageOnlong.messageBody.displayName.split(".")[chatMessageOnlong.messageBody.displayName.split(".").length-1],
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }if(chatMessageOnlong.ownerType=='dutyProblem'){
                    var param = {
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":chatMessageOnlong.messageBody.text,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }
                if(chatMessageOnlong.ownerType=='taskShare'){
                    var param = {
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":chatMessageOnlong.messageBody.text,//视频文件路径
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                    };
                    uexEasemob.sendText(param);
                }
            }
            if(h==1){
                    //值班问题责任部门
                    var dutyProblemRecvdepart = appcan.locStorage.getVal("dutyProblemRecvdepart");
                    //值班问题提交时间
                    var dutyProblemTime = appcan.locStorage.getVal("dutyProblemTime");
                    //值班问题正文
                    var dutyProblemContent = appcan.locStorage.getVal("dutyProblemContent");
                    var param = {
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":"DutyProblem#"+dutyProblemContent+"#"+ dutyProblemRecvdepart+"#"+dutyProblemTime+"#"+appcan.locStorage.getVal("dataId"),//文本内容
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                     };
                     uexEasemob.sendText(param);
            }
            //任务
            if(h==2){
                    var taskReceiveInfoStr=appcan.locStorage.getVal("taskReceiveInfoStr");
                    //任务创建时间
                    var taskSendTime=appcan.locStorage.getVal("taskSendTime");
                    //任务问题正文
                    var taskSendContent=appcan.locStorage.getVal("taskSendContent");
                    var param = {
                        "username":vm.peoplePick[i].userCode,//单聊时聊天人的userid或者群聊时groupid
                        "chatType":'0',//0-单聊,1-群聊
                        "content":"TaskShare#"+taskSendContent+"#"+ taskReceiveInfoStr+"#"+taskSendTime+"#"+appcan.locStorage.getVal("taskId") ,//文本内容
                        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
                        "forceNotification":true
                        //"pushTitle":appTitle
                     };
                     uexEasemob.sendText(param);
            }
        }; 
    }
}
function uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
     
        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          // rfc4122, version 4 form
          var r;
     
          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
     
          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
     
        return uuid.join('');
}