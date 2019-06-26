//isManager 是否为群主, 1则可修改群名称和群公告, 0则无操作
var groupChatId;
var vm = new Vue({
    el: '#chat-file-group',
    data: {
        people: [
            // {
                // userExt1: '',
                // userName: '武宇',
                // userNameShort: '武宇',
                // userCode: 'wuyu',
                // userSex: '',
                // userMail: '',
                // userPhone: '',
                // userDept: '',
                // userSign: ''
            // },
            // {
                // userExt1: '',
                // userName: '黄浩',
                // userNameShort: '黄浩',
                // userCode: 'huanghao',
                // userSex: '',
                // userMail: '',
                // userPhone: '',
                // userDept: '',
                // userSign: ''
            // }
        ],
        group: {
            name: '群聊',
            notice: '无',
            isDisturb: 0,
            isOnTop: 2,
            isManager: 1
            
        },
        managerName:'',
        managerCode:'',
        platForm:1
    },
    methods: {
        headpicReplace: function(vals){
            //加载头像失败, 替换成文字图像
            Vue.set(vals, 'hashead', false);
        },
        seeFile: function(vals){
            appcan.locStorage.setVal('thispeoplefile', JSON.stringify(vals));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('chat-file-people', 'chat-file-people.html', 2);
            }else{
                 appcan.window.open({
                    name:'chat-file-people',
                    dataType:0,
                    data:'chat-file-people.html',
                    aniId:aniId,
                    type:1024
                  });  
            }
            
        },
        updatePushServiceForGroup:function(e){
            /*if(e==1){
                    vm.group.isDisturb=0;
              }else{
                    vm.group.isDisturb=1;
              }*/
            
            var platForm = appcan.locStorage.getVal("platForm");
                        var isPu=0;
                        if(e==1){
                            isPu=0;
                            Vue.set(vm.group,"isDisturb",0);
                        }else{
                            isPu=1;
                            Vue.set(vm.group,"isDisturb",1);
                        }
                       var isPushArr= appcan.locStorage.getVal("isPushArr");
                       if(isDefine(isPushArr)){
                           var isPushJson=JSON.parse(isPushArr);
                           var isHasKey=false;
                           for (var i=0; i < isPushJson.length; i++) {
                             if(isPushJson[i].groupId==groupChatId && isPushJson[i].userCode==appcan.locStorage.getVal("userCode")){
                                 if(isPu==0){
                                     isPushJson[i].isPush=false;
                                     isPu=2;
                                 }else{
                                     isPushJson[i].isPush=true;
                                     isPu=1;
                                 }
                                 isHasKey=true;
                                 if(platForm=="1"){
                                   // var androidJson={"groupId":groupChatId,"isPush":isPushJson[i].isPush};
                                   // var jsonString=JSON.stringify(androidJson);
                                   // uexEasemob.updatePushServiceForGroup(jsonString);
                                 }else{
                                       var param = {
                                           "groupId":groupChatId,
                                           "isIgnore":isPu
                                        }
                               
                                       uexEasemob.ignoreGroupPushNotification(param,function(data){
                                       })
                                 }
                                 break;
                             }
                           };
                           if(!isHasKey){
                               var pushjson={
                                  groupId:groupChatId,
                                  isPush:true,
                                  userCode:appcan.locStorage.getVal("userCode")
                               }
                               isPushJson.push(pushjson);
                               if(platForm=="1"){
                                   //开启免打扰
                                  // var androidJson={"groupId":groupChatId,"isPush":true};
                                  // var jsonString=JSON.stringify(androidJson);
                                   //uexEasemob.updatePushServiceForGroup(jsonString);
                               }else{
                                   //开启免打扰 1 2 取消屏蔽
                                   var param = {
                                           "groupId":groupChatId,
                                           "isIgnore":1
                                        }
                                   uexEasemob.ignoreGroupPushNotification(param,function(data){
                                   })
                               }
                           }
                           appcan.locStorage.setVal("isPushArr",isPushJson);
                           
                       }else{
                           var isPush=false;
                           if(isPu==0){
                               //接受推送
                                 isPush=false;
                                 isPu=2;
                           }else{
                               //屏蔽
                                 isPush=true;
                                 isPu=1;
                           }
                           var arr=new Array();
                           
                           var pushjson={
                                  groupId:groupChatId,
                                  isPush:isPush,
                                  userCode:appcan.locStorage.getVal("userCode")
                           }
                           arr.push(pushjson);
                           appcan.locStorage.setVal("isPushArr",arr);
                           if(platForm=="1"){
                              // var androidJson={"groupId":groupChatId,"isPush":isPush};
                              // var jsonString=JSON.stringify(androidJson);
                               //uexEasemob.updatePushServiceForGroup(jsonString);
                           }else{
                               //开启免打扰 1 2 取消屏蔽
                               var param = {
                                       "groupId":groupChatId,
                                       "isIgnore":isPu
                                    }
                               uexEasemob.ignoreGroupPushNotification(param,function(data){
                               })
                           }
                       }
                         
            
            
        },
        getNoPushGroup:function(e){
            var isPu=2;
            if(e==2){
                isPu=0;
                vm.group.isOnTop=0;
            }else{
                isPu=2;
                vm.group.isOnTop=2;
            }
           var param = {
                 noDisturbingStyle:isPu//是否开启免打扰模式 0-全天免打扰 1-自定义时段免打扰 2- 关闭免打扰
           };
           var isAllDayNoPush=appcan.locStorage.getVal("allDayNoPush");
           if(isDefine(isAllDayNoPush)){
               //是否是自己的全天免打扰
               var isMySelf=false;
               var json=JSON.parse(isAllDayNoPush);
               for (var i=0; i < json.length; i++) {
                    if(json[i].userCode==appcan.locStorage.getVal("userCode")){
                        json[i].isOnTop=isPu;
                        isMySelf=true;
                        break;
                    }
               };
               if(!isMySelf){
                   var arr={
                      isOnTop   :isPu,
                      userCode  :appcan.locStorage.getVal("userCode")
                   }
                   json.push(arr);
               }
               appcan.locStorage.setVal("allDayNoPush",json);
           }else{
               var arr=new Array();
               var json={
                   isOnTop   :isPu,
                   userCode  :appcan.locStorage.getVal("userCode")
               }
               arr.push(json);
               appcan.locStorage.setVal("allDayNoPush",arr);
           }
           uexEasemob.updatePushOptions(param,function(data){
           }) 
        },
        addGroupMe:function(){
            appcan.locStorage.setVal('address-pick-from', 'chat-addpeople');
            appcan.locStorage.setVal('groupmember', JSON.stringify(vm.people));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('address-pick', '../address/address-pick.html', 2);
            }else{
                 appcan.window.open({
                    name:'address-pick',
                    dataType:0,
                    data:'../address/address-pick.html',
                    aniId:aniId,
                    type:1024
                  });  
            }
        },
        kickGroupMe:function(){
            appcan.locStorage.setVal('groupmember', JSON.stringify(vm.people));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('chat-kick', 'chat-kick.html', 2);
            }else{
                 appcan.window.open({
                    name:'chat-kick',
                    dataType:0,
                    data:'chat-kick.html',
                    aniId:aniId,
                    type:1024
                  });  
            }
        },
        outGroup:function(){
            //如果vm.group.isManager为1则表示是群主，否则是群成员，群主可解散群，群成员可退出该群。
            if(vm.group.isManager==0){
                //退出该群聊
                addConfirm({
                            content: '确定退出该群聊吗？',
                            yes: function(i) {
                                layerRemove(i);
                                 var param = {
                                     groupId:groupChatId
                                  };
                                uexEasemob.exitFromGroup(param);
                                setTimeout(function() { 
                                    appcan.window.publish("loadRecentOutGroup","loadRecentOutGroup");
                                    appcan.locStorage.remove('groupmember');
                                    appcan.locStorage.remove('groupname');
                                    appcan.locStorage.remove('groupnotice');
                                    var closeArr = ['chat-file-group','chat-dialog'];
                                    closeArr.forEach(function(name){
                                        appcan.window.evaluateScript({
                                            name:name,
                                            scriptContent:'appcan.window.close(13);'
                                        });
                                    });
                                }, 500); 
                            }
                    });
            }else{
                 //解散该群聊
                addConfirm({
                            content: '确定解散该群聊吗？',
                            yes: function(i) {
                                layerRemove(i);
                                var param = {
                                    groupId:groupChatId
                                };
                                uexEasemob.exitAndDeleteGroup(param);
                                setTimeout(function() { 
                                    appcan.window.publish("loadRecentDisbandGroup","loadRecentDisbandGroup");
                                    appcan.locStorage.remove('groupmember');
                                    appcan.locStorage.remove('groupname');
                                    appcan.locStorage.remove('groupnotice');
                                    var closeArr = ['chat-file-group','chat-dialog'];
                                    closeArr.forEach(function(name){
                                        appcan.window.evaluateScript({
                                            name:name,
                                            scriptContent:'appcan.window.close(13);'
                                        });
                                    });
                                }, 500);
                            }
                    });
            }
        },
        clearGroupRecent:function(){
            
        }
    }
});

var access_token;
var thisfileJson;
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
        appcan.locStorage.remove('groupmember');
        appcan.locStorage.remove('groupname');
        appcan.locStorage.remove('groupnotice');
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    appcan.ready(function() {
        var isAndroid=appcan.locStorage.getVal("platForm");
        if(isAndroid=="1"){
            vm.platForm=1;
        }else{
            vm.platForm=0;
        }
        appcan.window.subscribe('chat-file-group-name', function(msg){
            vm.group.groupName = msg;
            appcan.locStorage.setVal('groupname', vm.group.groupName);
            appcan.window.publish("changGroupName",vm.group.groupName);
            layerToast('修改群名称成功！');
        });
        appcan.window.subscribe('chat-file-group-notice', function(msg){
            vm.group.groupDescription = msg;
            appcan.locStorage.setVal('groupnotice', vm.group.groupDescription);
            layerToast('修改群公告成功！');
        });
        getToken();
        //加人
        appcan.window.subscribe("chat-addpeople-from-address-pick",function(msg){
            var meJson=JSON.parse(msg);
            var meArr=new Array();
            for (var i=0; i < meJson.length; i++) {
                 meArr.push(meJson[i].userCode);
            };
              var thisfile = JSON.parse(appcan.locStorage.getVal('thisgroupfile'));
              var groupId;
                if(thisfile.hasOwnProperty("chatter")){
                    groupId=thisfile.chatter;
                }else{
                    groupId=thisfile.groupId;
                }
            var param = {
                    groupId:groupId,//群聊id
                    newmembers:meArr,//群聊成员,为空时这个创建的群组只包含自己
                    inviteMessage:""
            };
            var platForm = appcan.locStorage.getVal("platForm");
            if(platForm=="1"){
                addGroupMemers(groupId,meArr);
            }else{
                addGroupMemers(groupId,meArr);
            }
        })
        //减人
        appcan.window.subscribe("chat-kick",function(msg){
            var user="";
            //要删除的人
            var p=JSON.parse(msg);
            for (var i=0; i < p.length; i++) {
                user=user+p[i].userCode+",";
                for (var j=0; j < vm.people.length; j++) {
                   if(vm.people[j].userCode==p[i].userCode){
                       vm.people.splice(j,1);
                   }
                };
            };
            user=user.substring(0,user.length-1);
            getToken();
            var thisfile = JSON.parse(appcan.locStorage.getVal('thisgroupfile'));
            var groupId;
                if(thisfile.hasOwnProperty("chatter")){
                    groupId=thisfile.chatter;
                }else{
                    groupId=thisfile.groupId;
                }
            deleteGroupUser(groupId,user);
        })
        //获取、合并数据
        var thisfile = appcan.locStorage.getVal('thisgroupfile');
        if(isDefine(thisfile)){
              thisfileJson = JSON.parse(thisfile);
            if(thisfileJson.hasOwnProperty("chatter")){
                //从会话列表过来的
                getToken1(thisfileJson,0);
            }else{
                getToken1(thisfileJson,1);
            }
        }
        var platFormC=appcan.locStorage.getVal("platForm");
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            appcan.locStorage.remove('groupmember');
            appcan.locStorage.remove('groupname');
            appcan.locStorage.remove('groupnotice');
            appcan.window.close(1);
        }
        //setHeadPic(vm.people);
        
    });
    
    
    //更多群成员
    $('#more').on('click', function(e){
        if(vm.people.length>16){
            appcan.locStorage.setVal('groupmember', JSON.stringify(vm.people));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('chat-file-group-more', 'chat-file-group-more.html', 2);
            }else{
                 appcan.window.open({
                    name:'chat-file-group-more',
                    dataType:0,
                    data:'chat-file-group-more.html',
                    aniId:aniId,
                    type:1024
                  });  
            }
        }
        
        
    });
    //胶囊按钮
    $('.btn-pill').on('click', function(e){
        var that = $(this),
            thatpar = that.parents('.lists-box'),
            dataname = 'value';
            on = 'on';
        
        if(Number(thatpar.data(dataname))){
            that.removeClass(on);
            thatpar.data(dataname, 0);
        }else{
            that.addClass(on);
            thatpar.data(dataname, 1);
        }
    });
    
})($);
$("#group-name").on("click",function(){
     if(!vm.group.isManager) return;
        appcan.locStorage.setVal('groupname', vm.group.groupName);
        appcan.locStorage.setVal("groupChatId",groupChatId);
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
          appcan.window.open('chat-file-group-name', 'chat-file-group-name.html', 2);
        }else{
             appcan.window.open({
                name:'chat-file-group-name',
                dataType:0,
                data:'chat-file-group-name.html',
                aniId:aniId,
                type:1024
              });  
        }
        
})
$("#group-notice").on("click",function(){
     if(!vm.group.isManager) return;
        appcan.locStorage.setVal('groupnotice', vm.group.groupDescription);
        appcan.locStorage.setVal("groupChatId",groupChatId);
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
          appcan.window.open('chat-file-group-notice', 'chat-file-group-notice.html', 2);
        }else{
             appcan.window.open({
                name:'chat-file-group-notice',
                dataType:0,
                data:'chat-file-group-notice.html',
                aniId:aniId,
                type:1024
              });  
        }
        
})
//设置头像
function setHeadPic(vmdata){
    vmdata.forEach(function(n, i){
        Vue.set(n, 'headbgclass', getHeadClass(n.id));
        if(isDefine(n.head_image)){
            Vue.set(n, 'hashead', true);
            Vue.set(n, 'headurl', serverPath + n.head_image);
        }else{
            Vue.set(n, 'hashead', false);
        }
    });
}
var members=new Array();
function loadGroupMembers(thisfileJson,i){
        if(i==0){
             groupChatId=thisfileJson.chatter;
        }else{
             groupChatId=thisfileJson.groupId;
        }
       loadGroupMeneger(groupChatId);
        
        
     // var param={
             // groupId:groupChatId,//
             // loadCache:false//是否从本地加载缓存,(默认为false,从网络获取)
        // };
        // uexEasemob.getGroup(param,function(data){
            // if(data.owner==appcan.locStorage.getVal("userCode")){
                // thisfileJson.isManager=1;
            // }else{
                // thisfileJson.isManager=0;
            // }
            // //vm.group.isDisturb=1;
            // members=data.members;
            // //判断群主是否是当前登录人，如果不是则判断群成员中是否包含群主，如果没有则把群主加入群成员中。
            // if(data.owner!=appcan.locStorage.getVal("userCode")){
                // var isHave=false;
                // for (var i=0; i < members.length; i++) {
                    // if(members[i]==data.owner){
                         // isHave=true;
                         // break;
                    // }
                // };
                // if(!isHave){
                    // members.push(data.owner);
                // }
                // //剔除自己
                // for (var i=0; i < members.length; i++) {
                    // if(members[i]==appcan.locStorage.getVal("userCode")){
                         // members.splice(i,1);
                         // break;
                    // }
                // };
            // }
            // //从会话列表过来的没有群的相关信息
            // thisfileJson.groupDescription=data.groupDescription;
            // vm.group = $.extend({}, thisfileJson);
            // var isPushArr= appcan.locStorage.getVal("isPushArr");
           // if(isDefine(isPushArr)){
               // var isPushJson=JSON.parse(isPushArr);
               // var isHasKey=false;
               // for (var i=0; i < isPushJson.length; i++) {
                 // if(isPushJson[i].groupId==groupChatId && isPushJson[i].userCode==appcan.locStorage.getVal("userCode")){
                     // if(isPushJson[i].isPush==true){
                          // Vue.set(vm.group, 'isDisturb', 1);
                     // }else{
                          // Vue.set(vm.group, 'isDisturb', 0);
                     // }
                     // break;
                 // }
               // };
           // }
            // //加载群成员
            // loadAllPeopleInfo();
    // });
}
//加载群成员
function loadAllPeopleInfo(){
    var allPeopleHeadImg=appcan.locStorage.getVal("allPeopleHeadImg");
    if(isDefine(allPeopleHeadImg)){
        var allPeoples=JSON.parse(allPeopleHeadImg);
        var peopels=new Array();
        for (var i=0; i < allPeoples.length; i++) {
            if(allPeoples[i].username==vm.managerCode){
                       vm.managerName=allPeoples[i].realname;
            }
        };
        for (var i=0; i < members.length; i++) {
             for (var j=0; j < allPeoples.length; j++) {
                if(members[i]==allPeoples[j].username){
                    allPeoples[j].userNameShort=allPeoples[j].realname.substr(-2,2);
                    allPeoples[j].userCode=allPeoples[j].username;
                    allPeoples[j].userName=allPeoples[j].realname;
                    peopels.push(allPeoples[j]);
                    break;
                }
             };
        };
        vm.people=peopels;
        setHeadPic(vm.people);
        
        
    }else{
        var ajaxJson={
            path:serverPath+"focchat.do?focgetAllUserHeadImages",
            data:{},
            layer:false
        }
        ajaxRequest(ajaxJson,function(data,e){
            if(e=="success"){
                //将当前登录人所在的一级公司的所有用户的头像信息存入缓存中，以便聊天模块适用。
                var allPeoples=data.obj;
                var peopels=new Array();
                for (var i=0; i < allPeoples.length; i++) {
                    if(allPeoples[i].username==vm.managerCode){
                               vm.managerName=allPeoples[i].realname;
                    }
                };
                for (var i=0; i < members.length; i++) {
                     for (var j=0; j < allPeoples.length; j++) {
                        if(members[i]==allPeoples[j].username){
                            allPeoples[j].userName=allPeoples[j].realname;
                            allPeoples[j].userCode=allPeoples[j].username;
                            allPeoples[j].userNameShort=allPeoples[j].username.substr(-2,2);
                            peopels.push(allPeoples[j]);
                            break;
                        }
                     };
                };
                vm.people=peopels;
                setHeadPic(vm.people);
                Vue.nextTick(function(){
                    
                });
            }
        });
    }
    
}

//群减人
function deleteGroupUser(groupChatIds,users){
    var path= "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/chatgroups/"+groupChatIds+"/users/"+users;
     $.ajax({
         url  : path,
         headers  :   {
             "content-type" : "application/json;charset=UTF-8",
             "Authorization": "Bearer "+access_token
         },
         data : {
         },
         type : 'delete',
         dataType : 'json',
         success : function(ret) {
             //appcan.window.publish('chat-info-reload', '1');
               //告诉主页面关闭此窗口。
             //appcan.window.publish('chat-people-remove-close', '1');
             layerToast('群踢人成功！');
         },
         error : function(ret) {
         }
     });
}
function getToken(){
    appcan.request.ajax({
                url  : "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/token",
                headers:{
                    "content-type": "application/json;charset=UTF-8"
                },
                data : {
                          "grant_type": "client_credentials",
                          "client_id": "YXA6AFj48MdUEeaNsCOh9r5B_A",
                          "client_secret": "YXA6DKPxgqAARuDIQlRioaRR0F3qFn0"
                },
                type : 'get',
                dataType : 'json',
                success : function(ret) {
                     access_token=ret.access_token;
                     //loadGroupMeneger(1506064697466);
                     //var m=new Array();
                     //m.push("jiaoliying");
                     // addGroupMemers("30501806080001",m);
                },
                error : function(ret) {
                }
            });
    
    
}
function getToken4(g,f){
    //alert("尽量了");
    appcan.request.ajax({
                url  : "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/token",
                headers:{
                    "content-type": "application/json;charset=UTF-8"
                },
                data : {
                          "grant_type": "client_credentials",
                          "client_id": "YXA6AFj48MdUEeaNsCOh9r5B_A",
                          "client_secret": "YXA6DKPxgqAARuDIQlRioaRR0F3qFn0"
                },
                type : 'get',
                dataType : 'json',
                success : function(ret) {
                     access_token=ret.access_token;
                     addGroupMemers(g,f);
                     //loadGroupMeneger(1506064697466);
                     //var m=new Array();
                     //m.push("jiaoliying");
                     // addGroupMemers("30501806080001",m);
                },
                error : function(ret) {
                }
            });
    
    
}
function getToken1(d,f){
    appcan.request.ajax({
                url  : "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/token",
                headers:{
                    "content-type": "application/json;charset=UTF-8"
                },
                data : {
                          "grant_type": "client_credentials",
                          "client_id": "YXA6AFj48MdUEeaNsCOh9r5B_A",
                          "client_secret": "YXA6DKPxgqAARuDIQlRioaRR0F3qFn0"
                },
                type : 'get',
                dataType : 'json',
                success : function(ret) {
                     access_token=ret.access_token;
                     loadGroupMembers(d,f);
                },
                error : function(ret) {
                }
            });
    
    
}
 //
function loadGroupMeneger(groupChatIdsd){
    
    var path= "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/chatgroups/"+groupChatIdsd;
     $.ajax({
         url  : path,
         headers  :   {
             "content-type" : "application/json;charset=UTF-8",
             "Authorization": "Bearer "+access_token
         },
         data : {
         },
         type : 'Get',
         dataType : 'json',
         success : function(ret) {
             //console.log(ret.data[0]);
                    for (var i=0; i < ret.data[0].affiliations.length; i++) {
                         if(ret.data[0].affiliations[i].hasOwnProperty("member")){
                             members.push(ret.data[0].affiliations[i].member);
                         }
                    };
                    vm.managerCode=ret.data[0].owner;
                    if(ret.data[0].owner==appcan.locStorage.getVal("userCode")){
                        thisfileJson.isManager=1;
                        
                    }else{
                        thisfileJson.isManager=0;
                    }
                    //判断群主是否是当前登录人，如果不是则判断群成员中是否包含群主，如果没有则把群主加入群成员中。
                    if(ret.data[0].owner!=appcan.locStorage.getVal("userCode")){
                        var isHave=false;
                        for (var i=0; i < members.length; i++) {
                            if(members[i]==ret.data[0].owner){
                                 isHave=true;
                                 break;
                            }
                        };
                        if(!isHave){
                            members.push(ret.data[0].owner);
                        }
                        //剔除自己
                        for (var i=0; i < members.length; i++) {
                            if(members[i]==appcan.locStorage.getVal("userCode")){
                                 members.splice(i,1);
                                 break;
                            }
                        };
                    }
                    //从会话列表过来的没有群的相关信息
                    thisfileJson.groupDescription=ret.data[0].description;
                    vm.group = $.extend({}, thisfileJson);
                    var isPushArr= appcan.locStorage.getVal("isPushArr");
                   if(isDefine(isPushArr)){
                       var isPushJson=JSON.parse(isPushArr);
                       var isHasKey=false;
                       for (var i=0; i < isPushJson.length; i++) {
                         if(isPushJson[i].groupId==groupChatId && isPushJson[i].userCode==appcan.locStorage.getVal("userCode")){
                             if(isPushJson[i].isPush==true){
                                  Vue.set(vm.group, 'isDisturb', 1);
                             }else{
                                  Vue.set(vm.group, 'isDisturb', 0);
                             }
                             break;
                         }
                       };
                   }
                   //处理管理员可删除群
                   if(vm.group.isManager==1){
                       $("#quikeGroupId").html("解散该群组");
                   }else{
                       $("#quikeGroupId").html("退出该群组");
                   }
                   
                   
                   loadAllPeopleInfo();
         },
         error : function(ret) {
             
         }
     });
}
//加人
function addGroupMemers(g,meArr){
    
     ///alert(g);
                //alert(JSON.stringify(meArr));
                //a/lert(access_token);
    var gson={
        usernames:meArr
    }
    var f=JSON.stringify(gson);
    var path= "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/chatgroups/"+g+"/users";
     $.ajax({
         url  : path,
         headers  :   {
             "content-type" : "application/json;charset=UTF-8",
             "Authorization": "Bearer "+access_token
         },
         data : f,
         type : 'post',
         dataType : 'json',
         success : function(ret) {
             //alert(JSON.stringify(ret));
             //console.log(ret);
                var allPeopleHeadImg=appcan.locStorage.getVal("allPeopleHeadImg");
                var allPeoples=JSON.parse(allPeopleHeadImg);
                var peopels=new Array();
                
                for (var i=0; i < meArr.length; i++) {
                     for (var j=0; j < allPeoples.length; j++) {
                        if(meArr[i]==allPeoples[j].username){
                            allPeoples[j].userNameShort=allPeoples[j].realname.substr(-2,2);
                            allPeoples[j].userName=allPeoples[j].realname;
                            allPeoples[j].userCode=allPeoples[j].username;
                            vm.people.push(allPeoples[j]);
                            break;
                        }
                     };
                };
                 
                setHeadPic(vm.people);
                layerToast('群加人成功！');
         },
         error : function(ret) {
             
         }
     });
}

