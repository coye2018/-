//聊天对象。
var groupChatId=appcan.locStorage.getVal("chat-dialog-groupChatId");
//这个为0时是单聊，1为群聊。
var peopleChatType=appcan.locStorage.getVal("chatType");
//语音开始时间
var audioStartTime;
//语音结束时间
var audioEndTime;
//定义一个发生消息的数组，里面记录消息的我自己生成的id 和发送时间。
var sendMessageArray=new Array();
//图片查看器的数组新的
var jsonPicArrayNew =new Array();
//键盘收起
var flagBommom=false;
var unDisconnected=0;
//历史记录id用来控制滚动条的
var HistoryMessageId_scoll="";
// 正则表达式匹配文字换行符
var textRegN = new RegExp("\\n", "g");
var textRegR = new RegExp("\\r", "g");

//键盘弹起监听最新的截图信息
//var photoPath;
//var timerSet = null;
//2分钟检查一下发送消息没有回调的消息。
setInterval("checkMessgeSendHaveNoteRecive()", 60000);
function onloadChat(){
    //监听截图     
//	uexAlbumLsn.cbAlbumLsnFetched = function(data) {
//   	var picData = JSON.parse(data);
//   	photoPath = picData.photoPath;
//   	//判断要发送的图片
//          if(isDefine(photoPath)){
//              $(".choosePic").css("display","block");
//              // $(".choosePic").css("bottom","0.4em");
//              $(".picbox img").attr("src",photoPath);
//              timerSet=setTimeout(function(){
//                     $(".choosePic").css("display","none");
//                     photoPath = 'undefined';
//                     clearTimeout(timerSet);
//                     },5000);
//           }else{
//               $(".choosePic").css("display","none");
//           }   
//   };
     
    //初始化聊天输入框插件
    var jsonstr ={
        "emojicons":"res://emojicons/emojicons.xml",
        "shares":"res://shares/shares.xml",
        "placeHold":"请输入内容",
        "touchDownImg":"res://3.png",
        "dragOutsideImg":"res://4.png",
        "textColor":"#FFF",
        "textSize":"15.5",
        "sendBtnbgColorUp":"#45C01A",
        "sendBtnbgColorDown":"#298409",
        "sendBtnText":"发送",
        //sendBtnTextSize:"15.5",
        "sendBtnTextColor":"#FFF",
        "keywords": ['@'],//(可选)输入监听关键字(字符串数组)
        "inputMode":0,
        "maxLines":4
    };
    uexChatKeyboard.open(JSON.stringify(jsonstr));
    var pageJson={
        num : 0, 
        size : 10,
        flag1:true,
        isDown:false
    }
    //获取历史聊天记录
    getHistoryMessageById(pageJson); 
    //将未读消息数清零
    var resetReadparam = {
        username:groupChatId
    };
    uexEasemob.resetUnreadMsgCount(resetReadparam);
    //通知会话列表页chat.html更新未读消息数
    appcan.window.publish("reloadUnread", "reloadUnread");
    
    var keyHeight=uexChatKeyboard.getInputBarHeight();
    $("#chat-box").css("padding-bottom", keyHeight);
    var platForm=appcan.locStorage.getVal("platForm");
    //Android 特殊处理
    if(platForm=="1"){  
        uexChatKeyboard.setFun(function(){
            //结束录音
            uexAudio.stopBackgroundRecord(function (obj){
                if(isDefine(obj)){
                    audioEndTime=new Date().getTime();
                    sendAudio(obj); 
                }
            });
        });
    }
    
    //于index.html中的chat-init.js中建立通道，即使收消息
    uexWindow.onNotification = onNotification;
    //收到新消息
    uexWindow.subscribeChannelNotification("newMessageChat", "onNotification");
    //自己发送的消息
    uexWindow.subscribeChannelNotification("myNewMessageChat", "onNotification");
    //要撤回的消息
    uexWindow.subscribeChannelNotification("RevokeMessageChat", "onNotification");
    //连接成功
    uexWindow.subscribeChannelNotification("ChatConnected", "onNotification");
    //连接失败
    uexWindow.subscribeChannelNotification("ChatDisconnected", "onNotification");
    //消息送达监听，这个只适用于单聊，所以暂未做任何处理
    uexWindow.subscribeChannelNotification("deliveryMessage", "onNotification");
   
    //系统的插件的回调比如相机
    systemPlugIns();
    //键盘的回调
    onuexChatKey();
    appcan.window.subscribe("reloadChat",function(msg){
        //Vue.set(vm.file,"groupName",msg);
        //Vue.set(vm.file,"chatType",'0');
        var file = appcan.locStorage.getVal('chat-file-group');
        if(isDefine(file)){
            var fileJson = JSON.parse(file);
            vm.file = $.extend({}, fileJson);
        }
        vm.Chat=[];
        groupChatId=appcan.locStorage.getVal("chat-dialog-groupChatId");
        //这个为0时是单聊，1为群聊。
        peopleChatType=appcan.locStorage.getVal("chatType");
        //获取历史聊天记录
        var pageJson={
            num : 0, 
            size : 10,
            flag1:true,
            isDown:false
        }
        //获取历史聊天记录
        getHistoryMessageById(pageJson); 
    });
    //草稿缓存存储格式是， [{text,code,groupId},{text,code,groupId}];
    var textDraft=appcan.locStorage.getVal("textDraft");
    if(isDefine(textDraft)){
        var textJson=JSON.parse(textDraft);
        for (var i=0; i < textJson.length; i++) {
              if(textJson[i].code==appcan.locStorage.getVal("userCode") && textJson[i].groupId==groupChatId){
                  if(isDefine(textJson[i].text)){
                      var t=(textJson[i].text).replace(/<[^>]+>/g,"");
                      uexChatKeyboard.setText(t);
                  }
              } 
        }
    }
}

/**
 *系统插件的回调 比如uexCamera、uexImage、uexAudio
 */
function systemPlugIns(){
    //结束录制视频的回调
    uexVideo.onRecordFinish = function(info){
        var data=eval("("+info+")");
        //result 为0时是选择了视频
        if(data.result=="0"){
            //发送视频
            sendVideo(data.path);
        }
    };
    //语音停止播放的时动画去掉
    uexAudio.onPlayFinished = function(){
        for (var i=0; i < vm.Chat.length; i++) {
            if(vm.Chat[i].ownerType=="audio"){
                if(vm.Chat[i].isPlay){
                    Vue.set(vm.Chat[i], 'isPlay', false);
                }
            }
        };
        //$(thisOntonchNew).removeClass("play");
    }
}

function setBottomHeight(){
    var keyHeight = uexChatKeyboard.getInputBarHeight();
    
    var keytextFz = 17; //字号目测为17
    var phoneWidth = 0, 
        keyHeightExtraEach = 20;
    var u = navigator.userAgent;
    if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
        phoneWidth = document.documentElement.clientWidth;
    }else{
        phoneWidth = document.documentElement.clientWidth / window.devicePixelRatio;
        keyHeightExtraEach = keyHeightExtraEach*window.devicePixelRatio;
    }
    
    var keytextEach = Math.floor((phoneWidth-142)/keytextFz); //算出每行约多少个字
    
    var jmz = {};
    jmz.GetLength = function(str) {
        //先把中文替换成两个字节的英文, 再计算长度
        return str.replace(/[\u0391-\uFFE5]/g,"aa").length;
    };
    //获取一共有多少个字, 英文半角字符算半个
    var keytextLen = Math.ceil(jmz.GetLength(uexChatKeyboard.getText())/2);
    
    //算出一共多少行字
    var keytextLine = Math.ceil(keytextLen/keytextEach);
    
    var keyHeightExtra = 0;
    if(keytextLine>2 && keytextLine<=4){
        keyHeightExtra = (keytextLine-2)*keyHeightExtraEach;
    }else if(keytextLine>4){
        keyHeightExtra = 2*keyHeightExtraEach;
    }
    $("#chat-box").css("padding-bottom", keyHeight+keyHeightExtra);
}

function onuexChatKey(){
    //这个方法目前没发现有什么用
    uexChatKeyboard.onCommit = function(json){
    };
    //键盘弹起或收起得监听
    uexChatKeyboard.onKeyBoardShow=function(json){
        var statusJson=JSON.parse(json);
        var status=statusJson.status;
        // var keyHeight=uexChatKeyboard.getInputBarHeight();
        if(status=="1"){
            //键盘弹出
            //获取键盘的高度
            //滚动条至最底部
            flag1=true;
            flagBommom=true;
//          $(".choosePic").css("bottom",0);         
            var platForm = appcan.locStorage.getVal("platForm");
            if(platForm=="1"){
                $("#chat-box").css("padding-bottom", 0);
                setTimeout(function(){
                    mescroll_one.scrollTo(99999999, 0);
                }, 200);
            }else{
                //$("#chat-box").css("padding-bottom", keyHeight);
                uexChatKeyboard.changeWebViewFrame($('#chat-box').height());
            }
             //点击执行监听(截图或拍照)信息         
//          uexAlbumLsn.startListen(); 
        }else{
            //键盘收起
            //获取键盘的高度
            //滚动条至最底部
            flag1=true;
            //第一次进来获取历史数据用
            flagBommom=false; 
            var keYsize = 120;
            var text = uexChatKeyboard.getText();
            if(!isDefine(text)){
                keYsize=20;
            }      
//          $(".choosePic").css("bottom",keyHeight);
            var platForm = appcan.locStorage.getVal("platForm");
            if(platForm=="1"){
                setBottomHeight();
                var keyHeight=uexChatKeyboard.getInputBarHeight();
                mescroll_one.scrollTo(99999999, 0);
            }else{
                setTimeout(function(){
                    uexChatKeyboard.changeWebViewFrame($('#chat-box').height());
                   // $(window).scrollTop( $(document).height() - $(window).height());
                }, 750);
            }
        }
        
    }
    //实时监听键盘高度变化 ,width ;height 网页的frame
    uexChatKeyboard.onFrameChanged=function(width ,height){
        //键盘弹出
        if(flagBommom==true){
            var keyHeight=uexChatKeyboard.getInputBarHeight();
            $("#chat-box").css("padding-bottom", 0);
            
            var platForm = appcan.locStorage.getVal("platForm");
            if(platForm=="1"){
                mescroll_one.scrollTo(99999999, 0);
            }else{
                setTimeout(function(){
                    $(window).scrollTop( $(document).height() - $(window).height());
                }, 750);
            }
            
        }
    }
    uexChatKeyboard.onCommitJson = function(json){
        if(appcan.trim(json.emojiconsText)==""){
            layerToast("对不起，您不能发送空消息！");
            return ;
        }
        
        var replaceText = json.emojiconsText.replace(textRegN, "<br>").replace(textRegR, "<br>");
        
        //这个是发送文字
        var MyMessageId=uuid(36,32);
        var param = {
            "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
            "chatType":peopleChatType,//0-单聊,1-群聊
            "content":replaceText,//文本内容
            "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
            "forceNotification":true
            //"pushTitle":appTitle
        };
        uexEasemob.sendText(param);
        //先展示数据，等到发送成功了再赋值
        showMy("text", replaceText, MyMessageId);
    };
    //这个是点击语音的
    uexChatKeyboard.onVoiceAction = function(data){
        var statusJson=JSON.parse(data);
        var status=statusJson.status;
        if(status=="0"){
           //开始录音
           uexAudio.startBackgroundRecord(0,'');
           audioStartTime=new Date().getTime();
        }
        if(status=="1"){
            //结束录音
            uexAudio.stopBackgroundRecord(function (obj){
                if(isDefine(obj)){
                    audioEndTime=new Date().getTime();
                    var audioB=Math.ceil((audioEndTime-audioStartTime)/1000)-1;
                    if(audioB<=1){
                        layerToast("对不起，您录制的语音太短，请重新录制");
                    }else{
                        sendAudio(obj); 
                    }
                }
            });
        }
        if(status=="-1"){
            //取消录音
            uexAudio.stopBackgroundRecord(function (obj){
                if(isDefine(obj)){
                    audioEndTime=new Date().getTime();
                    var audioB=Math.ceil((audioEndTime-audioStartTime)/1000)-1;
                    if(audioB==60){
                        sendAudio(obj); 
                    }
                }
            });
        }
    };
    //点击图片等等。。。
    uexChatKeyboard.onShareMenuItem = function(data){
        //打开相机
        if(data=="0"){
            //拍照
            uexCamera.open(0,50, function(picPath) {
                if(isDefine(picPath)){
                     sendPic(picPath);
                }
            });
        }
        if(data=="1"){
            //打开图片浏览器
            var data={
                min:1,
                max:6,
                title:"ttttt",
                quality:0.5,
                //usePng:true,
                detailedInfo:true
            };
            var json=JSON.stringify(data);
            uexImage.openPicker(json,function(error,info){
                if(error==-1){
                }else if(error==0){
                      var data=info.data;
                      for (var i=0; i < data.length; i++) {
                            //发送图片
                            sendPic(data[i]);
                       };
                }else{
                }
            });
        }
        if(data=="2"){
            //打开视频
            var param={
                "maxDuration":10,
                "qualityType":2,
                "bitRateType":2,
                "fileType":"mp4"
            };
            //视频
            uexVideo.record(JSON.stringify(param));
        }
         
        if(data=="3"){
        //打开文件流
            uexFileMgr.explorer("file:///sdcard/",function(err,path){
                if(!err){
                    if(path.indexOf(".")==-1){
                        layerToast("对不起，暂不支持发送此类文件");
                        return;
                    }
                    var MyMessageId=uuid(36,32);
                    showMy("file",path,MyMessageId);
                    var fileName="";
                    var　files=path.split("/")[path.split("/").length-1];
                    fileName=files.substring(0,files.length-(files.split(".")[files.split(".").length-1]).length-1);
                    var param = {
                        username:groupChatId,//单聊时聊天人的userid或者群聊时groupid
                        chatType:peopleChatType,//0-单聊,1-群聊
                        filePath:path,//图片文件路径
                        displayName:path.split("/")[path.split("/").length-1],//对方接收时显示的文件名(仅iOS需要)
                        ext:appcan.locStorage.getVal("userName")+"#"+MyMessageId+"#"+fileName+"-"+new Date().getTime()+"."+(path.split("/")[path.split("/").length-1]).split(".")[(path.split("/")[path.split("/").length-1]).split(".").length-1],//扩展属性(可选参数,String)
                        "forceNotification":true
                        //extObj:,//扩展参数(iOS 3.0.22, Android 3.0.23新增可选参数,JSONString extObj存在时ext无效).用于环信移动客服功能,详情见[环信移动客服文档]
                    };
                    uexEasemob.sendFile(param);
                }else{
                }
                    
            })
        }
        if(data=="4"){
            alert("进来了");
            var param={
                'username':groupChatId
            }
           uexEasemob.makeVoiceCall(param);
           appcan.locStorage.setVal("callFromCode",groupChatId);
           appcan.window.open("chat-call-people","chat-call-people.html",2);
        }if(data=="5"){
            alert("进来了视频");
            var param={
                'username':groupChatId
            }
           uexEasemob.makeVideoCall(param);
           appcan.locStorage.setVal("callFromCode",groupChatId);
           // appcan.window.open("chat-call-people","chat-call-people.html",2);
        }
    }
    //监听键盘关键字的事件
    uexChatKeyboard.onInputKeyword = function(json) {
        var keyword = json.keyword;
        if(keyword == '@'){
            if(peopleChatType=="1"){
                var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                    appcan.window.open("address-at", "../address/address-at.html", 2);
                }else{
                    appcan.window.open({
                        name:'address-at',
                        dataType:0,
                        data:'../address/address-at.html',
                        aniId:aniId,
                        type:1024
                    });  
                }
                 //打开@页面
                 //appcan.window.open("chat-at@", "chat/chat-at@.html", 2);
            }
        }
    }
}
//点击选择图片发送
//function openlayer(){
//  //清除定时器,隐藏弹出框,防止定时器执行图片路径被删;  
//  clearTimeout(timerSet);
//  $(".choosePic").css("display","none");
//  addConfirm({
//      title:"是否发送这张照片",
//      content:'<img src="'+photoPath+'">',
//      yes:function(i){
//          sendPic(photoPath);
//          photoPath = 'undefined';
//          layerRemove(i);
//      },
//      no:function (i){
//          photoPath = 'undefined';
//          layerRemove(i);
//      }
//  })
//}

function fadeout(ele, opacity, speed) {
    if (ele) {
        var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
        v < 1 && (v = v * 100);
        var count = speed / 1000;
        var avg = (100 - opacity) / count;
        var timer = null;
        timer = setInterval(function() {
            if (v - avg > opacity) {
                v -= avg;
                setOpacity(ele, v);
            } else {
                clearInterval(timer);
            }
        }, 500);
    }
}
/**
 * 发送图片  
 * @param {Object} data 图片地址
 */
function sendPic(data){
    var MyMessageId=uuid(36,32);
    
    showMy("image",data,MyMessageId);
    var param={
        "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
        "chatType":peopleChatType,//0-单聊,1-群聊
        "filePath":data,//图片文件路径
        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
        "forceNotification":true
        //"pushTitle":appTitle
    };
    uexEasemob.sendPicture(param);
    //先展示数据，等到发送成功了再赋值
}
/**
 * 发送语音
 * @param {Object} data 语音地址
 */
function sendAudio(data){
    var audioB=Math.ceil((audioEndTime-audioStartTime)/1000)-1;
    if(audioB==0){
       audioB=1;
    }
    var MyMessageId=uuid(36,32);
    var param = {
        "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
        "chatType":peopleChatType,//0-单聊,1-群聊
        "filePath":data,//语音文件路径
        "length":10,//长度(Android必选,iOS可选)
        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId+"#"+audioB,
        "forceNotification":true
        //"pushTitle":appTitle
    };
    uexEasemob.sendVoice(param);
    //先展示数据，等到发送成功了再赋值
    showMy("audio",data,MyMessageId);
}
/**
 * 发送视频
 * @param {Object} data 视频地址
 */
function sendVideo(data){
    var MyMessageId=uuid(36,32);
    var param = {
        "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
        "chatType":peopleChatType,//0-单聊,1-群聊
        "filePath":data,//视频文件路径
        "length":10,//长度(Android必选,iOS可选)
        "ext":appcan.locStorage.getVal("userName")+"#"+MyMessageId,
        "forceNotification":true
        //"pushTitle":appTitle
    };
    uexEasemob.sendVideo(param);
    //先展示数据，等到发送成功了再赋值
    showMy("video",data,MyMessageId);
}
/**
 * 重新发送， 
 * @param {Object} item message 消息对象
 */
function againSend(item){
    if(item.ownerType=="text"){
        var param = {
            "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
            "chatType":peopleChatType,//0-单聊,1-群聊
            "content":item.messageBody.text.replace(/\r\n/g,"<BR>"),//文本内容
            "ext":appcan.locStorage.getVal("userName")+"@"+item.messageId,
            "forceNotification":true
            //"pushTitle":appTitle
        };
        uexEasemob.sendText(param);
        //定义一个Json对象，将将要发送的消息的id和时间放入json中，然后放到sendMessageArray中。
        var nonDate=new Date().getTime();
        var sendMessageJson={
            "messageId":item.messageId,
            "sendTime":nonDate
        };
        sendMessageArray.push(sendMessageJson);
    }
    if(item.ownerType=="image"){
        var param={
            "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
            "chatType":peopleChatType,//0-单聊,1-群聊
            "filePath":item.messageBody.remotePath,//图片文件路径
            "ext":appcan.locStorage.getVal("userName")+"@"+item.messageId,
            "forceNotification":true
            //"pushTitle":appTitle
        };
        uexEasemob.sendPicture(param);
        //定义一个Json对象，将将要发送的消息的id和时间放入json中，然后放到sendMessageArray中。
        var nonDate=new Date().getTime();
        var sendMessageJson={
            "messageId":item.messageId,
            "sendTime":nonDate
        };
        sendMessageArray.push(sendMessageJson);
    }
    if(item.ownerType=="audio"){
        var param = {
            "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
            "chatType":peopleChatType,//0-单聊,1-群聊
            "filePath":item.messageBody.remotePath,//语音文件路径
            "length":10,//长度(Android必选,iOS可选)
            "ext":appcan.locStorage.getVal("userName")+"@"+item.messageId+"@"+item.audioS,
            "forceNotification":true
            //"pushTitle":appTitle
        };
        uexEasemob.sendVoice(param);
        //定义一个Json对象，将将要发送的消息的id和时间放入json中，然后放到sendMessageArray中。
        var nonDate=new Date().getTime();
        var sendMessageJson={
            "messageId":item.messageId,
            "sendTime":nonDate
        };
        sendMessageArray.push(sendMessageJson);
    }
    if(item.ownerType=="video"){
        var param = {
            "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
            "chatType":peopleChatType,//0-单聊,1-群聊
            "filePath":item.messageBody.remotePath,//视频文件路径
            "length":10,//长度(Android必选,iOS可选)
            "ext":appcan.locStorage.getVal("userName")+"@"+item.messageId,
            "forceNotification":true
            //"pushTitle":appTitle
        };
        uexEasemob.sendVideo(param);
        //定义一个Json对象，将将要发送的消息的id和时间放入json中，然后放到sendMessageArray中。
        var nonDate=new Date().getTime();
        var sendMessageJson={
            "messageId":item.messageId,
            "sendTime":nonDate
        };
        sendMessageArray.push(sendMessageJson);
    }
    if(item.ownerType=="file"){
        var fileName="";
        var path=item.messageBody.remotePath;
        if(path.indexOf("http")==-1){
            var　files=path.split("/")[path.split("/").length-1];
            fileName=files.substring(0,files.length-(files.split(".")[files.split(".").length-1]).length-1);
            var param = {
                username:groupChatId,//单聊时聊天人的userid或者群聊时groupid
                chatType:peopleChatType,//0-单聊,1-群聊
                filePath:item.messageBody.remotePath,//图片文件路径
                displayName:path.split("/")[path.split("/").length-1],//对方接收时显示的文件名(仅iOS需要)
                ext:appcan.locStorage.getVal("userName")+"@"+item.messageId+"@"+fileName+"-"+new Date().getTime()+"."+(path.split("/")[path.split("/").length-1]).split(".")[(path.split("/")[path.split("/").length-1]).split(".").length-1],//扩展属性(可选参数,String)
                "forceNotification":true
                //extObj:,//扩展参数(iOS 3.0.22, Android 3.0.23新增可选参数,JSONString extObj存在时ext无效).用于环信移动客服功能,详情见[环信移动客服文档]
            };
            uexEasemob.sendFile(param);
        }else{
            var filePath="";
            var fileName="";
            var name="";
            if(item.ext.indexOf("#")!=-1){
               filePath=item.ext.split("#")[1];
               name=item.ext.split("#")[3];
            }
            if(item.ext.indexOf("@")!=-1){
               filePath=item.ext.split("@")[1];
               name=item.ext.split("@")[3];
            }
            var　files=name;
            fileName=files.substring(0,files.length-(files.split(".")[files.split(".").length-1]).length-1);
            var param = {
                    "username":groupChatId,//单聊时聊天人的userid或者群聊时groupid
                    "chatType":peopleChatType,//0-单聊,1-群聊
                    "content":"File#"+filePath+"#"+filePath+"#"+name,//视频文件路径
                    "ext":appcan.locStorage.getVal("userName")+"@"+item.messageId+"@"+fileName+new Date().getTime()+"."+name.split(".")[name.split(".").length-1] ,
                    "forceNotification":true
             };
            uexEasemob.sendText(param);
        }
        //定义一个Json对象，将将要发送的消息的id和时间放入json中，然后放到sendMessageArray中。
        var nonDate=new Date().getTime();
        var sendMessageJson={
            "messageId":item.messageId,
            "sendTime":nonDate
        };
        sendMessageArray.push(sendMessageJson);
    }
    
    //将发送失败的圈圈改为正在发送中
    for (var i=0; i < vm.Chat.length; i++) {
        if(vm.Chat[i].messageId==item.messageId){
            Vue.set(vm.Chat[i], 'chatStatus', false);
            Vue.set(vm.Chat[i], 'chatStatusWarning', false);
            break;
        }
    }
}
var clickIndex=0;
var openText="";

/**
 *文字放大操作 
 * @param {Object} item
 */
function textOpenBig(item){
    var platForm=appcan.locStorage.getVal("platForm");
    if(platForm=="1"){
        openText=item.messageBody.text;
        clickIndex++;
        setTimeout(function () {
           clickIndex = 0;
        }, 500);    
        if (clickIndex == 2) {
            if(openText==item.messageBody.text){
                isTextBig=true;
                //打开相应的文字放大的页面
                var txtShow = '<div class="chat-panel-box"><div class="chat-panel-txt">'+item.messageBody.text+'</div></div>';
                //ModalHelper.afterOpen();
                var pageii = layer.open({
                    type: 1,
                    content: txtShow,
                    anim: false,
                    className: 'chat-panel bc-bg'
                });
                appcan.locStorage.setVal('chatcontent', uexChatKeyboard.getText());
                uexChatKeyboard.close();
            }
        }
        openText=item.messageBody.text;
    }
}

/**
 * 打开图片浏览器 
 * @param {Object} item
 */
function openImg(item){
    var index;
    for (var i=0 ; i < jsonPicArrayNew.length; i++) {
        if(jsonPicArrayNew[i]==item.messageBody.remotePath){
            index=i;
            break;
        }
    }
    var data = {
        displayActionButton:true,
        displayNavArrows:true,
        enableGrid:true,
        //startOnGrid:true,
        startIndex:index,
        data:jsonPicArrayNew
    };
    uexImage.openBrowser(data,function(){
    });
}
function openVideo(item){
    uexAudio.stop();
    var platForm=appcan.locStorage.getVal("platForm");
    appcan.locStorage.setVal("poster",item.messageBody.thumbnailRemotePath);
    appcan.locStorage.setVal("videoUrl",item.messageBody.remotePath);
    //Android
    if(platForm=="1"){
        appcan.window.open({
            name: 'chat-video',
            dataType: 0,
            aniId: 0,
            type: 0,
            data: "chat-video.html"
        });
    }else{
        //IOS
        if(item.messageBody.remotePath.indexOf("https")==-1){
            var param = {
                src:item.messageBody.remotePath,
                autoStart:false,
                forceFullScreen:true,
                showCloseButton:true,
                showScaleButton:true,
                scrollWithWeb:true
            };
            uexVideo.openPlayer(JSON.stringify(param));
        }else{
            appcan.file.exists({
                filePath:'wgts://'+item.messageBody.displayName,
                callback:function(err,data,dataType,optId){
                    if(err){
                        //判断文件文件出错了
                        var json={
                            serverUrl:item.messageBody.remotePath,
                            downloadUrl:'wgts://'+item.messageBody.displayName
                        };
                        appcan.plugInDownloaderMgr.download(json,function(e){
                            if(e.status==1){
                                var param = {
                                   src:'wgts://'+item.messageBody.displayName,
                                   autoStart:false,
                                   forceFullScreen:true,
                                   showCloseButton:true,
                                   showScaleButton:true,
                                   scrollWithWeb:true
                               };
                               uexVideo.openPlayer(JSON.stringify(param));
                           }else if(e.status==2){
                           }else{
                           }
                        });
                        return;
                    }
                    if(data == 1){
                        //文件存在
                        var param = {
                            src:'wgts://'+item.messageBody.displayName,
                            autoStart:false,
                            forceFullScreen:true,
                            showCloseButton:true,
                            showScaleButton:true,
                            scrollWithWeb:true
                        };
                        uexVideo.openPlayer(JSON.stringify(param));
                    }else{
                        //文件不存在
                        var json={
                            serverUrl:item.messageBody.remotePath,
                            downloadUrl:'wgts://'+item.messageBody.displayName
                        };
                        appcan.plugInDownloaderMgr.download(json,function(e){
                            if(e.status==1){
                                var param = {
                                    src:'wgts://'+item.messageBody.displayName,
                                    autoStart:false,
                                    forceFullScreen:true,
                                    showCloseButton:true,
                                    showScaleButton:true,
                                    scrollWithWeb:true
                                };
                                uexVideo.openPlayer(JSON.stringify(param));
                            }else if(e.status==2){
                            }else{
                            }
                        });
                    }
                }
            });
        }
    }
}
var audioLastId;
var audioIndex=1;
/**
 *语音播放 
 * @param {Object} item
 */
function  openAudio(item,_this){
    var platForm=appcan.locStorage.getVal("platForm");
    audioIndex++;
    if(platForm!="1"){
        if(item.messageBody.remotePath.indexOf("https")==-1){
            if(item.messageId==audioLastId){
                 if(audioIndex%2==0){
                     uexAudio.pause();
                     for (var i=0; i < vm.Chat.length; i++) {
                         if(vm.Chat[i].messageId==audioLastId){
                             Vue.set(vm.Chat[i],"isPlay",false);
                         }
                     };
                 }else{
                     uexAudio.open(item.messageBody.remotePath);
                     uexAudio.play(0);
                     for (var i=0; i < vm.Chat.length; i++) {
                         if(vm.Chat[i].messageId==item.messageId){
                             Vue.set(vm.Chat[i],"isPlay",true);
                         }
                     };
                 }
             }else{
                 audioIndex=1;
                 for (var i=0; i < vm.Chat.length; i++) {
                     if(vm.Chat[i].messageId==audioLastId){
                        Vue.set(vm.Chat[i],"isPlay",false);
                     }
                     if(vm.Chat[i].messageId==item.messageId){
                         Vue.set(vm.Chat[i],"isPlay",true);
                     }
                 };
                 uexAudio.stop();
                 uexAudio.open(item.messageBody.remotePath);
                 uexAudio.play(0);
             }
             audioLastId=item.messageId;
        }else{
            var json={
                serverUrl:item.messageBody.remotePath,
                downloadUrl:'wgts://'+item.messageBody.displayName
            };
            appcan.plugInDownloaderMgr.download(json,function(e){
                if(e.status==1){
                    if(item.messageId==audioLastId){
                        if(audioIndex%2==0){
                            uexAudio.pause();
                            for (var i=0; i < vm.Chat.length; i++) {
                                if(vm.Chat[i].messageId==audioLastId){
                                    Vue.set(vm.Chat[i],"isPlay",false);
                                }
                            }
                        }else{
                            uexAudio.open('wgts://'+item.messageBody.displayName);
                            uexAudio.play(0);
                            for (var i=0; i < vm.Chat.length; i++) {
                                if(vm.Chat[i].messageId==item.messageId){
                                    Vue.set(vm.Chat[i],"isPlay",true);
                                }
                            }
                        }
                    }else{
                        audioIndex=1;
                        for (var i=0; i < vm.Chat.length; i++) {
                            if(vm.Chat[i].messageId==audioLastId){
                                Vue.set(vm.Chat[i],"isPlay",false);
                            }
                            if(vm.Chat[i].messageId==item.messageId){
                                Vue.set(vm.Chat[i],"isPlay",true);
                            }
                        }
                        uexAudio.stop();
                        uexAudio.open('wgts://'+item.messageBody.displayName);
                        uexAudio.play(0);
                     }
                     audioLastId=item.messageId;
                 }else if(e.status==2){
                 }else{
                 }
            });
        } 
    }else{
         if(item.messageId==audioLastId){
             if(audioIndex%2==0){
                 uexAudio.pause();
                 for (var i=0; i < vm.Chat.length; i++) {
                     if(vm.Chat[i].messageId==audioLastId){
                         Vue.set(vm.Chat[i],"isPlay",false);
                     }
                 }
             }else{
                 uexAudio.open(item.messageBody.remotePath);
                 uexAudio.play(0);
                 for (var i=0; i < vm.Chat.length; i++) {
                     if(vm.Chat[i].messageId==item.messageId){
                         Vue.set(vm.Chat[i],"isPlay",true);
                     }
                 }
             }
         }else{
             audioIndex=1;
             for (var i=0; i < vm.Chat.length; i++) {
                 if(vm.Chat[i].messageId==audioLastId){
                    Vue.set(vm.Chat[i],"isPlay",false);
                 }
                 if(vm.Chat[i].messageId==item.messageId){
                     Vue.set(vm.Chat[i],"isPlay",true);
                 }
             };
             uexAudio.stop();
             uexAudio.open(item.messageBody.remotePath);
             uexAudio.play(0);
         }
         audioLastId=item.messageId;
    }
}
function getHistoryMessageById(page){
    flag1=page.flag1;
    isDown=page.isDown;
    var hisMessageId;
    if(vm.Chat.length==0){
         hisMessageId="";
    }else{
        hisMessageId=vm.Chat[0].messageId;
    }
     var param={};
     var isfirst=false;
     if(!isDefine(hisMessageId)){
          param={
            "username":groupChatId,//单聊时聊天人的userName或者群聊时groupid
            "chatType":peopleChatType,//0-单聊,1-群聊
            "startMsgId":"",
            "pagesize":20//分页大小,为0时获取所有消息(iOS在3.0.21后不支持获取所有消息),startMsgId可不传
        };
        isfirst=true;
     }else{
         param = {
            "username":groupChatId,//单聊时聊天人的userName或者群聊时groupid
            "chatType":peopleChatType,//0-单聊,1-群聊
            "startMsgId":hisMessageId,//获取startMsgId之前的pagesize条消息
            "pagesize":20//分页大小,为0时获取所有消息(iOS在3.0.21后不支持获取所有消息),startMsgId可不传
        };
        isfirst=false;
    }
    uexEasemob.getMessageHistory(JSON.stringify(param),function(data){
        if((!isDefine(data)||!isDefine(data.messages))&& isfirst==false){
            layerToast("对不起，查询不到历史聊天记录！");
            mescroll_one.endSuccess(20);
            return;
        }else{
            var messageLength=data.messages.length;
            if(messageLength==0){
                mescroll_one.endSuccess(20);
                //appcan.window.openToast("对不起，查询到的历史聊天记录为空！",'2000');
                //return;
            }else if(messageLength>20){
                var r=data.messages.length-20;
                data.messages.splice(0,r);
                showHistoryMessage(data);
            }else{
                showHistoryMessage(data);
            } 
        }
    });
}
function controlButton(){
    var chatMessageOnlong=JSON.parse(appcan.locStorage.getVal("chatMessageOnlong"));
    if(!chatMessageOnlong.chatStatus){
        return ;
    }
    var json={
        copytext:true,
        saveImg:true,
        task:true,
        revoke:true,
        remove:true,
        Forwarding:true
    };
    if(chatMessageOnlong.ownerType=="text"){
        var textCopy=  (chatMessageOnlong.messageBody.text.replace(/<br>/g,"\n")).replace(/<[^>]+>/g,"");
        if(!isDefine(textCopy)){
           json.copytext=false;
           json.task=false;
        }
        json.saveImg=false;
    }else if(chatMessageOnlong.ownerType=="image"){
        //alert(JSON.stringify(chatMessageOnlong));
        json.copytext=false;
    }else if(chatMessageOnlong.ownerType=="video"){
        json.copytext=false;
        json.saveImg=false;
        json.task=false;
    }else if(chatMessageOnlong.ownerType=="audio"){
        json.copytext=false;
        json.saveImg=false;
        json.task=false;
        json.Forwarding=false;
        
    }else if(chatMessageOnlong.ownerType=="file"){
        json.copytext=false;
        json.saveImg=false;
        json.task=false;
    }else if(chatMessageOnlong.ownerType=="dutyProblem"){
        json.copytext=false;
        json.saveImg=false;
        json.task=false;
    }else if(chatMessageOnlong.ownerType=="taskShare"){
        json.copytext=false;
        json.saveImg=false;
        json.task=false;
    }
    //别人的消息不能撤回。
    if(chatMessageOnlong.isOthers){
        json.revoke=false;
    }
    vm.shadeChat=json;
    $('#shadeChat').removeClass('hide');
    
    vm.longtapFlag = 1;
}
/**
 *文字复制功能 
 */
function copyText(e){
    if(!vm.longtapFlag)return;
    
    var chatMessageOnlong=JSON.parse(appcan.locStorage.getVal("chatMessageOnlong"));
    //文件的内容
    var textCopy = (chatMessageOnlong.messageBody.text.replace(/<br>/g,"\n")).replace(/<[^>]+>/g,"");
    //消息类型：1为文字、2为图片、3为视频、4为语音
    uexClipboard.copy(textCopy);
    //$('#shadeChat').addClass('hide no-click');
    //$('.chat-bubble.no-click').removeClass('no-click');
}
/**
 *图片保存操作 
 */
function savePic(e){
    if(!vm.longtapFlag)return;
    
    var PicName;
    var chatMessageOnlong=JSON.parse(appcan.locStorage.getVal("chatMessageOnlong"));
    var downloader =uexDownloaderMgr.create();
    if(downloader){
        var textCopy= chatMessageOnlong.messageBody.remotePath; 
        PicName=textCopy.split("/")[textCopy.split("/").length-1];
        var pi;
        if(PicName.indexOf(".")!=-1){
            pi=PicName;
            var data={
                localPath:textCopy,
            };
            uexImage.saveToPhotoAlbum(data,function(err,errStr){
                if(!err){
                    layerToast('图片已保存到本地');
                }else{
                    layerToast('该图片已在本地保存过');
                }
    			//$('#shadeChat').addClass('hide no-click');
    			//$('.chat-bubble.no-click').removeClass('no-click');
            });
        }else{
            pi=PicName+".jpg";
            uexDownloaderMgr.download(downloader,textCopy,"wgts://"+pi,1,function(fileSize, percent, status){
                switch (status) {
                    case 0:
                        return;
                        break;
                    case 1:
                        uexDownloaderMgr.closeDownloader(downloader);
                        var data={
                            localPath:"wgts://"+pi,
                        };
                        uexImage.saveToPhotoAlbum(data,function(err,errStr){
                            if(!err){
                                 layerToast('图片已保存到本地');
                            }else{
                                 layerToast('该图片已在本地保存过');
                            }
                        });
                        //$('#shadeChat').addClass('hide no-click');
    					//$('.chat-bubble.no-click').removeClass('no-click');
                        break;
                    case 2:
                        uexDownloaderMgr.closeDownloader(downloader);
                    break;
                }
            });
        }
    }
}
/**
 *消息撤回 
 */
function revokeMsg(e){
    if(!vm.longtapFlag)return;
    
    var chatMessageOnlong=JSON.parse(appcan.locStorage.getVal("chatMessageOnlong"));
    var timeCha = (new Date().getTime()-Number(chatMessageOnlong.messageTime))/1000/60;
    if(timeCha<=200){
        for (var i=0; i < vm.Chat.length; i++) {
            if(vm.Chat[i].messageId==chatMessageOnlong.messageId){
                Vue.set(vm.Chat[i], 'isRevoke', true);
                //谁撤回的用户名
                Vue.set(vm.Chat[i], 'chatFromUser', "您已");
            }
        }
        //这个是发送透传消息的， 告诉所有终端将这条要撤回的消息都删除本地消息及服务器消息
        var param2 = {
            "chatType":peopleChatType,//0-单聊,1-群聊
            "action":appcan.locStorage.getVal("userName")+"@messageIdKey="+chatMessageOnlong.messageId,
            "toUsername":groupChatId
        };
        uexEasemob.sendCmdMessage(param2);
        var platForm=appcan.locStorage.getVal("platForm");
        if(platForm=="1"){
            //Android
            var param={
                 from:appcan.locStorage.getVal("userCode"),
                 to:groupChatId,
                 messageId:chatMessageOnlong.messageId,
                 chatType:peopleChatType,
                 setMsgTime:chatMessageOnlong.messageTime,
                 msgText:"您已撤回了一条消息！",
                 ext:appcan.locStorage.getVal("userName")+"@"+chatMessageOnlong.messageId
             };
             uexEasemob.updateMsg(param);
        }
        else{
            //IOS
            var param = {
                "username":groupChatId,//username | groupid
                "msgId":chatMessageOnlong.messageId,
                "chatType":peopleChatType//0-个人 1-群组(默认0,此参数仅iOS需要)
            };
            //删除当前会话的某条聊天记录
            uexEasemob.removeMessage(param);
        }
        //停止播放语音。
        uexAudio.stop();
        //撤回消息容器隐藏
    }else{
        layerToast('对不起，超过2分钟的消息无法撤回!');
    }
    //$('#shadeChat').addClass('hide no-click');
    //$('.chat-bubble.no-click').removeClass('no-click');
}
/**
 * 删除消息 
 */
function removeMsg(e){
    if(!vm.longtapFlag)return;
    
    var chatMessageOnlong=JSON.parse(appcan.locStorage.getVal("chatMessageOnlong"));
    var removeMsId= chatMessageOnlong.messageId;
    for (var i=0; i < vm.Chat.length; i++) {
        if(vm.Chat[i].messageId==removeMsId){
            vm.Chat.splice(i, 1);
            break;
        }
    }
    var param = {
        "username":groupChatId,//username | groupid
        "msgId":removeMsId,
        "chatType":peopleChatType//0-个人 1-群组(默认0,此参数仅iOS需要)
    };
    //删除当前会话的某条需要撤回的消息记录
    uexEasemob.removeMessage(param);  
    
    //$('#shadeChat').addClass('hide no-click');
    //$('.chat-bubble.no-click').removeClass('no-click');
    appcan.window.publish("loadRecent");
}
/**
 *消息转发 
 */
function msgReSend(e){
    if(!vm.longtapFlag)return;
    
    //$('#shadeChat').addClass('hide no-click');
    //$('.chat-bubble.no-click').removeClass('no-click');
    var platForm=appcan.locStorage.getVal("platForm");
    var aniId=0;
    //Android
    if(platForm=="1"){
        appcan.window.open("chat-forward","chat-forward.html",2);
    }else{
        appcan.window.open({
            name:'chat-forward',
            dataType:0,
            data:'chat-forward.html',
            aniId:aniId,
            type:1024
        });  
    }
}
function taskSend(e){
    if(!vm.longtapFlag)return;
    
    //$('#shadeChat').addClass('hide no-click');
    //$('.chat-bubble.no-click').removeClass('no-click');
    var chatMessageOnlong=JSON.parse(appcan.locStorage.getVal("chatMessageOnlong"));
    if(chatMessageOnlong.ownerType=="text"){
        addConfirm({
            title: '确定指派为任务吗？',
            content: '<div class="in3line"><span class="fz-md fc-title">'+filterBrow(chatMessageOnlong.messageBody.text)+'</span></div>',
            yes: function(i){
                layerRemove(i);
                appcan.locStorage.setVal("ischatTotask","true");
                $("#shadeChat").addClass("hide");
                var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                    appcan.window.open('task-send',"../task/task-send.html",2);
                }else{
                    appcan.window.open({
                        name:'task-send',
                        dataType:0,
                        data:'../task/task-send.html',
                        aniId:aniId,
                        type:1024
                    });  
                }
            }
        });
    }
    if(chatMessageOnlong.ownerType=="image"){
        addConfirm({
            title: '确定指派为任务吗？',
            content: '<img src="'+chatMessageOnlong.messageBody.remotePath+'">',
            yes: function(i){
                layerRemove(i);
                appcan.locStorage.setVal("ischatTotask","true");
                $("#shadeChat").addClass("hide");
                var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                    appcan.window.open('task-send',"../task/task-send.html",2);
                }else{
                    appcan.window.open({
                        name:'task-send',
                        dataType:0,
                        data:'../task/task-send.html',
                        aniId:aniId,
                        type:1024
                    });  
                }
            }
        });
    }
}
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
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