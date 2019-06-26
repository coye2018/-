var vm = new Vue({
    el: '#chat-at',
    data: {
        fenzu: [
             
        ],
        people:[]
    },
    methods: {
        headpicReplace: function(vals){
            //加载头像失败, 替换成文字图像
            Vue.set(vals, 'hashead', false);
        },
        at: function(vals){
            //点击at人
            appcan.window.publish("atSomeBody",vals.realname);
            appcan.window.close(1);
        }
    }
});
var members=new Array();
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {
        getMemers();
        for(var z=0; z<vm.fenzu.length; z++){
            setHeadPic(vm.fenzu[z].people);
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
            appcan.window.close(1);
        }
    });
    
})($);
function getMemers(){
    var groupChatId=appcan.locStorage.getVal("chat-dialog-groupChatId");
    var param={
             groupId:groupChatId,//
             loadCache:false//是否从本地加载缓存,(默认为false,从网络获取)
        };
        uexEasemob.getGroup(param,function(data){
            members=data.members;
            //加载群成员
            loadAllPeopleInfo();
    });
}

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
//加载群成员
function loadAllPeopleInfo(){
    var allPeopleHeadImg=appcan.locStorage.getVal("allPeopleHeadImg");
    if(isDefine(allPeopleHeadImg)){
        var allPeoples=JSON.parse(allPeopleHeadImg);
        var peopels=new Array();
        for (var i=0; i < members.length; i++) {
             for (var j=0; j < allPeoples.length; j++) {
                if(members[i]==allPeoples[j].username){
                    allPeoples[j].userNameShort=allPeoples[j].realname.substr(-2,2);
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
                for (var i=0; i < members.length; i++) {
                     for (var j=0; j < allPeoples.length; j++) {
                        if(members[i]==allPeoples[j].username){
                            allPeoples[j].userNameShort=allPeoples[j].username.substr(-2,2);
                            peopels.push(allPeoples[j]);
                            break;
                        }
                     };
                };
                vm.people=peopels;
                setHeadPic(vm.people);
            }
        });
    }
    
}