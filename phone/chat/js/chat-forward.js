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
//recentPick: 选择转发的对象, 数组
//multiFlag: 转发是单选0还是多选1
var vm = new Vue({
    el : '#chat_forward',
    data : {
        searchIpt : '',
        isToInput : false,
        recent : [{},{}
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
        recentPick: [],
        multiFlag: 0,
        recentQuery:[]
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

        },
        headpicReplace : function(vals, type) {
            //加载头像失败, 替换成文字图像
            Vue.set(vals, 'hashead', false);
            if (type == "1") {//群聊
                Vue.set(vals, 'userNameOne', vals.groupName.substr(0, 1));
            }
        },
        pickItem : function(itm, idx) {
            if(vm.multiFlag==1){
                //如果是多选, 执行勾选操作
                itm.checked = !itm.checked;
                if(itm.checked){
                    vm.recentPick = vm.recentPick.concat(itm);
                }else{
                    for(var p=0; p<vm.recentPick.length; p++){
                        if(vm.recentPick[p].chatter == itm.chatter){
                            vm.recentPick.splice(p, 1);
                        }
                    }
                }
            }else{
                vm.recentPick = [].concat(itm);
                //否则如果是单选
                forwardMessage(0);
            }
        }
    }
});

(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        //获取会话列表
        getRecent();
        
        for(var r=0; r<vm.recent.length; r++){
            Vue.set(vm.recent[r], 'checked', false);
            Vue.set(vm.recent[r], 'count', r);
        }
        //console.log(vm.recent);
        
        appcan.window.subscribe("loadRecent", function(data) {
            getRecent();
        });
        //接收到透传消息更新消息主题，使得变为撤回消息
        appcan.window.subscribe('pushChatRevoke', function(msg) {
            var platForm=appcan.locStorage.getVal("platForm");
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
            
            //setHeadPic(vm.recent);
        });
        
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
            appcan.window.close(1);
        }
    });
    
    //创建新的群聊然后转发聊天消息
    $('#create').on('click', function(){
        appcan.locStorage.setVal('address-pick-from', 'chat-forward');
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

})($);
$("#nav-left").on('click',function(){
    var that = $(this);
    if(vm.multiFlag == 0){
        appcan.window.close(0);
    }else{
        //清空所选项
        vm.recentPick = [];
        for(var r=0; r<vm.recent.length; r++){
            Vue.set(vm.recent[r], 'checked', false);
        }
        vm.multiFlag = 0;
    }
})
$("#nav-right").on('click',function(){
    var that = $(this);
    if(vm.multiFlag == 0){
        vm.multiFlag = 1;
    }else{
        if(vm.recentPick.length==0){
            layerToast('请选择至少一个聊天。');
            return false;
        }else{
            forwardMessage(0);
        }
    }
})
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
                    'headbgclass' : getHeadClass(vmdata[j].people.id),
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
                Vue.set(n, 'headbgclass', 'bg-head-' + getRandomNum(0, 7));
                Vue.set(n, 'userNameShort', n.realname.substr(-2, 2));
            }
        }
    }
}
