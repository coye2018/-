

/**
 * 1、初始化环信
 *
 */
function initChat() {
    var platForm=0;
    //平台Android、iOS
    var platformName=appcan.widgetOne.getPlatformName();
    if(platformName=="android"){
        platForm=1;
        appcan.locStorage.setVal("platForm",1);
    }else{
        platForm=0;
        appcan.locStorage.setVal("platForm",0);
    }
    
    
    //1、初始化环信
    var param = {
        "appKey" : "1137161221178828#zhanghuibaiyun", //区别app的标识
        //"apnsCertName":'',//iOS中推送证书名称(仅iOS)
        "isAutoLoginEnabled" : "1", //可选参数 是否开启自动登录功能 1-开启 2-关闭
        "isAutoAcceptGroupInvitation" : "1" //可选参数 是否开启用户自动同意群邀请, 1-开启 2-关闭 默认为开启(此参数为3.0.22后新加入)
    };
    if(platForm==0){
        param.apnsCertName="zhanghuijichangPushPd";
    }else{
        param.huaweiPushAppId="10813530"//String类型 小米推送的appId
    }
    uexEasemob.initEasemob(JSON.stringify(param), function(data) {
        appcan.window.publish("getRecentAndGroup","getRecentAndGroup");
    });
    if(platForm==1){
        //2、设置消息提醒方式
        var paramNotification = {
            "enable" : 1, //0-关闭,1-开启。默认为1 开启新消息提醒
            "soundEnable" : 1, // 0-关闭,1-开启。默认为1 开启声音提醒
            "vibrateEnable" : 1, // 0-关闭,1-开启。默认为1 开启震动提醒
            "userSpeaker" : 1, // 0-关闭,1-开启。默认为1 开启扬声器播放(仅Android可用)
            "showNotificationInBackgroud" : 1, // 0-关闭,1-开启。默认为1。设置后台接收新消息时是否通过通知栏提示 (仅Android可用)
            "acceptInvitationAlways" : 0// 0-关闭,1-开启。默认添加好友时为1,是不需要验证的,改成需要验证为0(仅Android可用)
        };
        uexEasemob.setNotifyBySoundAndVibrate(JSON.stringify(paramNotification));
    }else{
        uexEasemob.registerRemoteNotification(function(data){}) //注册Apns推送
    }
    //3、自动登录成功回调，向回话列表及对话主题页面发送通知。
    uexEasemob.onConnected = function(data) {
        appcan.locStorage.setVal("uexEasemobConnect","true");
        indexContent = 0;
        var newData = {
            "MESSAGE" : "chatConnected"
        };
        uexWindow.publishChannelNotificationForJson("ChatConnected", JSON.stringify(newData));
        appcan.window.publish("connected", "1");
    };
   
    //4、登录连接失败回调
        uexEasemob.onDisconnected = function(data) {
            appcan.locStorage.setVal("uexEasemobConnect","false");
            //error:,//1-账号被移除,2-账号其他设备登陆,3-连接不到聊天服务器,4-当前网络不可用
            var error = JSON.parse(data).error;
            var title = "登陆超时";
            var errorMessage;
            var logMessage;
            switch(Number(error)) {
            case 1:
                errorMessage = "账号被移除";
                logMessage=1;
                break;
            case 2:
                errorMessage = "账号在其他设备登陆";
                logMessage=2;
                break;
            case 3:
                errorMessage = "连接不到聊天服务器";
                logMessage=3;
                appcan.window.publish("unDisconnectedChat", errorMessage);
                break;
            case 4:
                errorMessage = "当前网络不可用";
                logMessage=4;
                appcan.window.publish("unDisconnectedChat", errorMessage);
                break;
            default:
                errorMessage = "未知原因";
            }
    
            var content = "对不起，您已经与聊天服务器失去连接，原因是：" + errorMessage;
            var buttons = ["重新登陆"];
            var newData = {
                "MESSAGE" : "Disconnected"
            };
            uexWindow.publishChannelNotificationForJson("ChatDisconnected", JSON.stringify(newData));
            appcan.window.publish("unDisconnected", "1");
            if(logMessage==2){
                var upswd=appcan.locStorage.getVal("upswd");
                if(isDefine(upswd)){
                    appcan.locStorage.setVal("isLogin","false");
                    uexWindow.confirm({
                      title:"",
                      message:"您的帐号已在其他终端登录!",
                      buttonLabels:"重新登录,退出应用"
                    },function(index){
                        
                        if(index==0){
                            var uexEparam2 = {
                                 "username":appcan.locStorage.getVal("userCode"),//用户名
                                 "password":"888888"//密码
                             };
                            uexEasemob.login(JSON.stringify(uexEparam2),function(data){
                             if(data.result=="1"){
                                 appcan.locStorage.setVal("isLogin","true");
                                  uexWindow.toast({
                                      type:0,
                                      location:5,
                                      msg:"重新登录成功",
                                      duration:2000
                                    });
                             } 
                            });
                        }else{
                            //这个是获取app的信息，其中有版本号
                            var appInfo = uexWidgetOne.getCurrentWidgetInfo();
                            var version;
                            if(!isDefine(appInfo)){
                                version="01.00.0002";
                            }
                            //平台Android、iOS
                            var platformName=appcan.widgetOne.getPlatformName();
                            var platForm;
                            if(platformName=="android"){
                                platForm=1;
                            }else{
                                platForm=0;
                            }
                            var imei= uexDevice.getInfo('10');
                            var json={
                                path:serverPath+"focUserController.do?focloginOut",
                                data:{
                                    'platform':platForm,
                                    'imei':imei,
                                    'version':version,
                                    'lo':0,
                                    'la':0
                                },
                                layer:false
                            }
                            ajaxRequest(json,function(data,e){
                                
                                appcan.locStorage.remove("upswd");
                                appcan.locStorage.remove("token");
                                var t = setInterval(function(){
                                     var isLogin=appcan.locStorage.getVal("isLogin");
                                     var upswd=appcan.locStorage.getVal("upswd");
                                     var token=appcan.locStorage.getVal("token");
                                    
                                    if((isDefine(isLogin) && isLogin=="false") || !isDefine(isLogin)){
                                        //退出应用，循环调用退出操作。
                                        uexEasemob.logout(function(data){
                                            var platForm=appcan.locStorage.getVal("platForm");
                                            if(platForm=="1"){
                                                uexJPush.stopPush();
                                            }
                                            //退出应用
                                            uexWidgetOne.exit(0);
                                            
                                        });
                                    }else{
                                        appcan.locStorage.setVal("isLogin","false");
                                        appcan.locStorage.remove("upswd");
                                        appcan.locStorage.remove("token");
                                    }
                                }, 600);
                            })
                        }
                   });
               }
            }
    };
    //5、接受新消息回调
    uexEasemob.onNewMessage = function(data) {
        var NewMessage = JSON.parse(data);
        var from = NewMessage.from;
        //消息类型：text/video/audio/image/location/file/cmd
        var messageType = NewMessage.messageType;
        //消息发送昵称
        var extFrom = NewMessage.ext;
        if (extFrom.indexOf("@") != -1) {
            extFrom = extFrom.split("@")[0];
        }
        if (extFrom.indexOf("#") != -1) {
            extFrom = extFrom.split("#")[0];
        }
        //从哪里来的消息
        var to = NewMessage.to;
        //消息主题
        var messageBody = NewMessage.messageBody;
        var content = "";
        if (messageType == "text") {
            content = extFrom + "：" + messageBody.text;
        } else if (messageType == "image") {
            content = extFrom + "发送了图片";
        } else if (messageType == "audio") {
            content = extFrom + "发送了语音";
        } else if (messageType == "video") {
            content = extFrom + "发送了视频";
        }
        var messageId = NewMessage.messageId;
        //通知会话列表页chat.html更新未读消息数
        //appcan.window.publish("reloadUnread", "reloadUnread");
        appcan.window.publish("canReloadUnread", "canReloadUnread");
        //通知会话列表页chat.html重新获取会话列表。
        //appcan.window.publish("loadRecent", "loadRecent");
        appcan.window.publish("canLoadRecent", "canLoadRecent");
        var newData = JSON.parse(data);
        newData.MESSAGE = "New";
        //将新消息传递到对话主题页面。以便即使更新对话的消息。
        uexWindow.publishChannelNotificationForJson("newMessageChat", JSON.stringify(newData));
    };
    //6、自己发送的消息回调
    uexEasemob.onMessageSent = function(data) {
        var newData = JSON.parse(data);
        newData.MESSAGE = "myNew";
        //将新消息传递到对话主题页面。以便即使更新对话的消息。
        uexWindow.publishChannelNotificationForJson("myNewMessageChat", JSON.stringify(newData));
    }
    //7、接受透传消息监听回调函数，透传消息用来做消息撤回用的。
    uexEasemob.onCmdMessageReceive = function(data) {
        var newData = JSON.parse(data);
        var revokeMessage = newData.message;
        //消息体
        var revokeMessageBody = revokeMessage.messageBody;
        var revokeMessageAction = revokeMessageBody.action;
        //这个是撤回的消息id。
        var revokeId = revokeMessageAction.split("=")[1];
        var chatType=revokeMessage.chatType;
        var from=revokeMessage.from;
        newData.MESSAGE = "revokeMessage";
        //接收到透传消息时，通知会话列表页chat.html即使更新会话列表数据。具体做更新发送对象要撤回的消息。然后重新获取会话列表。
        appcan.window.publish("pushChatRevoke", revokeId+"#"+chatType+"#"+from);
        //将透传消息发送到对话主题页面，更改消息发送对象要撤回的消息，
        uexWindow.publishChannelNotificationForJson("RevokeMessageChat", JSON.stringify(newData));
    };
    //8、创建群回调。
    uexEasemob.onGroupCreated = function(data) {
        var result = JSON.parse(data);
        result.MESSAGE = "groupCreated";
        //通知创建群页面高所它已经创建成功。具体页面暂定
        uexWindow.publishChannelNotificationForJson("groupCreated", JSON.stringify(result));
    }
    //9、消息送达监听，这个只适用于单聊，所以暂未做任何处理
    uexEasemob.onDeliveryMessage = function(data) {
        var result = JSON.parse(data);
        result.MESSAGE = "deliveryMessage";
        uexWindow.publishChannelNotificationForJson("deliveryMessage", JSON.stringify(result));
    }
    uexEasemob.onCallReceive = function(data){
       
        var result = JSON.parse(data);
        alert(result.callType);
        if(result.callType=="voice"){
            appcan.locStorage.setVal("callFromCode",result.from);
            appcan.window.open("chat-call-people","chat/chat-call-people.html",2);
        }else{
            appcan.locStorage.setVal("callFromCode",result.from);
            appcan.window.open("chat-call-people","chat/chat-call-people.html",2);
        }
        
    }
    uexEasemob.onCallStateChanged = function(data){
        var result = JSON.parse(data);
         appcan.window.publish("callState",result.state);
    }
}
function loadAllPeopleInfo(){
    var ajaxJson={
        path:serverPath+"focchat.do?focgetAllUserHeadImages",
        data:{},
        layer:false
    }
    ajaxRequest(ajaxJson,function(data,e){
        if(e=="success"){
            //console.log(data);
            //将当前登录人所在的一级公司的所有用户的头像信息存入缓存中，以便聊天模块适用。
            appcan.locStorage.setVal("allPeopleHeadImg",JSON.stringify(data.obj));
            appcan.window.publish("loadRecent","loadRecent");
            //加载功能页数据
            appcan.window.publish("loadOptionsData","loadOptionsData");
            //加载联系人页数据
            appcan.window.publish("loadAddressData","loadAddressData");
            
        }else{
           appcan.window.publish("loadRecent","loadRecent"); 
        }
    });
}
