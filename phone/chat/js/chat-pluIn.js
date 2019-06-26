function getRecent(callback) {
    var platForm=appcan.locStorage.getVal("platForm");
    uexEasemob.getRecentChatters(function(data) {
        // alert(JSON.stringify(data));
        var ext,
            text,
            messageTime;
        for (var i = 0; i < data.length; i++) {
            if(data[i].hasOwnProperty("lastMsg")){
               data[i].chatType=data[i].lastMsg.chatType;
               data[i].isGroup=data[i].lastMsg.isGroup;
            
            //解析数据判断消息的附加字段里有发送消息的用户名，用它来展示谁发送的消息，#是正常发送的消息，@为重新发送的消息。
            if (data[i].lastMsg.ext.indexOf("#") != -1) {
                ext = data[i].lastMsg.ext.split("#")[0];
                data[i].lastMsg.ext = ext+":";
            } else {
                ext = data[i].lastMsg.ext.split("@")[0];
                data[i].lastMsg.ext = ext+":";
            }
            //Android
            if(platForm=="1"){
                if (data[i].lastMsg.hasOwnProperty("extObj")){
                    
                        if (data[i].lastMsg.from == appcan.locStorage.getVal("userCode")) {
                            data[i].lastMsg.messageBody.ownerText = "您已撤回了一条消息！";
                        } else {
                            data[i].lastMsg.messageBody.ownerText = ext + "已撤回了一条消息！";
                        }
                     
                }else {
                    //根据消息类型来展示不同类型的数据。
                    if (data[i].lastMsg.messageType == "text") {
                        if (data[i].lastMsg.messageBody.text.indexOf("Video#") != -1) {
                            data[i].lastMsg.messageBody.ownerText = "[视频]";
                        }
                        if (data[i].lastMsg.messageBody.text.indexOf("Picture#") != -1) {
                            data[i].lastMsg.messageBody.ownerText = "[图片]";
                        }
                        if (data[i].lastMsg.messageBody.text.indexOf("File#") != -1) {
                            data[i].lastMsg.messageBody.ownerText = "[文件]";
                        }
                        if (data[i].lastMsg.messageBody.text.indexOf("DutyProblem#") != -1) {
                            data[i].lastMsg.messageBody.ownerText = "分享了[值班问题]";
                        }
                        if (data[i].lastMsg.messageBody.text.indexOf("TaskShare#") != -1) {
                            data[i].lastMsg.messageBody.ownerText = "分享了[任务]";
                        }
                        if (data[i].lastMsg.messageBody.text.indexOf("Picture#") == -1 && data[i].lastMsg.messageBody.text.indexOf("Video#") == -1 && data[i].lastMsg.messageBody.text.indexOf("File#") == -1 && data[i].lastMsg.messageBody.text.indexOf("DutyProblem#") == -1 && data[i].lastMsg.messageBody.text.indexOf("TaskShare#") == -1) {
                            //这个filterBrow2方法在globalvariable.js中是处理为文本的消息中有表情的，直接展示出表情。
                            text = filterBrow(data[i].lastMsg.messageBody.text);
                            data[i].lastMsg.messageBody.ownerText = text.replace(/\<BR>/g, "").replace(/\<br>/g, "");
                        }
                    } else if (data[i].lastMsg.messageType == "image") {
                        data[i].lastMsg.messageBody.ownerText = "[图片]";
                    } else if (data[i].lastMsg.messageType == "audio") {
                        data[i].lastMsg.messageBody.ownerText = "[语音]";
                    } else if (data[i].lastMsg.messageType == "video") {
                        data[i].lastMsg.messageBody.ownerText = "[视频]";
                    }else if (data[i].lastMsg.messageType == "file") {
                        data[i].lastMsg.messageBody.ownerText = "[文件]";
                    }
                }
            }else{
                //IOS
                     if(!data[i].lastMsg.extObj.hasOwnProperty("ext")){
                        if (data[i].lastMsg.from == appcan.locStorage.getVal("userCode")) {
                            data[i].lastMsg.messageBody.ownerText = "您已撤回了一条消息！";
                        } else {
                            data[i].lastMsg.messageBody.ownerText = ext + "已撤回了一条消息！";
                        }
                     }else{
                         //根据消息类型来展示不同类型的数据。
                        if (data[i].lastMsg.messageType == "text") {
                            if (data[i].lastMsg.messageBody.text.indexOf("Video#") != -1) {
                                data[i].lastMsg.messageBody.ownerText = "[视频]";
                            }
                            if (data[i].lastMsg.messageBody.text.indexOf("Picture#") != -1) {
                                data[i].lastMsg.messageBody.ownerText = "[图片]";
                            }
                            if (data[i].lastMsg.messageBody.text.indexOf("File#") != -1) {
                                data[i].lastMsg.messageBody.ownerText = "[文件]";
                            }
                            if (data[i].lastMsg.messageBody.text.indexOf("DutyProblem#") != -1) {
                                data[i].lastMsg.messageBody.ownerText = "分享了[值班问题]";
                            }
                            if (data[i].lastMsg.messageBody.text.indexOf("TaskShare#") != -1) {
                                data[i].lastMsg.messageBody.ownerText = "分享了[任务]";
                            }
                            if (data[i].lastMsg.messageBody.text.indexOf("Picture#") == -1 && data[i].lastMsg.messageBody.text.indexOf("Video#") == -1 && data[i].lastMsg.messageBody.text.indexOf("File#") == -1 && data[i].lastMsg.messageBody.text.indexOf("DutyProblem#") == -1 && data[i].lastMsg.messageBody.text.indexOf("TaskShare#") == -1) {
                                //这个filterBrow2方法在globalvariable.js中是处理为文本的消息中有表情的，直接展示出表情。
                                text = filterBrow(data[i].lastMsg.messageBody.text);
                                data[i].lastMsg.messageBody.ownerText = text.replace(/\<BR>/g, "").replace(/\<br>/g, "");
                            }
                        } else if (data[i].lastMsg.messageType == "image") {
                            data[i].lastMsg.messageBody.ownerText = "[图片]";
                        } else if (data[i].lastMsg.messageType == "audio") {
                            data[i].lastMsg.messageBody.ownerText = "[语音]";
                        } else if (data[i].lastMsg.messageType == "video") {
                            data[i].lastMsg.messageBody.ownerText = "[视频]";
                        }else if (data[i].lastMsg.messageType == "file") {
                            data[i].lastMsg.messageBody.ownerText = "[文件]";
                        }
                     }
            }
            //如果是个人的话，那么他的会话标题为他的名字。否则是群名称。
            if (data[i].lastMsg.chatType == "0") {
                var headUrl = "";
                var fromName = "";
                var headPicJson = JSON.parse(appcan.locStorage.getVal("allPeopleHeadImg"));
                for (var k = 0; k < headPicJson.length; k++) {
                    if (data[i].chatter == headPicJson[k].username) {
                        fromName = headPicJson[k].realname;
                        break;
                    }
                };
                if (fromName == '') {
                    fromName = ext;
                }
                data[i].groupName = fromName;
            } else {
                //群头像默认为当前头像。
                data[i].headPic = "../icon/other/groupheadpic.png";
            }
            //处理最后一条消息的时间展示。
            messageTime = timeStemp(Number(data[i].lastMsg.messageTime), 'yyyy-MM-dd HH:mm').commonDate;
            data[i].lastMsg.messageTime = messageTime;
            if (data[i].lastMsg.chatType == "0") {

                loadAllPeopleInfo(data[i]);
            } else {
                
                if(!data[i].hasOwnProperty("groupName")){
                    /*
                    data.splice(i, 1);
                                        i=i-1;
                                        continue;*/
                    var groupJsonList=appcan.locStorage.getVal("groupJsonList");
                    if(isDefine(groupJsonList)){
                        groupJsonList=JSON.parse(groupJsonList);
                        for (var g=0; g < groupJsonList.length; g++) {
                            if(groupJsonList[g].groupId==data[i].chatter){
                                data[i].groupName= groupJsonList[g].groupName;
                                break;
                            }
                        };
                        if(!data[i].hasOwnProperty("groupName")){
                            data.splice(i, 1);
                            i=i-1;
                            continue;
                        }
                    }else{
                        data.splice(i, 1);
                        i=i-1;
                        continue;
                    }
                                       
                    
                }
                 var r= data[i].groupName.split(",");
                 var peoples=new Array();
                   if(r.length>1){
                           for (var h=0; h < 4; h++) {
                               var s="";
                               if(r.length>h){
                                   s=(r[h]).substring(0,1);
                               }
                                var p={
                                    head_image:'',
                                    userName:s
                                }
                                peoples.push(p);
                           };
                        
                   }else{
                       for (var  h=0; h < 4; h++) {
                              var s=r[0].substring(h,h+1);
                              var p={
                                    head_image:'',
                                    userName:s
                                }
                              peoples.push(p);
                       };
                   }
                data[i].people=peoples;
            }
            data[i].checked=false;
            //草稿缓存存储格式是， [{text,code,groupId},{text,code,groupId}];
            var textDraft=appcan.locStorage.getVal("textDraft");
            if(isDefine(textDraft)){
                var textJson=JSON.parse(textDraft);
                for (var j=0; j < textJson.length; j++) {
                      if(textJson[j].code==appcan.locStorage.getVal("userCode") && textJson[j].groupId==data[i].chatter){
                          if(isDefine(textJson[j].text)){
                                   if(data[i].lastMsg.chatType=='1'){
                                       data[i].draft="[草稿]";
                                       data[i].lastMsg.ext='';
                                       data[i].lastMsg.messageBody.ownerText=textJson[j].text;
                                   }else{
                                       data[i].draft="[草稿]";
                                       data[i].lastMsg.messageBody.ownerText=textJson[j].text;
                                   }
                          }
                          break;
                      } 
                };
            }else{
                data[i].draft="";
            }
            
            
          }else{
              data.splice(i, 1);
              i=i-1;
          }
            
        };
        if(data.length>0){
            
            //Android
            if(platForm=="1"){
               //Android
                vm.recent = data;
            //用于过滤作用
                vm.recentQuery=vm.recent;
            }else{
                vm.recent = data.reverse();
            //用于过滤作用
                vm.recentQuery=vm.recent;
            }
            setHeadPic(data);
        }else{
            vm.recent=[];
            vm.recentQuery=[];
        }
        
        // 匿名函数回调, 存在即执行
        callback && callback(data);
    });
}

function getGroup() {
    var param = {
        loadCache : false//是否从本地加载缓存,(默认为false,从网络获取)
    };
    uexEasemob.getGroupsFromServer(param, function(data) {
        if (data.result == "1"||data.result ==1) {
            layerToast("获取群列表失败,请检查网络环境！");
        } else {
            var groupJsonList=new Array();
            for (var i = 0; i < data.grouplist.length; i++) {
                var groupJson={
                    "groupName":data.grouplist[i].groupName,
                    "groupId":data.grouplist[i].groupId,
                };
                groupJsonList.push(groupJson);
                var r= data.grouplist[i].groupName.split(",");
                 var peoples=new Array();
                   if(r.length>1){
                           for (var h=0; h < 4; h++) {
                               var s="";
                               if(r.length>h){
                                   s=(r[h]).substring(0,1);
                               }
                                var p={
                                    head_image:'',
                                    userName:s
                                }
                                peoples.push(p);
                           };
                        
                   }else{
                       for (var  h=0; h < 4; h++) {
                              var s=r[0].substring(h,h+1);
                              var p={
                                    head_image:'',
                                    userName:s
                                }
                              peoples.push(p);
                       };
                   }
                data.grouplist[i].people=peoples;
                data.grouplist[i].chatType = "1";
            };
            if(groupJsonList.length>0){
                appcan.locStorage.setVal("groupJsonList",JSON.stringify(groupJsonList));
            }
            if(data.grouplist.length>0){
                
                vm.grouplist = data.grouplist;
                //用于过滤作用
                vm.grouplistQuery=vm.grouplist;
                setHeadPic(data.grouplist);
            }else{
                vm.grouplist=[];
                vm.grouplistQuery=[];
            }
            
        }
    })
}

//加载群成员
function loadAllPeopleInfo(data) {
    var allPeopleHeadImg = appcan.locStorage.getVal("allPeopleHeadImg");
    if (isDefine(allPeopleHeadImg)) {
        var allPeoples = JSON.parse(allPeopleHeadImg);
        var peopels = new Array();
        for (var j = 0; j < allPeoples.length; j++) {
            if (data.chatter == allPeoples[j].username) {
                peopels.push(allPeoples[j]);
                data.people = peopels;
                break;
            }
        };
    }else{
        var peopels = new Array();
        var json={
            head_image:'',
            realname:data.groupName,
            username:data.chatter,
            id:data.chatter
        }
        peopels.push(json);
        data.people = peopels;
    }

}
