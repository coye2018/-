Vue.directive('focus', function(el, bd) {
    //文本框聚焦
    if (bd.value && !el.value)
        el.focus();
});

//【以下注释很重要, 可以改, 不能删, 不能删, 不能删, 重要的事情说三遍】
//type: 0是单聊1是群聊
//id: 标识
//people: 聊天人员(array)
//  userName: 聊天人员人名
//  userNameShort: 聊天人员人名2字短称
//  userExt1: 聊天人员头像地址, 可为空
//  userCode: 账号
//  userSex: 性别
//  userMail: 邮箱
//  userPhone: 手机号
//  userDept: 所在公司
//  userSign: 个性签名
//group: 群聊数据(json)
//  name: 群聊名称
//  notice: 群公告
//  isDisturb: 消息免打扰, 1为开启, 0为关闭
//  isOnTop: 群置顶
//  isManager: 是否为群主
//time: 最后一条会话记录的事件
//last: 最后一条会话记录数据(json)
//  userName: 聊天人员人名
//  userName: 聊天人员人名2字短称
//  userExt1: 聊天人员头像地址, 可为空
//  dialog: 最后一条会话记录内容
//unread: 未读条数, 可为0, 可超过99, 前端已做处理
var vm = new Vue({
    el : '#chat',
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    data : {
        searchIpt : '',
        isToInput : false,
        recent : [
        /*{
         "type": 0,
         "id": "3838",
         "people": [
         {
         "userName": "张靓颖",
         "userNameShort": "海豚",
         "userExt1": "",
         "userCode": "zhangliangying",
         "userSex": "女",
         "userMail": "zhangliangying@126.com",
         "userPhone": "13888888888",
         "userDept": "动力场道部",
         "userSign": "一二三四五六七，七六五四三二一"
         }
         ],
         "time": "08-07 12:08",
         "last": {
         "userName": "张靓颖",
         "userNameShort": "海豚",
         "userExt1": "",
         "dialog": "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
         },
         "unread": "103"
         },
         {
         "type": 1,
         "id": "3839",
         "people": [
         {
         "userName": "张学友",
         "userNameShort": "歌神",
         "userExt1": "",
         "userCode": 'zhangxueyou',
         "userSex": '男',
         "userMail": 'zhangxueyou@163.com',
         "userPhone": '13987654321',
         "userDept": '消防公司',
         "userSign": '?????'
         },
         {
         "userName": "周杰伦",
         "userNameShort": "杰伦",
         "userExt1": "1481499750734_crop_temp.jpg",
         "userCode": 'zhoujielun',
         "userSex": '男',
         "userMail": 'zhoujielun@qq.com',
         "userPhone": '13123456789',
         "userDept": '股份公司',
         "userSign": '~~~~~~'
         },
         {
         "userName": "刘德华",
         "userNameShort": "华仔",
         "userExt1": "/upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502175650629.jpg",
         "userCode": 'liudehua',
         "userSex": '男',
         "userMail": 'liudehua@gmail.com',
         "userPhone": '13666666666',
         "userDept": '信息公司',
         "userSign": '!!!!!'
         },{
         "userName": "刘德华",
         "userNameShort": "华仔",
         "userExt1": "/upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502175650629.jpg",
         "userCode": 'liudehua',
         "userSex": '男',
         "userMail": 'liudehua@gmail.com',
         "userPhone": '13666666666',
         "userDept": '信息公司',
         "userSign": '!!!!!'
         },{
         "userName": "刘德华",
         "userNameShort": "华仔",
         "userExt1": "/upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502175650629.jpg",
         "userCode": 'liudehua',
         "userSex": '男',
         "userMail": 'liudehua@gmail.com',
         "userPhone": '13666666666',
         "userDept": '信息公司',
         "userSign": '!!!!!'
         }
         ],
         "group": {
         "name": "值班群聊",
         "notice": "欢迎大家加入值班群聊，有什么问题及时沟通，及时解决，禁止在本群闲聊。欢迎大家加入值班群聊，有什么问题及时沟通，及时解决，禁止在本群闲聊。",
         "isDisturb": 1,
         "isOnTop": 0,
         "isManager": 1
         },
         "time": "08-07 12:03",
         "last": {
         "userName": "刘德华",
         "userNameShort": "华仔",
         "userExt1": "1481284509416_crop_temp.jpg",
         "dialog": "呵呵"
         },
         "unread": "0"
         }*/
        ], 
        recentQuery:[],
        grouplist : [],
        grouplistQuery:[],
        tagIndex:0
    },
    methods : {
        searchToInput : function() {
            //从文本标签切换到输入框
            this.isToInput = true;
        },
        searchToText : function() {
            //从输入框切换到文本标签
            if (this.searchIpt != '')
                return false;
            this.isToInput = false;
        },
        searchEmpty : function() {
            //清除输入框
            this.searchIpt = '';
            this.isToInput = false;
            this.searchFilter();
        },
        searchFilter : function() {
               if(vm.tagIndex==0){
                   if(!isDefine(this.searchIpt)){
                        vm.recent=vm.recentQuery;
                    }else{
                        var recentQuerySave=new Array();
                        for (var i=0; i < vm.recentQuery.length; i++) {
                          if(vm.recentQuery[i].groupName.indexOf(this.searchIpt)!=-1){
                              recentQuerySave.push(vm.recentQuery[i]);
                          }
                        };
                        vm.recent=recentQuerySave;
                    }
               }else{
                   if(!isDefine(this.searchIpt)){
                        vm.grouplist=vm.grouplistQuery;
                    }else{
                        var grouplistQuerySave=new Array();
                        for (var i=0; i < vm.grouplistQuery.length; i++) {
                          if(vm.grouplistQuery[i].groupName.indexOf(this.searchIpt)!=-1){
                              grouplistQuerySave.push(vm.grouplistQuery[i]);
                          }
                        };
                        vm.grouplist=grouplistQuerySave;
                    }
               }
        },
        headpicReplace : function(vals, type) {
            //加载头像失败, 替换成文字图像
            Vue.set(vals, 'hashead', false);
            Vue.set(vals, 'headbgclass', 'bg-head-' + getRandomNum(0, 7));
            if (type == "1") {//群聊
                Vue.set(vals, 'userNameOne', vals.groupName.substr(0, 1));
            }
        },
        enterChat : function(item, index, ev) {
            if (index == 0) {
                // 会话列表
                var curLi = $(ev.currentTarget),
                    curAni  = curLi.find('.charli-option-animated');
                // 包含actives(展开状态) 
                if (curAni && curAni.hasClass("actives")) {
                    curAni.removeClass("actives");
                    return;
                };
            };
            
            enterchat(item, index);
        },
        chatScroll: function (ev) {
            var cLI =  $(ev.target).parents("li");    
            if (cLI.find(".charli-option-animated").hasClass("actives")) {
                return;
            } else { 
                $("#chatList").find(".charli-option-animated").removeClass("actives");
            }
        },
        delDialog: function (item, index, ev) {
            // 删除会话
            var curLi = $(ev.currentTarget).parents(".js-toggle-item"),
                curDel = curLi.find('.js-del');
                
            curDel.text('删除中.');
            
            uexEasemob.deleteConversation(JSON.stringify({
                username: item.chatter, // username | groupid
                chatType: item.chatType //0-个人 1-群组(默认0,此参数仅iOS需要)
            }));
            
            setTimeout(function () {
                // 更新会话
                getRecent(function() {
                    appcan.window.publish("reloadUnread","reloadUnread");
                    
                    curDel.text('删除');
                    curLi.find(".charli-option-animated").removeClass("actives");
                });
                // 更新群
                getGroup();
            }, 1500);
            
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
    });
    
    //新建群聊
    appcan.button("#nav-add", "btn-act", function() {
        appcan.locStorage.setVal('address-pick-from', 'chat');
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
    });
    
    var noti_on = 'icon-20-h-noti-on',
        noti_off = 'icon-20-h-noti-off';
    var platForm = appcan.locStorage.getVal('platForm');
    if(platForm != "1"){
        var pushClass;
        var isAllDayNoPush= appcan.locStorage.getVal("allDayNoPush");
        if(isDefine(isAllDayNoPush)){
           var isAllDayNoPushJson=JSON.parse(isAllDayNoPush);
           var isHasKey=false;
           for (var i=0; i < isAllDayNoPushJson.length; i++) {
             if(isAllDayNoPushJson[i].userCode==appcan.locStorage.getVal("userCode")){
                 pushClass=isAllDayNoPushJson[i].isOnTop;
                 break;
             }
           };
        }else{
            pushClass=2;
        }
        if(pushClass==2){
            appcan.locStorage.setVal('chat-noti',0);
        }else{
            appcan.locStorage.setVal('chat-noti',1);
        }
        //iOS
        $('#nav-noti>i').removeClass('hide');
        if(appcan.locStorage.getVal('chat-noti') == 1){
            $('#nav-noti>i').removeClass(noti_on).addClass(noti_off);
        }else{
            $('#nav-noti>i').removeClass(noti_off).addClass(noti_on);
            
        }
    }else{
        $('#nav-noti>i').addClass('hide');
    }
    
    //0是不开启消息免打扰, 1是开启
    /*
    appcan.button("#nav-noti", "btn-act", function() {
            
            
        });*/
    
   //测试用的。
   var  loadRecentIndex=0;
    appcan.ready(function() {
        appcan.window.publish("isChatOpen","open");
        // 设置聊天列表的高度, 距离顶部top定位值
        resetListSize();
        
        var upswd = appcan.locStorage.getVal("upswd");
        if(isDefine(upswd)){
             //获取会话列表
            getRecent();
            //获取群列表
            getGroup();
        }
        appcan.window.subscribe('getRecentAndGroup', function(msg){
             //获取会话列表
            getRecent();
            //获取群列表
            getGroup();
        });
        appcan.window.subscribe('yesClickLi', function(msg){
            yesClick($("li"));
        });
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        appcan.window.subscribe("loadRecent", function(data) {
            
            
            $('.charli-option-animated').removeClass("actives");
            yesClick($("li"));
            
            getRecent();
           
            getGroup();
        });
        appcan.window.subscribe("chatOnResume", function(data) {
                //表示第一次app启动。
                //延迟1秒刷新列表。
                getRecent();
                appcan.locStorage.setVal("isResume",false);
                isResume=false;
               
        });
        appcan.window.subscribe("canLoadRecent", function(data) {
            var isLoResume=appcan.locStorage.getVal("isResume");
            $('.charli-option-animated').removeClass("actives");
            //如果不是第一次进入app则直接刷新列表。isResume 为true表示第一次进入。
            if(!isDefine(isLoResume)||isLoResume=='false'){
                getRecent();
            }
           
        });
        //环信连接上了加载数据
        appcan.window.subscribe("connected", function(data) {
            yesClick($("li"));
            $(".disContentChat").addClass("hide");
            // 设置聊天列表的高度, 距离顶部top定位值
            resetListSize();
            getRecent();
            getGroup();
        });
        //环信未连接 
        appcan.window.subscribe("unDisconnectedChat", function(data) {
            $("#chatDiscontent").html(data);
            $(".disContentChat").removeClass("hide");
            // 设置聊天列表的高度, 距离顶部top定位值
            resetListSize();
        });
        appcan.window.subscribe("loadRecentCreate", function(data) {
            yesClick($("li"));
            layerToast("建群成功！");
            
            $('.tab-pill-box .tab-pill-text').eq(1).trigger('click');
            getGroup();
            //getRecent();

        });
        appcan.window.subscribe("loadRecentOutGroup", function(data) {
            yesClick($("li"));
            layerToast("退群成功！");
            getRecent();
            getGroup();
            //getRecent();

        });
        appcan.window.subscribe("loadRecentDisbandGroup", function(data) {
            yesClick($("li"));
            layerToast("解散群成功！");
            $('.tab-pill-box .tab-pill-text').eq(1).trigger('click');
            getRecent();
            getGroup();
        });
        appcan.window.subscribe("kickGroup", function(data) {
            yesClick($("li"));
            layerToast("解散群成功！");
            $('.tab-pill-box .tab-pill-text').eq(1).trigger('click');
            getGroup();
        });
        appcan.window.subscribe("reloadRecentFromForward",function(data) {
            yesClick($("li"));
            layerToast("转发成功！");
            getRecent();
        });
        //分享任务刷新会话列表
        appcan.window.subscribe('confirmTashShare', function(msg) {
            layerToast('分享成功');
            getRecent();
        });
        //分享值班问题刷新会话列表
        appcan.window.subscribe('confirmDutyProblem', function(msg) {
            layerToast('分享成功');
            getRecent();
        });
        //接收到透传消息更新消息主题，使得变为撤回消息
        appcan.window.subscribe('pushChatRevoke', function(msg) {
            var platForm=appcan.locStorage.getVal("platForm");
            //Android
            if(platForm=="1"){
                //刷新会话列表。
                var param = {
                    from : "",
                    to : "",
                    messageId : msg.split("#")[0],
                    chatType : "",
                    setMsgTime : "",
                    msgText : "",
                    ext : ""
                }
                uexEasemob.updateMsg(param);   
            }else{
                var param = {
                            "username":msg.split("#")[2],//username | groupid
                            "msgId":msg.split("#")[0],
                            "chatType":msg.split("#")[1]//0-个人 1-群组(默认0,此参数仅iOS需要)
                 };
                                     //删除当前会话的某条聊天记录
                 uexEasemob.removeMessage(param);
            }
            
            //获得会话列表
            getRecent();
        });
        //dom更新后执行以下函数
        Vue.nextTick(function() {
            setHeadPic(vm.recent);
            setHeadPic(vm.grouplist);
        });
        
    });
    
    // 设置聊天列表的高度, 距离顶部top定位值
    function resetListSize () {
        var headerH = $("#Header").height();
        var chatH = $("#chat").height();
        $("#ScrollContent").css("top", headerH + "px");
        $("#ScrollContent").css("height", (chatH - headerH) + "px");        
    };

    //tab切换
    $('.tab-pill-box').on('click tap', '.tab-pill-text', function(e) {
        var that = $(this),
            idx = that.index(),
            box = $('.tab-box'),
            clsa = 'activess',
            clsb = 'activess';
            
        vm.tagIndex = that.index();
        that.addClass(clsa).siblings().removeClass(clsa);
        box.eq(idx).addClass(clsb).siblings().removeClass(clsb);
        if(isDefine(vm.searchIpt)){
            vm.searchIpt="";
            vm.recent=vm.recentQuery;
            vm.grouplist=vm.grouplistQuery;
        }
        //$('body').scrollTop(0);
    });
    
    // 展开隐藏选项
    $(document).on('swipeleft', '.js-toggle-item', function(e){
        var self = $(this);
        self.find('.charli-option-animated').addClass("actives");
        self.siblings().find('.charli-option-animated').removeClass("actives");
    });
    
    // 关闭隐藏选项
    $(document).on('swiperight', '.js-toggle-item', function(e) {
        var self = $(this);
        self.find('.charli-option-animated').removeClass("actives");
        self.siblings().find('.charli-option-animated').removeClass("actives");
    });
    
})($);
//0是不开启消息免打扰, 1是开启
$("#nav-noti").on('click',function(){
    var noti_on = 'icon-20-h-noti-on',
        noti_off = 'icon-20-h-noti-off';
    var noti_now = appcan.locStorage.getVal('chat-noti');
    if(noti_now == "1"){
        allNoPush(2);
        appcan.locStorage.setVal('chat-noti', 0);
        layerToast('您已开启聊天新消息推送。');
        $('#nav-noti>i').removeClass(noti_off).addClass(noti_on);
        
    }else{
        allNoPush(1);
        appcan.locStorage.setVal('chat-noti', 1);
        layerToast('您已关闭群聊新消息推送，在APP后台进程被关闭时，将不会收到新消息推送提醒。', 4);
        $('#nav-noti>i').removeClass(noti_on).addClass(noti_off);
        
        
    }
})
//进入会话列表
function enterchat(itm,index) {
    appcan.locStorage.remove('chatDutyProblem');
    if(index==0){
        //将dialog里的消息对话框的id存入缓存中
        appcan.locStorage.setVal("chat-dialog-groupChatId",itm.chatter);
         //将dialog里的消息对话框的id存入缓存中
        appcan.locStorage.setVal("chatType",itm.chatType);
    }else{
        appcan.locStorage.setVal("chat-dialog-groupChatId",itm.groupId);
        appcan.locStorage.setVal("chatType","1");
    }
    //设置从哪里进入会话。如果是从会话列表中进入，则为false
    appcan.locStorage.setVal('isAddress','false');
    appcan.locStorage.setVal('chat-file-group', JSON.stringify(itm));
    var platForm=appcan.locStorage.getVal("platForm");
    var aniId=0;
    //Android
    if(platForm=="1"){
       appcan.window.open('chat-dialog','chat-dialog.html',2);
    }else{
        //appcan.window.open('chat-dialog','chat-dialog.html',2);
        //return;
         appcan.window.open({
            name:'chat-dialog',
            dataType:0,
            data:'chat-dialog-zhu.html',
            aniId:0,
            type:1024
          });  
    }
    
}
/**
 * 全天免打扰 0为开启，2为关闭 
 * @param {Object} isPu
 */
function allNoPush(isPu){
           var param = {
                 noDisturbingStyle:isPu,//是否开启免打扰模式 0-全天免打扰 1-自定义时段免打扰 2- 关闭免打扰
                 noDisturbingStartH:0,//免打扰模式开始时间  小时(int)
                 noDisturbingEndH:24//免打扰模式结束时间  小时(int)
           };
           uexEasemob.updatePushOptions(param,function(data){
           }) 
           if(isPu==1){
               isPu=0;
           }
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
           
}
//设置头像
function setHeadPic(vmdata) {
    for (var j = 0; j < vmdata.length; j++) {
        if (vmdata[j].chatType == "1") {//群聊
            vmdata[j].people.forEach(function(n, i) {
                 var first=pinyinUtil.getFirstLetter(n.userName);
                 var bg='bg-head-' + getRandomNum(0, 7);
                 if(isDefine(first)){
                     bg=getHeadClass(first);
                 }
                 Vue.set(n, 'hashead', false);
                 Vue.set(n, 'headbgclass', bg);
                 Vue.set(n, 'userNameOne', n.userName.substr(0, 1));
            });
            if (vmdata[j].people.length == 0) {
                var p = {
                    'hashead' : false,
                    'headbgclass' : 'bg-head-' + getRandomNum(0, 7),
                    'userNameShort' : vmdata[j].groupName.substr(0, 2)
                };
                vmdata[j].people.push(p);
                //Vue.set(vmdata[j].people.push(p), 'hashead', false);
                //Vue.set(vmdata[j].people, 'headbgclass', 'bg-head-'+getRandomNum(0,7));
                //Vue.set(vmdata[j].people, 'userNameOne', vmdata[j].groupName.substr(0,1));
            }
        } else {//单聊
            var n = vmdata[j].people[0];
            if (isDefine(n.head_image)) {
                Vue.set(n, 'hashead', true);
                Vue.set(n, 'headurl', serverPath + n.head_image);
            } else {
                Vue.set(n, 'hashead', false);
                Vue.set(n, 'headbgclass', getHeadClass(n.id));
                Vue.set(n, 'userNameShort', n.realname.substr(-2, 2));
            }
        }
    }
}
