
function onNotification(msg){
    /*
    alert(JSON.stringify(msg));
         appcan.file.write({
                     filePath:'file:///sdcard/鏁版嵁.txt',
                     content:JSON.stringify(msg),
                     callback:function(err){
                     }
                 });*/
            //    alert(JSON.stringify(msg));
    var flag=msg.MESSAGE;
    //获取当前登录人帐号
    var userCode=appcan.locStorage.getVal("userCode"); 
    var uName=appcan.locStorage.getVal("userName"); 
    //判断是新消息，还是自己发送的消息回调，还是撤回的消息
    if(flag=="New"){
       
        //表示是新消息
        var messageReceiveJson=msg;
        //数组中我自己的数据如果有发送的时间大于当前消息的时间时不展示
        if(vm.Chat.length>0){
            if(Number(messageReceiveJson.messageTime)<=Number(vm.Chat[vm.Chat.length-1].messageTime)){
                return false;
            }
        }
        //消息类型0:单聊；1：群聊
        var chatType=messageReceiveJson.chatType;
        //from从哪里来
        var chatFrom=messageReceiveJson.from;
        //消息发送昵称
        var extFrom=messageReceiveJson.ext;
        
        var isOnAt=true;
        if(extFrom.indexOf("@")!=-1){
            extFrom=extFrom.split("@")[0];
            //自己定义消息的来源是谁
            messageReceiveJson.chatFromUser=extFrom;
            isOnAt=true;
        }if(extFrom.indexOf("#")!=-1){
            extFrom=extFrom.split("#")[0];
            //自己定义消息的来源是谁
            messageReceiveJson.chatFromUser=extFrom;
            isOnAt=false;
        }
        //表示不是撤回的消息
        messageReceiveJson.isRevoke=false;
        messageReceiveJson.isOthers=true;
        //不知道干什么用的
        var isAcked=messageReceiveJson.isAcked;
        //是不是群
        var isGroup=messageReceiveJson.isGroup;
        //有没有读0：未读；1：已读
        var isRead=messageReceiveJson.isRead;
        //消息主题
        var messageBody=messageReceiveJson.messageBody;
        //消息id
        var messageId=messageReceiveJson.messageId;
        //判断页面元素有没有，有则不渲染。
        var newMessageDom=$("#"+messageId);
        if(newMessageDom.length>0){
            return ;
        }
        //消息发送时间，毫秒为单位
        var messageTime=messageReceiveJson.messageTime;
        //消息类型：text/video/audio/image/location/file/cmd
        var messageType=messageReceiveJson.messageType;
        //自己定义是否隐藏消息发送状态,别人的消息都要隐藏
        messageReceiveJson.chatStatus=true;
        //接受人
        var to=messageReceiveJson.to;
        var text;
        var platForm = appcan.locStorage.getVal("platForm");
        //处理头像信息
        var headerImg= disposeHeadImg(chatFrom).headImgPath;
        if(isDefine(headerImg)){
             messageReceiveJson.hashead=true;
             messageReceiveJson.headerImg=serverPath+headerImg;
        }else{
             messageReceiveJson.hashead=false;
             messageReceiveJson.headtext = extFrom.substr(-2,2);
             messageReceiveJson.headbgclass=getHeadClass(disposeHeadImg(chatFrom).userId);
        }
        messageReceiveJson.sendMsgTimeHide=false;
        if(vm.Chat.length>0){
            if(Number(messageTime)-Number(vm.Chat[vm.Chat.length-1].messageTime)> 2*60*1000){
                    messageReceiveJson.sendMsgTime=timeStemp(Number(messageTime),"MM-dd HH:mm").commonDate;
                    messageReceiveJson.sendMsgTimeHide=true;
            }
        }else{
            messageReceiveJson.sendMsgTime=timeStemp(Number(messageTime),"MM-dd HH:mm").commonDate;
            messageReceiveJson.sendMsgTimeHide=true;
        }
        //表示不是撤回的消息
        messageReceiveJson.isRevoke=false;
        messageReceiveJson.isHide=false;
        if(chatType==peopleChatType){
                if(to==groupChatId||chatFrom==groupChatId){
                    //表示消息为文本类，但是其中包含转发的消息图片和视频
                    if(messageType=="text"){
                        text = messageBody.text;
                        //转发的图片
                        if(text.indexOf("Picture#")!=-1){
                            //自己定义的消息类型
                            messageReceiveJson.ownerType="image";
                            var thisSrc=text.split("#")[1];
                            var orientation=0;
                            if(isOnAt){
                                if(messageReceiveJson.ext.split("@").length>=3)
                                {
                                    orientation=messageReceiveJson.ext.split("@")[2];
                                }
                            }else{
                                if(messageReceiveJson.ext.split("#").length>=3)
                                {
                                    orientation=messageReceiveJson.ext.split("#")[2];
                                }
                            }
                            messageReceiveJson.messageBody.orientation=orientation;
                            messageReceiveJson.messageBody.thumbnailRemotePath=thisSrc;
                            messageReceiveJson.messageBody.remotePath=thisSrc;
                               if(text.split("#").length>2){
                                var height=text.split("#")[2];
                                var width=text.split("#")[3];
                                messageReceiveJson.messageBody.height=height;
                                messageReceiveJson.messageBody.width=width;
                                }
                            getImgHeight(messageReceiveJson.messageBody);
                            
                            jsonPicArrayNew.push(thisSrc);
                            
                            //将消息放入数组中
                            vm.Chat.push(messageReceiveJson);
                        }
                        if(text.indexOf("Video#")!=-1){
                            //自己定义的消息类型
                            messageReceiveJson.ownerType="video";
                            var thisSrc=text.split("#")[1];
                            var videoimg=text.split("#")[2];
                            messageReceiveJson.messageBody.thumbnailRemotePath= videoimg;
                            getImgHeight(messageReceiveJson.messageBody);
                            //视频缩略图
                            messageReceiveJson.messageBody.remotePath=thisSrc;
                             
                            //将消息放入数组中
                            vm.Chat.push(messageReceiveJson);
                            
                            
                        }
                        if(text.indexOf("File#")!=-1){
                            //自己定义的消息类型
                            messageReceiveJson.ownerType="file";
                            var thisSrc=text.split("#")[1];
                            var displayName=text.split("#")[3];
                            messageReceiveJson.messageBody.displayName= displayName;
                            messageReceiveJson.messageBody.suffix=messageReceiveJson.messageBody.displayName.split(".")[messageReceiveJson.messageBody.displayName.split(".").length-1];
                            messageReceiveJson.messageBody.fileSize='';
                            var messageFileName="";
                            if(!isOnAt){
                                messageFileName=messageReceiveJson.ext.split("#")[2];
                            }else{
                                messageFileName=messageReceiveJson.ext.split("@")[2];
                            }
                            var ret = uexFileMgr.isFileExistByPath("wgts://"+messageFileName);
                            if(!ret){
                                messageBody.hasReciveText="未接收";
                            }else{
                                messageBody.hasReciveText="已接收";
                            }
                            //视频缩略图
                            messageReceiveJson.messageBody.remotePath=thisSrc;
                             
                            //将消息放入数组中
                            vm.Chat.push(messageReceiveJson);
                            
                            
                        }
                        if(text.indexOf("DutyProblem#")!=-1){
                            //自己定义的消息类型
                            messageReceiveJson.ownerType="dutyProblem";
                            var dutyProblemContent=text.split("#")[1];
                            var dutyProblemRecvdepart=text.split("#")[2];
                            var dutyProblemTime;
                            if(isNaN(text.split("#")[3])){
                                dutyProblemTime=text.split("#")[3];
                            }else{
                                dutyProblemTime=timeStemp(Number(text.split("#")[3]), 'MM-dd HH:mm').commonDate;
                            }
                            var dataId=text.split("#")[4];
                            messageReceiveJson.messageBody.dutyText="【值班问题】"+dutyProblemContent;
                            messageReceiveJson.messageBody.dutyProblemTime=dutyProblemTime;
                            messageReceiveJson.messageBody.dataId=dataId;
                            messageReceiveJson.messageBody.dutyProblemRecvdepart=dutyProblemRecvdepart;
                            //将消息放入数组中
                            vm.Chat.push(messageReceiveJson);
                            
                            
                        }
                        if(text.indexOf("TaskShare#")!=-1){
                            //自己定义的消息类型
                            messageReceiveJson.ownerType="taskShare";
                            var taskSendContent=text.split("#")[1];
                            var taskReceiveInfoStr=text.split("#")[2];
                            var taskSendTime;
                            if(isNaN(text.split("#")[3])){
                                taskSendTime=text.split("#")[3];
                            }else{
                                taskSendTime=timeStemp(Number(text.split("#")[3]), 'MM-dd HH:mm').commonDate;
                            }
                            //var taskSendTime=text.split("#")[3];
                            var dataId=text.split("#")[4];
                            messageReceiveJson.messageBody.taskText="【任务】"+taskSendContent;
                            
                            messageReceiveJson.messageBody.taskSendTime=taskSendTime;
                            messageReceiveJson.messageBody.dataId=dataId;
                            messageReceiveJson.messageBody.taskReceiveInfoStr=taskReceiveInfoStr;
                            //将消息放入数组中
                            vm.Chat.push(messageReceiveJson);
                            
                        }
                        if(text.indexOf("Picture#")==-1 && text.indexOf("Video#")==-1 && text.indexOf("File#")==-1 && text.indexOf("DutyProblem#")==-1 && text.indexOf("TaskShare#")==-1){
                            //自己定义的消息类型
                            messageReceiveJson.ownerType="text";
                            var t=filterBrow(messageReceiveJson.messageBody.text);
                            messageReceiveJson.messageBody.text=t;
                            
                            //将消息放入数组中
                            vm.Chat.push(messageReceiveJson);
                        }
                    }
                    if(messageType=="image"){
                        //自己定义的消息类型
                        messageReceiveJson.ownerType="image";
                        //图片远程地址
                        var remotePath=messageBody.remotePath;
                        var orientation=0;
                        if(!isOnAt){
                            var imgArr=messageReceiveJson.ext.split("#");
                            if(imgArr.length>=3){
                                orientation=imgArr[2];
                            }
                        }else{
                            var imgArr=messageReceiveJson.ext.split("@");
                            if(imgArr.length>=3){
                                orientation=imgArr[2];
                            }
                        }
                        messageBody.orientation=orientation;
                        //将图片的信息放到jsonPicArray数组中一共图片查看器插件使用
                        jsonPicArrayNew.push(remotePath); 
                         getImgHeight(messageReceiveJson.messageBody);
                        //将消息放入数组中
                        vm.Chat.push(messageReceiveJson);
                    }
                    if(messageType=="audio"){
                        //自己定义的消息类型
                        messageReceiveJson.ownerType="audio";
                        var audioS=0;
                        if(isOnAt){
                            audioS=messageReceiveJson.ext.split("@")[2];
                        }else{
                            audioS=messageReceiveJson.ext.split("#")[2];
                        }
                        messageReceiveJson.audioS=audioS;
                        messageReceiveJson.audioL=calVoiceLength(audioS);
                        messageReceiveJson.isPlay=false;
                        //将消息放入数组中
                        vm.Chat.push(messageReceiveJson);
                    }
                    if(messageType=="video"){
                        //自己定义的消息类型
                        messageReceiveJson.ownerType="video";
                         
                        //将消息放入数组中
                        vm.Chat.push(messageReceiveJson);
                    }
                    if(messageType=="file"){
                        //自己定义的消息类型
                        messageReceiveJson.ownerType="file";
                        messageBody.suffix=messageBody.displayName.split(".")[messageBody.displayName.split(".").length-1];
                        messageBody.fileSize='';
                        var messageFileName="";
                        if(!isOnAt){
                            messageFileName=messageReceiveJson.ext.split("#")[2];
                        }else{
                            messageFileName=messageReceiveJson.ext.split("@")[2];
                        }
                        var ret = uexFileMgr.isFileExistByPath("wgts://"+messageFileName);
                        if(!ret){
                            messageBody.hasReciveText="未接收";
                        }else{
                            messageBody.hasReciveText="已接收";
                        }
                        //将消息放入数组中
                        vm.Chat.push(messageReceiveJson);
                    }
                    Vue.nextTick(function () {
                      if(flag1){
                          //获取滚动条现在的位置。
                          var windScrollTop=$(window).scrollTop();
                          //获取最后一条消息节点的offsetTop,
                          var lastMessageScrollTop=$("#"+vm.Chat[vm.Chat.length-1].messageId).offset().top;
                          //如果最后一条消息的节点的值减去滚动条现在的位置小于等于可视窗口的高度，则让滚动条弹到最底部。
                          if(lastMessageScrollTop-windScrollTop<=$(window).height()){
                              var keyHeight= uexChatKeyboard.getInputBarHeight();
                              // if(flagBommom==false){
                                  // $("#chat-box").css("margin-bottom", Number(keyHeight)+10);
                              // }else{
                                  // $("#chat-box").css("margin-bottom", 0);
                              // }
                              
                  
                                var platForm = appcan.locStorage.getVal("platForm");
                                if(platForm=="1"){
                                    setTimeout(function(){
                                       mescroll_one.scrollTo(99999999, 0);
                                    }, 750);
                                }else{
                                    //键盘收起时闪动效果最小，聊天消息至最底部
                                    
                                    //$("#chat-box").css("padding-bottom", $(window).height());
                                    if(!flagBommom){
                                        setTimeout(function(){
                                            //uexChatKeyboard.changeWebViewFrame($(document).height());
                                            var keyHeight=uexChatKeyboard.getInputBarHeight();
                                            $("#chat-box").css("padding-bottom", keyHeight);
                                            mescroll_one.scrollTo(99999999, 0);
                                        }, 200);
                                    }else{
                                        setTimeout(function(){
                                            //$(window).scrollTop( $(document).height() - $(window).height());
                                            //$(window).scrollTop($(document).height());
                                            //alert($("#"+vm.Chat[vm.Chat.length-1].messageId).height());
                                            //$("#chat-box").css("padding-bottom", keyHeight);
                                            //$(window).scrollTop( $(document).height() - $(window).height());
                                            //var keyHeight=uexChatKeyboard.getInputBarHeight();
                                            uexChatKeyboard.changeWebViewFrame($("#chat-box").height());
                                            
                                            //var keyHeight=uexChatKeyboard.getInputBarHeight();
                                        }, 80);
                                    }
                                    
                                }
                
                          }
                      }
                    })
                }    
        }
    }
    //自己的消息
    if(flag=="myNew"){
        var messageMyJson=msg;
        if(messageMyJson.isSuccess==true){
              var myMessage=messageMyJson.message;
              //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
              var extFrom=myMessage.ext;
              //消息类型0:单聊；1：群聊
              var myChatType=myMessage.chatType;
              //from从哪里来
              var myChatFrom=myMessage.from;
               //不知道干什么用的
              var myIsAcked=myMessage.isAcked;
              //是不是群
              var myIsGroup=myMessage.isGroup;
              //有没有读0：未读；1：已读
              var myIsRead=myMessage.isRead;
               //有没有读0：未读；1：已读
            
              //消息主题
              var myMessageBody=myMessage.messageBody;
              //消息id
              var myMessageId=myMessage.messageId;
              //消息发送时间，毫秒为单位
              var myMessageTime=myMessage.messageTime;
              //消息类型：text/video/audio/image/location/file/cmd
              var myMessageType=myMessage.messageType;
              //接受人
              var myTo=myMessage.to;
              var text;
            if(myTo==groupChatId){
                  //定义一个变量判断是否为重发的消息，以便删除sendMessageArray数组中的消息，这个数组是每次发送消息时向数组放消息
                  var isreSend=false;
                  if(extFrom.indexOf("@")!=-1){
                       isreSend=true;
                        //发送成功的消息从sendMessageArray 这个数组里删除掉
                        for (var j=0; j <sendMessageArray.length; j++) {
                               if(sendMessageArray[j].messageId==extFrom.split("@")[1]){
                                   sendMessageArray.baoremove(j);
                               }
                        };
                       
                  }else{
                        //发送成功的消息从sendMessageArray 这个数组里删除掉
                        for (var j=0; j <sendMessageArray.length; j++) {
                               if(sendMessageArray[j].messageId==extFrom.split("#")[1]){
                                   sendMessageArray.baoremove(j);
                               }
                        };
                  }
                if(myMessageType=="text"){
                     if(isreSend){
                        var unreceiveMessage= appcan.locStorage.getVal("unreceiveMessageId");
                        if(isDefine(unreceiveMessage)){
                            var arryMessage= unreceiveMessage.split(",");
                             for (var j=0; j < arryMessage.length; j++) {
                               if(arryMessage[j]==extFrom.split("@")[1]){
                                    var newA=unreceiveMessage.split(arryMessage[j])[0].substring(0,unreceiveMessage.split(arryMessage[j])[0].length-1)+unreceiveMessage.split(arryMessage[j])[1];
                                   appcan.locStorage.setVal("unreceiveMessageId",newA);
                                   break;
                               }
                           };
                        }
                        //删除以前发送失败现在发送成功的以前的数据
                        removeSendOldfailMessige(extFrom.split("@")[1]);
                        //将数组中的数据的消息id和时间替换成最新的消息id和时间
                        for (var i=0; i < vm.Chat.length; i++) {
                             if(vm.Chat[i].messageId==extFrom.split("@")[1]){
                                 Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                 Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                 Vue.set(vm.Chat[i], 'chatStatus', true);
                                 break;
                             }
                        };
                     }else{ 
                         for (var i=0; i < vm.Chat.length; i++) {
                             if(vm.Chat[i].messageId==extFrom.split("#")[1]){
                                 Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                 Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                 Vue.set(vm.Chat[i], 'chatStatus', true);
                                 break;
                             }
                        };
                     } 
                }
                if(myMessageType=="image"){
                    //图片名
                  var displayName=myMessageBody.displayName;
                  //图片远程地址
                  var remotePath=myMessageBody.remotePath;
                  //远端文件的密钥
                  var secretKey=myMessageBody.secretKey;
                  //预览图文件的服务器远程路径(仅视频/图片消息)
                  var thumbnailRemotePath=myMessageBody.thumbnailRemotePath;
                  //预览图文件的密钥(仅视频/图片消息)
                  var thumbnailSecretKey=myMessageBody.thumbnailSecretKey;
                  var platForm = appcan.locStorage.getVal("platForm");
                    if(isreSend){
                             var unreceiveMessage= appcan.locStorage.getVal("unreceiveMessageId");
                             if(isDefine(unreceiveMessage)){
                                var arryMessage= unreceiveMessage.split(",");
                                 for (var j=0; j < arryMessage.length; j++) {
                                   if(arryMessage[j]==extFrom.split("@")[1]){
                                        var newA=unreceiveMessage.split(arryMessage[j])[0].substring(0,unreceiveMessage.split(arryMessage[j])[0].length-1)+unreceiveMessage.split(arryMessage[j])[1];
                                       appcan.locStorage.setVal("unreceiveMessageId",newA);
                                       break;
                                   }
                               };
                             }
                            //删除以前发送失败现在发送成功的以前的数据
                            removeSendOldfailMessige(extFrom.split("@")[1]);
                            
                            //将数组中的数据的消息id和时间替换成最新的消息id和时间
                            for (var i=0; i < vm.Chat.length; i++) {
                                 if(vm.Chat[i].messageId==extFrom.split("@")[1]){
                                     Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                     Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                     Vue.set(vm.Chat[i], 'chatStatus', true);
                                         Vue.set(vm.Chat[i].messageBody, 'width', myMessageBody.width);
                                         Vue.set(vm.Chat[i].messageBody, 'height', myMessageBody.height);
                                     break;
                                 }
                            };
                    }else{
                            for (var i=0; i < vm.Chat.length; i++) {
                                 if(vm.Chat[i].messageId==extFrom.split("#")[1]){
                                     Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                     Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                     Vue.set(vm.Chat[i], 'chatStatus', true);
                                     //alert(myMessageBody.width);
                                     //alert(myMessageBody.height);
                                         Vue.set(vm.Chat[i].messageBody, 'width', myMessageBody.width);
                                         Vue.set(vm.Chat[i].messageBody, 'height', myMessageBody.height);
                                     //Vue.set(vm.Chat[i].messageBody, 'remotePath', remotePath);
                                     break;
                                 }
                            };
                    }
                }
                if(myMessageType=="audio"){
                      //语音名
                      var displayName=myMessageBody.displayName;
                      //语音远程地址
                      var remotePath=myMessageBody.remotePath;
                      //远端文件的密钥
                      var secretKey=myMessageBody.secretKey;
                      if(isreSend){
                             if(isDefine(unreceiveMessage)){
                                var arryMessage= unreceiveMessage.split(",");
                                 for (var j=0; j < arryMessage.length; j++) {
                                   if(arryMessage[j]==extFrom.split("@")[1]){
                                        var newA=unreceiveMessage.split(arryMessage[j])[0].substring(0,unreceiveMessage.split(arryMessage[j])[0].length-1)+unreceiveMessage.split(arryMessage[j])[1];
                                       appcan.locStorage.setVal("unreceiveMessageId",newA);
                                       break;
                                   }
                               };
                             }
                             //删除以前发送失败现在发送成功的以前的数据
                             removeSendOldfailMessige(extFrom.split("@")[1]);
                             //将数组中的数据的消息id和时间替换成最新的消息id和时间
                            for (var i=0; i < vm.Chat.length; i++) {
                                 if(vm.Chat[i].messageId==extFrom.split("@")[1]){
                                     Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                     Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                     Vue.set(vm.Chat[i], 'chatStatus', true);
                                     break;
                                 }
                            };
                      }else{
                           for (var i=0; i < vm.Chat.length; i++) {
                                 if(vm.Chat[i].messageId==extFrom.split("#")[1]){
                                     Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                     Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                     Vue.set(vm.Chat[i], 'chatStatus', true);
                                     break;
                                 }
                            };
                      }
                    
                }
                if(myMessageType=="video"){
                  
                  //视频名
                  var displayName=myMessageBody.displayName;
                  //视频远程地址
                  var remotePath=myMessageBody.remotePath;
                  //远端文件的密钥
                  var secretKey=myMessageBody.secretKey;
                  var thumbnailRemotePath=myMessageBody.thumbnailRemotePath;
                  if(isreSend){
                                if(isDefine(unreceiveMessage)){
                                    var arryMessage= unreceiveMessage.split(",");
                                     for (var j=0; j < arryMessage.length; j++) {
                                       if(arryMessage[j]==extFrom.split("@")[1]){
                                            var newA=unreceiveMessage.split(arryMessage[j])[0].substring(0,unreceiveMessage.split(arryMessage[j])[0].length-1)+unreceiveMessage.split(arryMessage[j])[1];
                                           appcan.locStorage.setVal("unreceiveMessageId",newA);
                                           break;
                                       }
                                   };
                                }
                                //删除以前发送失败现在发送成功的以前的数据
                                removeSendOldfailMessige(extFrom.split("@")[1]);
                                //将数组中的数据的消息id和时间替换成最新的消息id和时间
                                for (var i=0; i < vm.Chat.length; i++) {
                                     if(vm.Chat[i].messageId==extFrom.split("@")[1]){
                                         Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                         Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                         Vue.set(vm.Chat[i], 'chatStatus', true);
                                         Vue.set(vm.Chat[i].messageBody, 'thumbnailRemotePath',myMessageBody.thumbnailRemotePath );
                                         break;
                                     }
                                };
                         }else{
                                for (var i=0; i < vm.Chat.length; i++) {
                                     if(vm.Chat[i].messageId==extFrom.split("#")[1]){
                                         Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                         Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                         Vue.set(vm.Chat[i], 'chatStatus', true);
                                         Vue.set(vm.Chat[i].messageBody, 'thumbnailRemotePath',myMessageBody.thumbnailRemotePath );
                                         break;
                                     }
                                };
                         }    
                }
                if(myMessageType=="file"){
                  
                  //视频名
                  var displayName=myMessageBody.displayName;
                  //视频远程地址
                  var remotePath=myMessageBody.remotePath;
                  //远端文件的密钥
                  var secretKey=myMessageBody.secretKey;
                  var thumbnailRemotePath=myMessageBody.thumbnailRemotePath;
                  if(isreSend){
                                if(isDefine(unreceiveMessage)){
                                    var arryMessage= unreceiveMessage.split(",");
                                     for (var j=0; j < arryMessage.length; j++) {
                                       if(arryMessage[j]==extFrom.split("@")[1]){
                                            var newA=unreceiveMessage.split(arryMessage[j])[0].substring(0,unreceiveMessage.split(arryMessage[j])[0].length-1)+unreceiveMessage.split(arryMessage[j])[1];
                                           appcan.locStorage.setVal("unreceiveMessageId",newA);
                                           break;
                                       }
                                   };
                                }
                                //删除以前发送失败现在发送成功的以前的数据
                                removeSendOldfailMessige(extFrom.split("@")[1]);
                                //将数组中的数据的消息id和时间替换成最新的消息id和时间
                                for (var i=0; i < vm.Chat.length; i++) {
                                     if(vm.Chat[i].messageId==extFrom.split("@")[1]){
                                         Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                         Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                         Vue.set(vm.Chat[i], 'chatStatus', true);
                                         Vue.set(vm.Chat[i].messageBody, 'thumbnailRemotePath',myMessageBody.thumbnailRemotePath );
                                         Vue.set(vm.Chat[i].messageBody, 'remotePath',myMessageBody.remotePath );
                                         break;
                                     }
                                };
                         }else{
                                for (var i=0; i < vm.Chat.length; i++) {
                                     if(vm.Chat[i].messageId==extFrom.split("#")[1]){
                                         Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                         Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                         Vue.set(vm.Chat[i], 'chatStatus', true);
                                         Vue.set(vm.Chat[i].messageBody, 'thumbnailRemotePath',myMessageBody.thumbnailRemotePath );
                                         Vue.set(vm.Chat[i].messageBody, 'remotePath',myMessageBody.remotePath );
                                         break;
                                     }
                                };
                         }    
                }         
                
                
            }
        }else{
            var myMessage=messageMyJson.message;
            //接受人
            var myTo=myMessage.to;
            var errorStr=messageMyJson.errorStr;
            if(myTo==groupChatId){
                //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                myMessage.chatStatus=false;
                layerToast("消息发送失败，请查看网络");
                //消息id
                var myMessageId=myMessage.messageId;
                //消息发送时间，毫秒为单位
                var myMessageTime=myMessage.messageTime;
                //消息类型：text/video/audio/image/location/file/cmd
                var myMessageType=myMessage.messageType;
                //var msgType = ['text', 'image', 'audio', 'video'];
                var extFrom=myMessage.ext;
                var newArray=new Array();
                //更新上一条消息的收到
                //appcan.locStorage.setVal("lastMessageTime",myMessageTime);
                var unreceiveMessage=appcan.locStorage.getVal("unreceiveMessageId");
                if(isDefine(unreceiveMessage)){
                    unreceiveMessage=unreceiveMessage+","+ myMessageId;
                }else{
                    unreceiveMessage=myMessageId;
                }
                appcan.locStorage.setVal("unreceiveMessageId",unreceiveMessage);
                var platForm = appcan.locStorage.getVal("platForm");
                
                //定义一个变量判断是否为重发的消息，以便删除sendMessageArray数组中的消息，这个数组是每次发送消息时向数组放消息
                  var isreSend=false;
                  if(extFrom.indexOf("@")!=-1){
                      isreSend=true;
                    //发送成功的消息从sendMessageArray 这个数组里删除掉
                    for (var j=0; j <sendMessageArray.length; j++) {
                           if(sendMessageArray[j].messageId==extFrom.split("@")[1]){
                               sendMessageArray.baoremove(j);
                           }
                    };
                  }else{
                      //发送成功的消息从sendMessageArray 这个数组里删除掉
                    for (var j=0; j <sendMessageArray.length; j++) {
                           if(sendMessageArray[j].messageId==extFrom.split("#")[1]){
                               sendMessageArray.baoremove(j);
                           }
                    };
                  }
                 //为true时 展示发送失败的图标 false时展示发送中的图标
                 
                 if(isreSend){
                      for (var i=0; i < vm.Chat.length; i++) {
                             if(vm.Chat[i].messageId==extFrom.split("@")[1]){
                                 Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                 Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                 Vue.set(vm.Chat[i], 'chatStatusWarning', true);
                                 break;
                             }
                     };
                 }else{
                     for (var i=0; i < vm.Chat.length; i++) {
                             if(vm.Chat[i].messageId==extFrom.split("#")[1]){
                                 Vue.set(vm.Chat[i], 'messageId', myMessageId);
                                 Vue.set(vm.Chat[i], 'messageTime', myMessageTime);
                                 Vue.set(vm.Chat[i], 'chatStatusWarning', true);
                                 break;
                                 
                             }
                     };
                 }
                 
            }
            
            
        }
        
        
        
    }
    if(flag=="revokeMessage"){
             var revokeMessageJson=msg;
             var revokeMessage= revokeMessageJson.message;
             //消息体
             var revokeMessageBody= revokeMessage.messageBody;
             var revokeMessageChatType= revokeMessage.chatType;
             
             //消息从哪里来
             var to= revokeMessage.to;
             var revokeMessageAction= revokeMessageBody.action;
             //谁撤回的
             var revokeMessagefrom= revokeMessage.from;
             
             if(revokeMessageChatType==peopleChatType){
                if(to==groupChatId||revokeMessagefrom==groupChatId){
                     //谁撤回的昵称
                     var revokeMessagefromNC=revokeMessageAction.split("@")[0];
                     var revokeId=revokeMessageAction.split("=")[1];
                      for (var i=0; i < vm.Chat.length; i++) {
                            if(vm.Chat[i].messageId==revokeId){
                                Vue.set(vm.Chat[i], 'isRevoke', true);
                                //谁撤回的用户名
                                Vue.set(vm.Chat[i], 'revokeMessagefromNC', revokeMessagefromNC);
                                break;
                            }
                     };
                     var platForm=appcan.locStorage.getVal("platForm");
                     if(platForm=="1"){
                         var param={
                             from:revokeMessagefrom,
                             to:groupChatId,
                             messageId:revokeId,
                             chatType:peopleChatType,
                             setMsgTime:"",
                             msgText:"您已撤回了一条消息！",
                             ext:revokeMessagefromNC+"@"+messageIdKey
                          }
                          uexEasemob.updateMsg(param);
                     }else{
                          var param = {
                            "username":groupChatId,//username | groupid
                            "msgId":revokeId,
                            "chatType":peopleChatType//0-个人 1-群组(默认0,此参数仅iOS需要)
                         };
                                         //删除当前会话的某条聊天记录
                         uexEasemob.removeMessage(param);
                     }
                     
                    
                }
            }
    }
    if(flag=="Disconnected"){
        if(unDisconnected==0){
        }
        unDisconnected++;
    }
    if(flag=="chatConnected"){
    }    
  
    
}
var sss=1;
/*
 *展示历史数据 
 * @param {Object} data
 */
function showHistoryMessage(data){
    var platForm=appcan.locStorage.getVal("platForm");
    //获取当前登录人帐号
    var userCode=appcan.locStorage.getVal("userCode"); 
    var chatHistoryMessageJson;
          try{
                chatHistoryMessageJson=data;
          }catch(e){
                chatHistoryMessageJson=data;
          }
          var HistoryMessage=chatHistoryMessageJson.messages;
          if(HistoryMessage.length>0){
                  HistoryMessageId_scoll=HistoryMessage[HistoryMessage.length-1].messageId;
          }
          //是否是重发的消息
          var isrevokeMessage=false;
          var platForm = appcan.locStorage.getVal("platForm");
          for (var i=HistoryMessage.length-1; i >=0; i--) {
              //alert(JSON.stringify(HistoryMessage[i]));
              var newMessageDom=$("#"+HistoryMessage[i].messageId);
              if(newMessageDom.length>0){
                    continue ;
              }
               var historyChatType =HistoryMessage[i].chatType;
               var historyFrom =HistoryMessage[i].from;
               var historyIsAcked =HistoryMessage[i].isAcked;
               var historyIsGroup =HistoryMessage[i].isGroup;
               var historyIsRead =HistoryMessage[i].isRead;
               var historyMessageBody =HistoryMessage[i].messageBody;
               var historyMessageId=HistoryMessage[i].messageId;
               var historyMessageTime =HistoryMessage[i].messageTime;
               var historyMessageType =HistoryMessage[i].messageType;
               var historyMessageTo =HistoryMessage[i].to;
               var historyMessageExtFrom =HistoryMessage[i].ext;
               var historyMessageExtFromObjRevoke=false;
               HistoryMessage[i].isHide=false;
               //Android
                if(platForm=="1"){
                   //撤回的id是否存在。默认为false,true表示存在。
                   if(HistoryMessage[i].hasOwnProperty("extObj")){
                       historyMessageExtFromObjRevoke=true;
                       HistoryMessage[i].isRevoke=true;
                   }else{
                       historyMessageExtFromObjRevoke=false;
                       HistoryMessage[i].isRevoke=false;
                   }
               }else{
                   if(HistoryMessage[i].extObj.hasOwnProperty("ext")){
                       historyMessageExtFromObjRevoke=false;
                       HistoryMessage[i].isRevoke=false;
                   }else{
                       historyMessageExtFromObjRevoke=true;
                       HistoryMessage[i].isRevoke=true;
                   }
               }
              // var headPic=headPicUrl(historyFrom);
              
               if(historyMessageExtFrom.indexOf("@")!=-1){
                  historyMessageExtFrom=historyMessageExtFrom.split("@")[0];
                  HistoryMessage[i].chatFromUser=historyMessageExtFrom;
                  isrevokeMessage=true;
              }
              if(historyMessageExtFrom.indexOf("#")!=-1){
                  historyMessageExtFrom=historyMessageExtFrom.split("#")[0];
                  HistoryMessage[i].chatFromUser=historyMessageExtFrom;
                  isrevokeMessage=false;
              }
              //撤回的消息的message 数据处理
              if(historyMessageExtFromObjRevoke){
                  var revokeFC="您已";
                  if(userCode!=historyFrom){
                      revokeFC=historyMessageExtFrom;
                  }
                  //谁撤回的用户名
                  HistoryMessage[i].chatFromUser=revokeFC;
                 continue; 
              }
              //处理头像信息
             var headerImg= disposeHeadImg(historyFrom).headImgPath;
             if(isDefine(headerImg)){
                 HistoryMessage[i].hashead=true;
                 HistoryMessage[i].headerImg=serverPath+headerImg;
             }else{
                 HistoryMessage[i].hashead=false;
                 HistoryMessage[i].headtext = historyMessageExtFrom.substr(-2,2);
                 HistoryMessage[i].headbgclass=getHeadClass(disposeHeadImg(historyFrom).userId);
             }
              
              if(userCode==historyFrom){
                       //处理头像信息
                       //表示自己的消息
                    HistoryMessage[i].isOthers=false;
                    HistoryMessage[i].chatFromUser="我";
               }else{
                   //处理头像信息
                   //表示他人的消息
                   HistoryMessage[i].isOthers=true;
               }
               HistoryMessage[i].sendMsgTimeHide=false;
               //展示时间
             
               if(i==0){
                    if(vm.Chat.length>0){
                            if(Number(historyMessageTime)-Number(vm.Chat[0].messageTime)> 2*60*1000){
                                HistoryMessage[i].sendMsgTime=timeStemp(Number(historyMessageTime),"MM-dd HH:mm").commonDate;
                                HistoryMessage[i].sendMsgTimeHide=true;    
                            }
                       }
                    if(vm.Chat.length==0 && i==0 ){
                        HistoryMessage[i].sendMsgTime=timeStemp(Number(historyMessageTime),"MM-dd HH:mm").commonDate;
                        HistoryMessage[i].sendMsgTimeHide=true; 
                    }
                }else{
                    if(i-1>=0){
                        if(Number(HistoryMessage[i].messageTime)-Number(HistoryMessage[i-1].messageTime)> 2*60*1000 || Number(HistoryMessage[i].messageTime)-Number(HistoryMessage[i-1].messageTime)<(-2*60*1000)){
                                HistoryMessage[i].sendMsgTime=timeStemp(Number(historyMessageTime),"MM-dd HH:mm").commonDate;
                                HistoryMessage[i].sendMsgTimeHide=true;
                        }
                    }
             }
             
               
               
              if(historyMessageType=="text"){
                      //定义这个是否是自己发送的消息发送失败的消息。
                     var isUnReceive=false;
                     if(!HistoryMessage[i].isOthers){
                         var unreceiveMessage= appcan.locStorage.getVal("unreceiveMessageId");
                         if(isDefine(unreceiveMessage)){
                            var arryMessage= unreceiveMessage.split(",");
                             for (var j=0; j < arryMessage.length; j++) {
                               if(arryMessage[j]==historyMessageId){
                                   isUnReceive=true;
                                   break;
                               }
                           };
                         }
                     } 
                     if(isUnReceive){
                         //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=false;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=true;
                        
                        if(historyMessageBody.text.indexOf("Picture#")==-1 && historyMessageBody.text.indexOf("Video#")==-1 && historyMessageBody.text.indexOf("File#")==-1 && historyMessageBody.text.indexOf("DutyProblem#")==-1 && historyMessageBody.text.indexOf("TaskShare#")==-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="text";
                            
                            //var t=filterBrow(HistoryMessage[i].messageBody.text).replace(/\<BR>/g, "");
                            var t=filterBrow(HistoryMessage[i].messageBody.text);
                            HistoryMessage[i].messageBody.text=t;
                            //处理text 文本的数据
                        }
                        if(historyMessageBody.text.indexOf("DutyProblem#")!=-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="dutyProblem";
                            var dutyProblemContent=HistoryMessage[i].messageBody.text.split("#")[1];
                            var dutyProblemRecvdepart=HistoryMessage[i].messageBody.text.split("#")[2];
                            var dutyProblemTime;
                            if(isNaN(HistoryMessage[i].messageBody.text.split("#")[3])){
                                dutyProblemTime=HistoryMessage[i].messageBody.text.split("#")[3];
                            }else{
                                dutyProblemTime=timeStemp(Number(HistoryMessage[i].messageBody.text.split("#")[3]), 'MM-dd HH:mm').commonDate;
                            }
                            var dataId=HistoryMessage[i].messageBody.text.split("#")[4];
                            HistoryMessage[i].messageBody.dutyText="【值班问题】"+dutyProblemContent;
                            HistoryMessage[i].messageBody.dutyProblemTime=dutyProblemTime;
                            HistoryMessage[i].messageBody.dataId=dataId;
                            HistoryMessage[i].messageBody.dutyProblemRecvdepart=dutyProblemRecvdepart;
                        }
                        if(historyMessageBody.text.indexOf("TaskShare#")!=-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="taskShare";
                            var taskSendContent=HistoryMessage[i].messageBody.text.split("#")[1];
                            var taskReceiveInfoStr=HistoryMessage[i].messageBody.text.split("#")[2];
                            var taskSendTime;
                            if(isNaN(HistoryMessage[i].messageBody.text.split("#")[3])){
                                taskSendTime=HistoryMessage[i].messageBody.text.split("#")[3];
                            }else{
                                taskSendTime=timeStemp(Number(HistoryMessage[i].messageBody.text.split("#")[3]), 'MM-dd HH:mm').commonDate;
                            }
                            var dataId=HistoryMessage[i].messageBody.text.split("#")[4];
                            HistoryMessage[i].messageBody.taskText="【任务】"+taskSendContent;
                            HistoryMessage[i].messageBody.taskSendTime=taskSendTime;
                            HistoryMessage[i].messageBody.dataId=dataId;
                            HistoryMessage[i].messageBody.taskReceiveInfoStr=taskReceiveInfoStr;
                        }
                        if(historyMessageBody.text.indexOf("Picture#")!=-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="image";
                            var thisSrc=historyMessageBody.text.split("#")[1];
                            var orientation=0;
                            //图片远程地址
                            if(HistoryMessage[i].isOthers){
                                if(isrevokeMessage){
                                     if(HistoryMessage[i].ext.split("@").length>=3){
                                         orientation=HistoryMessage[i].ext.split("@")[2];
                                     }
                                    
                                }else{
                                    if(HistoryMessage[i].ext.split("#").length>=3){
                                         orientation=HistoryMessage[i].ext.split("#")[2];
                                     }
                                }
                            }
                            HistoryMessage[i].messageBody.orientation=orientation;
                            
                            HistoryMessage[i].messageBody.thumbnailRemotePath=thisSrc;
                            HistoryMessage[i].messageBody.remotePath=thisSrc;
                                if(historyMessageBody.text.split("#").length>2){
                                var height=historyMessageBody.text.split("#")[2];
                                var width=historyMessageBody.text.split("#")[3];
                                HistoryMessage[i].messageBody.height=height;
                                HistoryMessage[i].messageBody.width=width;
                                }
                            
                            getImgHeight(HistoryMessage[i].messageBody);
                            jsonPicArrayNew.unshift(thisSrc);
                        }
                        if(historyMessageBody.text.indexOf("Video#")!=-1){
                            HistoryMessage[i].ownerType="video";
                            var thisSrc=historyMessageBody.text.split("#")[1];
                            var videoimg=historyMessageBody.text.split("#")[2];
                            HistoryMessage[i].messageBody.thumbnailRemotePath= videoimg;
                            getImgHeight(HistoryMessage[i].messageBody);
                            //视频缩略图
                            HistoryMessage[i].messageBody.remotePath=thisSrc;
                        }
                        if(historyMessageBody.text.indexOf("File#")!=-1){
                            HistoryMessage[i].ownerType="file";
                            var thisSrc=historyMessageBody.text.split("#")[1];
                            var displayName=historyMessageBody.text.split("#")[3];
                            HistoryMessage[i].messageBody.displayName= displayName;
                            var messageFileName="";
                            if(!isrevokeMessage){
                                messageFileName=HistoryMessage[i].ext.split("#")[2];
                            }else{
                                messageFileName=HistoryMessage[i].ext.split("@")[2];
                            }
                            var ret = uexFileMgr.isFileExistByPath("wgts://"+messageFileName);
                            if(!ret){
                                HistoryMessage[i].messageBody.hasReciveText="未接收";
                            }else{
                                HistoryMessage[i].messageBody.hasReciveText="已接收";
                            }
                            HistoryMessage[i].messageBody.suffix=displayName.split(".")[displayName.split(".").length-1];
                            HistoryMessage[i].messageBody.fileSize='';
                            //视频缩略图
                            HistoryMessage[i].messageBody.remotePath=thisSrc;
                        }
                     }else{
                         //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=true;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=false;
                        if(historyMessageBody.text.indexOf("Picture#")!=-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="image";
                            var thisSrc=historyMessageBody.text.split("#")[1];
                            var orientation=0;
                            //图片远程地址
                            if(HistoryMessage[i].isOthers){
                                if(isrevokeMessage){
                                     if(HistoryMessage[i].ext.split("@").length>=3){
                                         orientation=HistoryMessage[i].ext.split("@")[2];
                                     }
                                    
                                }else{
                                    if(HistoryMessage[i].ext.split("#").length>=3){
                                         orientation=HistoryMessage[i].ext.split("#")[2];
                                     }
                                }
                            }
                            HistoryMessage[i].messageBody.orientation=orientation;
                            HistoryMessage[i].messageBody.thumbnailRemotePath=thisSrc;
                            HistoryMessage[i].messageBody.remotePath=thisSrc;
                                if(historyMessageBody.text.split("#").length>2){
                                var height=historyMessageBody.text.split("#")[2];
                                var width=historyMessageBody.text.split("#")[3];
                                HistoryMessage[i].messageBody.height=height;
                                HistoryMessage[i].messageBody.width=width;
                                }
                            getImgHeight(HistoryMessage[i].messageBody);
                            jsonPicArrayNew.unshift(thisSrc);
                        }
                        if(historyMessageBody.text.indexOf("Video#")!=-1){
                            HistoryMessage[i].ownerType="video";
                            var thisSrc=historyMessageBody.text.split("#")[1];
                            var videoimg=historyMessageBody.text.split("#")[2];
                            HistoryMessage[i].messageBody.thumbnailRemotePath=videoimg;
                            getImgHeight(HistoryMessage[i].messageBody);
                            //视频缩略图
                            HistoryMessage[i].messageBody.remotePath=thisSrc;
                        }
                        if(historyMessageBody.text.indexOf("File#")!=-1){
                            HistoryMessage[i].ownerType="file";
                            var thisSrc=historyMessageBody.text.split("#")[1];
                            var displayName=historyMessageBody.text.split("#")[3];
                            HistoryMessage[i].messageBody.displayName= displayName;
                             var messageFileName="";
                            if(!isrevokeMessage){
                                messageFileName=HistoryMessage[i].ext.split("#")[2];
                            }else{
                                messageFileName=HistoryMessage[i].ext.split("@")[2];
                            }
                            var ret = uexFileMgr.isFileExistByPath("wgts://"+messageFileName);
                            if(!ret){
                                HistoryMessage[i].messageBody.hasReciveText="未接收";
                            }else{
                                HistoryMessage[i].messageBody.hasReciveText="已接收";
                            }
                            HistoryMessage[i].messageBody.suffix=displayName.split(".")[displayName.split(".").length-1];
                            HistoryMessage[i].messageBody.fileSize='';
                            //视频缩略图
                            HistoryMessage[i].messageBody.remotePath=thisSrc;
                        }
                        
                         if(historyMessageBody.text.indexOf("Picture#")==-1 && historyMessageBody.text.indexOf("Video#")==-1 && historyMessageBody.text.indexOf("File#")==-1 && historyMessageBody.text.indexOf("DutyProblem#")==-1 && historyMessageBody.text.indexOf("TaskShare#")==-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="text";
                            var tx=filterBrow(HistoryMessage[i].messageBody.text);
                            HistoryMessage[i].messageBody.text=tx;
                            //处理text 文本的数据
                        }
                        if(historyMessageBody.text.indexOf("DutyProblem#")!=-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="dutyProblem";
                            var dutyProblemContent=HistoryMessage[i].messageBody.text.split("#")[1];
                            var dutyProblemRecvdepart=HistoryMessage[i].messageBody.text.split("#")[2];
                            var dutyProblemTime;
                            if(isNaN(HistoryMessage[i].messageBody.text.split("#")[3])){
                                dutyProblemTime=HistoryMessage[i].messageBody.text.split("#")[3];
                            }else{
                                dutyProblemTime=timeStemp(Number(HistoryMessage[i].messageBody.text.split("#")[3]), 'MM-dd HH:mm').commonDate;
                            }
                            var dataId=HistoryMessage[i].messageBody.text.split("#")[4];
                            HistoryMessage[i].messageBody.dutyText="【值班问题】"+dutyProblemContent;
                            HistoryMessage[i].messageBody.dutyProblemTime=dutyProblemTime;
                            HistoryMessage[i].messageBody.dataId=dataId;
                            HistoryMessage[i].messageBody.dutyProblemRecvdepart=dutyProblemRecvdepart;
                        }if(historyMessageBody.text.indexOf("TaskShare#")!=-1){
                            //自己定义的消息类型
                            HistoryMessage[i].ownerType="taskShare";
                            var taskSendContent=HistoryMessage[i].messageBody.text.split("#")[1];
                            var taskReceiveInfoStr=HistoryMessage[i].messageBody.text.split("#")[2];
                            //var taskSendTime=HistoryMessage[i].messageBody.text.split("#")[3];
                            var taskSendTime;
                            if(isNaN(HistoryMessage[i].messageBody.text.split("#")[3])){
                                taskSendTime=HistoryMessage[i].messageBody.text.split("#")[3];
                            }else{
                                taskSendTime=timeStemp(Number(HistoryMessage[i].messageBody.text.split("#")[3]), 'MM-dd HH:mm').commonDate;
                            }
                            var dataId=HistoryMessage[i].messageBody.text.split("#")[4];
                            HistoryMessage[i].messageBody.taskText="【任务】"+taskSendContent;
                            HistoryMessage[i].messageBody.taskSendTime=taskSendTime;
                            HistoryMessage[i].messageBody.dataId=dataId;
                            HistoryMessage[i].messageBody.taskReceiveInfoStr=taskReceiveInfoStr;
                        } 
                     }
              }
              if(historyMessageType=="image"){
                  //alert(JSON.stringify(HistoryMessage[i]));alert(JSON.stringify(HistoryMessage[i]));
                  //自己定义的消息类型
                    HistoryMessage[i].ownerType="image";
                    //alert(historyMessageBody.remotePath);
                    //alert(historyMessageBody.thumbnailRemotePath);
                   //将图片的信息放到jsonPicArray数组中一共图片查看器插件使用
                    jsonPicArrayNew.unshift(historyMessageBody.remotePath);
                    //定义这个是否是自己发送的消息发送失败的消息。
                     var isUnReceive=false;
                     if(!HistoryMessage[i].isOthers){
                         var unreceiveMessage= appcan.locStorage.getVal("unreceiveMessageId");
                         if(isDefine(unreceiveMessage)){
                            var arryMessage= unreceiveMessage.split(",");
                             for (var j=0; j < arryMessage.length; j++) {
                               if(arryMessage[j]==historyMessageId){
                                   isUnReceive=true;
                                   break;
                               }
                           };
                         }
                     }
                     if(isUnReceive){
                            //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                            HistoryMessage[i].chatStatus=false;
                            //为true时 展示发送失败的图标 false时展示发送中的图标
                            HistoryMessage[i].chatStatusWarning=true;
                            var orientation=0;
                            //图片远程地址
                            if(HistoryMessage[i].isOthers){
                                if(isrevokeMessage){
                                     if(HistoryMessage[i].ext.split("@").length>=3){
                                         orientation=HistoryMessage[i].ext.split("@")[2];
                                     }
                                    
                                }else{
                                    if(HistoryMessage[i].ext.split("#").length>=3){
                                         orientation=HistoryMessage[i].ext.split("#")[2];
                                     }
                                }
                            }
                            HistoryMessage[i].messageBody.orientation=orientation;
                            //取出图片的缩略图地址，如果缩略图地址不存在，则用原图地址代替    
                            var thisSrc = historyMessageBody.thumbnailRemotePath;
                            if(!isDefine(thisSrc)){
                                thisSrc=historyMessageBody.remotePath;
                            }
                            //将图片的信息放到jsonPicArray数组中一共图片查看器插件使用
                            //jsonPicArrayNew.push(HistoryMessage[i].messageBody.remotePath); 
                            HistoryMessage[i].messageBody.thumbnailRemotePath=thisSrc;
                            getImgHeight(HistoryMessage[i].messageBody);
                     }else{
                         //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                            HistoryMessage[i].chatStatus=true;
                            //为true时 展示发送失败的图标 false时展示发送中的图标
                            HistoryMessage[i].chatStatusWarning=false;
                            var orientation=0;
                            //图片远程地址
                            if(HistoryMessage[i].isOthers){
                                if(isrevokeMessage){
                                     if(HistoryMessage[i].ext.split("@").length>=3){
                                         orientation=HistoryMessage[i].ext.split("@")[2];
                                     }
                                    
                                }else{
                                    if(HistoryMessage[i].ext.split("#").length>=3){
                                         orientation=HistoryMessage[i].ext.split("#")[2];
                                     }
                                }
                            }
                            HistoryMessage[i].messageBody.orientation=orientation;
                            //自己定义的消息类型
                            //取出图片的缩略图地址，如果缩略图地址不存在，则用原图地址代替    
                            var thisSrc = historyMessageBody.thumbnailRemotePath;
                            if(!isDefine(thisSrc)){
                                thisSrc=historyMessageBody.remotePath;
                            }
                            //将图片的信息放到jsonPicArray数组中一共图片查看器插件使用
                            //jsonPicArrayNew.push(HistoryMessage[i].messageBody.remotePath); 
                            HistoryMessage[i].messageBody.thumbnailRemotePath=thisSrc;
                            getImgHeight(HistoryMessage[i].messageBody);
                     }
                }
                if(historyMessageType=="audio"){
                    //自己定义的消息类型
                    HistoryMessage[i].ownerType="audio";
                    //定义这个是否是自己发送的消息发送失败的消息。
                     var isUnReceive=false;
                     if(!HistoryMessage[i].isOthers){
                         var unreceiveMessage= appcan.locStorage.getVal("unreceiveMessageId");
                         if(isDefine(unreceiveMessage)){
                            var arryMessage= unreceiveMessage.split(",");
                             for (var j=0; j < arryMessage.length; j++) {
                               if(arryMessage[j]==historyMessageId){
                                   isUnReceive=true;
                                   break;
                               }
                           };
                         }
                     }
                     var audioLengthTime=0;
                    if(isrevokeMessage){
                        audioLengthTime=  HistoryMessage[i].ext.split("@")[2];
                    }else{
                        audioLengthTime=  HistoryMessage[i].ext.split("#")[2];
                    }
                    HistoryMessage[i].audioS=audioLengthTime;
                    HistoryMessage[i].audioL=calVoiceLength(audioLengthTime);
                    if(isUnReceive){
                        //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=false;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=true;
                        HistoryMessage[i].isPlay=false;
                    }else{
                        //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=true;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=false; 
                        HistoryMessage[i].isPlay=false;
                    }
                    
                }
                if(historyMessageType=="video"){
                    //自己定义的消息类型
                    HistoryMessage[i].ownerType="video";
                    //定义这个是否是自己发送的消息发送失败的消息。
                     var isUnReceive=false;
                     if(!HistoryMessage[i].isOthers){
                         var unreceiveMessage= appcan.locStorage.getVal("unreceiveMessageId");
                         if(isDefine(unreceiveMessage)){
                            var arryMessage= unreceiveMessage.split(",");
                             for (var j=0; j < arryMessage.length; j++) {
                               if(arryMessage[j]==historyMessageId){
                                   isUnReceive=true;
                                   break;
                               }
                           };
                         }
                     }
                    if(isUnReceive){
                         //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=false;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=true;
                    }else{
                        //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=true;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=false; 
                    } 
                }
                 if(historyMessageType=="file"){
                    //自己定义的消息类型
                    HistoryMessage[i].ownerType="file";
                    //定义这个是否是自己发送的消息发送失败的消息。
                     var isUnReceive=false;
                     if(!HistoryMessage[i].isOthers){
                         var unreceiveMessage= appcan.locStorage.getVal("unreceiveMessageId");
                         if(isDefine(unreceiveMessage)){
                            var arryMessage= unreceiveMessage.split(",");
                             for (var j=0; j < arryMessage.length; j++) {
                               if(arryMessage[j]==historyMessageId){
                                   isUnReceive=true;
                                   break;
                               }
                           };
                         }
                     }
                    if(isUnReceive){
                        var messageFileName="";
                        if(!isrevokeMessage){
                            messageFileName=HistoryMessage[i].ext.split("#")[2];
                        }else{
                            messageFileName=HistoryMessage[i].ext.split("@")[2];
                        }
                        var ret = uexFileMgr.isFileExistByPath("wgts://"+messageFileName);
                        if(!ret){
                            HistoryMessage[i].messageBody.hasReciveText="未接收";
                        }else{
                            HistoryMessage[i].messageBody.hasReciveText="已接收";
                        }
                         //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=false;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=true;
                        historyMessageBody.suffix=historyMessageBody.displayName.split(".")[historyMessageBody.displayName.split(".").length-1];
                        
                        historyMessageBody.fileSize='';
                    }else{
                        var messageFileName="";
                        if(!isrevokeMessage){
                            messageFileName=HistoryMessage[i].ext.split("#")[2];
                            
                        }else{
                            messageFileName=HistoryMessage[i].ext.split("@")[2];
                        }
                        var ret = uexFileMgr.isFileExistByPath("wgts://"+messageFileName);
                        if(!ret){
                            HistoryMessage[i].messageBody.hasReciveText="未接收";
                        }else{
                            HistoryMessage[i].messageBody.hasReciveText="已接收";
                        }
                        //自己定义是否隐藏消息发送状态,自己的消息发送成功的消息需要隐藏
                        HistoryMessage[i].chatStatus=true;
                        //为true时 展示发送失败的图标 false时展示发送中的图标
                        HistoryMessage[i].chatStatusWarning=false; 
                        historyMessageBody.suffix=historyMessageBody.displayName.split(".")[historyMessageBody.displayName.split(".").length-1];
                        historyMessageBody.fileSize='';
                    } 
                }                     
          }
           if(vm.Chat.length==0){
               vm.Chat=HistoryMessage;
           }else{
               vm.chatNew=HistoryMessage;
               vm.Chat=vm.chatNew.concat(vm.Chat); 
           }
           // appcan.file.write({
                // filePath:'file:///sdcard/DCIM/数据.txt',
                // content:JSON.stringify(HistoryMessage),
                // callback:function(err){
                // }
            // });
        // scrollbox.reset();
         mescroll_one.endSuccess(20);
          Vue.nextTick(function () {
              if(!isunreadScroll){
                  //Dom更新了
                  var keyHeight= uexChatKeyboard.getInputBarHeight();
                  if(flag1){
                      
                    var platForm = appcan.locStorage.getVal("platForm");
                    if(platForm=="1"){
                        mescroll_one.scrollTo(99999999, 0);
                        //$(window).scrollTop( $(document).height() - $(window).height());
                    }else{
                        //setTimeout(function(){
                            $(window).scrollTop( $(document).height() - $(window).height());
                        //}, 750);
                    }
                    
                     }else{
                         if(!flagBommom){
                             if(HistoryMessageId_scoll!=""){
                                 var el= document.getElementById(HistoryMessageId_scoll);
                                 var a=el.offsetTop;
                                 mescroll_one.scrollTo(Math.round(a), 0);
                                 //$(window).scrollTop(a);
                             }
                         }
                     }
                 }else{
                     if((vm.Chat.length-Number(unReadCount))<0){
                        mescroll_one.triggerDownScroll();
                        return;
                     }
                     
                     
                     
                     if((vm.Chat.length-Number(unReadCount))>=0){
                            isunreadScroll=false;
                            
                            var el=document.getElementById("unreadLine");
                            var scorllLength=el.offsetTop;
                                 mescroll_one.scrollTo(Math.round(scorllLength), 0);
                                 unReadCount=0;
                                 //vm.unReadCount=0;
                             $("#unread").addClass("hide");
                       }
                 }
                 
          })
          
}    

function removeSendOldfailMessige(id){
    var param = {
                            "username":groupChatId,//username | groupid
                            "msgId":id,
                            "chatType":peopleChatType//0-个人 1-群组(默认0,此参数仅iOS需要)
                        };
                     //删除当前会话的某条聊天记录
     uexEasemob.removeMessage(param);
}
function disposeHeadImg(code){
    var allPeopleHeadImg=appcan.locStorage.getVal("allPeopleHeadImg");
    var headImgPath="";
    var userId="";
    if(isDefine(allPeopleHeadImg)){
         var allPeoples=JSON.parse(allPeopleHeadImg);
         for (var j=0; j < allPeoples.length; j++) {
            if(code==allPeoples[j].username){
                userId=allPeoples[j].id;
                headImgPath=allPeoples[j].head_image;
                break;
            }
         };
    }
    var json={
        headImgPath:headImgPath,
        userId:userId
    }
    return json;
}
/**
 *展示数据，先展示后给相应的div赋值  
 * @param {Object} type ,消息类型:text
 * @param {Object} text ,消息主体
 */

function showMy(type,text,MyMessageId){
     var myChatFrom=appcan.locStorage.getVal("userCode");
     var uName=appcan.locStorage.getVal("userName"); 
     var nonDate=new Date().getTime();
     var headerImg= disposeHeadImg(myChatFrom).headImgPath;
     var hashead=false;
     var headtext="";
     var headbgclass="";
     var sendMsgTimeHide=false;
     var sendMsgTime=nonDate;
     if(vm.Chat.length>0){
            if(Number(nonDate)-Number(vm.Chat[vm.Chat.length-1].messageTime)> 2*60*1000){
                    sendMsgTime=timeStemp(Number(nonDate),"MM-dd HH:mm").commonDate;
                    sendMsgTimeHide=true;
            }
     }else{
                    sendMsgTime=timeStemp(Number(nonDate),"MM-dd HH:mm").commonDate;
                    sendMsgTimeHide=true;
     }
    var data={
        isRevoke:false,//是否是撤回的消息
        isOthers:false,//是否是别人的消息
        chatStatus:false,//是否显示图标
        chatStatusWarning:false,//是否为发送失败的图标 false 表示发送中的图标
        chatFromUser:'我',//昵称
        messageId:MyMessageId,
        messageTime:nonDate,
        sendMsgTimeHide:sendMsgTimeHide,
        sendMsgTime:sendMsgTime,
        hashead:hashead,
        headerImg:serverPath+headerImg,
        headbgclass:headbgclass,
        isPlay:false,
        isHide:false
    };
    if(type=="text"){
        data.ownerType='text';
        var t=filterBrow(text);
        data.messageBody={
            text:t
        }
    }
    if(type=="image"){
        data.ownerType='image';
        data.messageBody={
            thumbnailRemotePath:text,
            remotePath:text,
            remoteShow: false
        };
        getImgHeightLocal(data.messageBody);
        jsonPicArrayNew.push(text);
    }
    if(type=="audio"){
        var audioBt=Math.ceil((audioEndTime-audioStartTime)/1000)-1;
        if(audioBt==0){
            audioBt=1;
        }
        data.ownerType='audio';
        data.audioS=audioBt;
        data.audioL=calVoiceLength(audioBt);
        data.messageBody={
            thumbnailRemotePath:text,
            remotePath:text
        };
    }
    if(type=="video"){
        data.ownerType='video';
        data.messageBody={
            thumbnailRemotePath:'#',
            remotePath:text,
        };
    }
    if(type=="file"){
        //var file = uexFileMgr.open({
           // path: text,
           // mode: 1
        //});
        //var size = uexFileMgr.getFileSize(file);
        data.ownerType='file';
        data.messageBody={
            thumbnailRemotePath:text,
            remotePath:text,
            displayName:text.split("/")[text.split("/").length-1],
            suffix:text.split(".")[text.split(".").length-1],
            fileSize:'',
            hasReciveText:'已发送'
        };
    }
    //处理头像的
    if(isDefine(headerImg)){
         data.hashead=true;
         data.headerImg=serverPath+headerImg;
    }else{
         data.hashead=false;
         data.headtext = uName.substr(-2,2);
         data.headbgclass=getHeadClass(disposeHeadImg(myChatFrom).userId);
    }
     vm.Chat.push(data);
     
     //定义一个Json对象，将将要发送的消息的id和时间放入json中，然后放到sendMessageArray中。
    var sendMessageJson={
        "messageId":MyMessageId,
        "sendTime":nonDate
    };
    sendMessageArray.push(sendMessageJson);
    Vue.nextTick(function () {
         // DOM 更新了
      
      
        var platForm = appcan.locStorage.getVal("platForm");
        if(platForm=="1"){
            var keyHeight= uexChatKeyboard.getInputBarHeight();
            setTimeout(function(){
                mescroll_one.scrollTo(99999999, 0);
            }, 750);
        }else{
            if(flagBommom==false){
                //键盘收起
                uexChatKeyboard.changeWebViewFrame($('#chat-box').height());
                setTimeout(function(){
                    mescroll_one.scrollTo(99999999, 0);
                }, 750);
            }else{
                //键盘弹出
                setTimeout(function(){
                    uexChatKeyboard.changeWebViewFrame($('#chat-box').height());
                }, 80);
            }
        }
    })
      
}
//超过2分钟还是显示圈的话就显示发送失败
function checkMessgeSendHaveNoteRecive(){
    for (var i=0; i < sendMessageArray.length; i++) {
          for (var j=0; j < vm.Chat.length; j++) {
            if(vm.Chat[j].messageId==sendMessageArray[i].messageId){
                if(!vm.Chat[j].chatStatus && !vm.Chat[j].chatStatusWarning){
                    var timeCha=   (new Date().getTime()-sendMessageArray[i].sendTime)/1000/60;
                    if(timeCha>2){
                        vm.Chat[j].chatStatusWarning=true;
                        layerToast("消息发送失败，请查看网络");
                    }
                }
            }
          };
    };
}

function calVoiceLength(dua){
    dua = parseInt(dua);
    return (dua>60 ? "8.8em":(dua==0 ? "4em" : (dua*0.08+4)+"em"));
}

$("#chat-box").on("mousedown touchstart", function(e){
    uexChatKeyboard.hideKeyboard();
});
/* 
* 方法:Array.baoremove(dx) 
* 功能:删除数组元素. 
* 参数:dx删除元素的下标. 
* 返回:在原数组上修改数组. 
*/
Array.prototype.baoremove = function(dx) 
{ 
  if(isNaN(dx)||dx>this.length){return false;} 
  this.splice(dx,1); 
} 

/*
 * 控制图片在气泡里的宽高
 * @param {Objcet} obj 是messageBody JSON对象
 */
function getImgHeight(obj){
    var flag = true,
        w = 0, h = 0,
        emw = 0, emh = 0,
        setw = 0, seth = 0;
    
    //判断是否有值
    if(!obj.hasOwnProperty('width') || !obj.hasOwnProperty('height')){
        flag = false;
    }else if(obj.width==0 || obj.height==0){
        flag = false;
    }
    
    if(flag){
        w = parseInt(obj.width);
        h = parseInt(obj.height);
        
        //4em≤w≤10em, 3em≤h≤7.5em
        emw = w/96;
        emh = h/96;
        if(h>=w){
            if(emh>=7.5){
                seth = 7.5;
                setw = seth*w/h;
            }else if(emw<=4){
                setw = 4;
                seth = setw*h/w;
            }else{
                seth = emh;
                setw = seth*w/h;
            }
        }else{
            if(emw>=10){
                setw = 10;
                seth = setw*h/w;
            }else if(emh<=3){
                seth = 3;
                setw = seth*w/h;
            }else{
                setw = emw;
                seth = setw*h/w;
            }
        }
    }else{
        seth = 7.5;
        setw = 'auto';
    }
    
    if(obj.hasOwnProperty('orientation') && (obj.orientation==6||obj.orientation==8) ){
        obj.remoteH = !isNaN(parseFloat(setw))&&isFinite(setw)?setw+'em':setw;
        obj.remoteW = seth+'em';
    }else{
        obj.remoteH = seth+'em';
        obj.remoteW = !isNaN(parseFloat(setw))&&isFinite(setw)?setw+'em':setw;
    }
    
    if(obj.hasOwnProperty('remoteShow')){
        obj.remoteShow = true;
    }
}

/*
 *  获取图片高度
 *  @param {Object} obj 是json格式的数据里url上一层的名字
 */
function getImgHeightLocal(obj){
    var start_time = new Date().getTime();
    var img_url = '';
    
    if(obj.thumbnailRemotePath==''){
        img_url = obj.remotePath;
    }else{
        img_url = obj.thumbnailRemotePath;
    }
    
    var img = new Image();
    img.src = img_url;
    
    //定时执行获取宽高
    var check = function(){
        if(img.width>0 || img.height>0){
            obj.width = img.width;
            obj.height = img.height;
            getImgHeight(obj);
            var diff = new Date().getTime() - start_time;
            clearInterval(set);
        }
    };
    var set = setInterval(check, 40);
    
    //加载完成获取宽高
    img.onload = function(){
        obj.width = img.width;
        obj.height = img.height;
        getImgHeight(obj);
        var diff = new Date().getTime() - start_time;
    };
}