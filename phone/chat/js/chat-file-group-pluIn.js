//设置环信取群成员默认为false,等成功返回数据则为true.
var isUexEasemob=false;
//定义群成员数组。里面存放群成员的用户的帐号
var members=new Array();
function loadGroupInformation(){
    //获取群信息，里面包含群成员及群的相关信息。
    var groupChatId=appcan.locStorage.getVal("groupChatId");
    //获得当前登录人的用户帐号
    var ucode=appcan.locStorage.getVal("userCode");
        var param={
             groupId:groupChatId,//
             loadCache:false//是否从本地加载缓存,(默认为false,从网络获取)
        };
        uexEasemob.getGroup(param,function(data){
                members=data.members;
                //如果群成员有值则将isUexEasemob 设置为true.
                if(data.members.length>0){
                   isUexEasemob=true;
                }else{
                    layerToast("获取群成员失败，请检查网络环境！");
                    return ;
                }
                //给群名字赋值。
                vm.groupName=data.groupName;
                //给群公告赋值。
                vm.groupNotice=data.groupDescription
                if(ucode==data.owner){
                    vm.isManager="1";
                }else{
                    vm.isManager="0";
                }
                //从服务器中获取所有联系人数据。
                getPeopleInfo();
    });
}
/**
 *获取所有用户的头像信息 
 */
function getPeopleInfo(){
    var json;
    var allPeopleHeadImg=appcan.locStorage.getVal("allPeopleHeadImg");
    if(isDefine(allPeopleHeadImg)){
        json=JSON.parse(allPeopleHeadImg);
        for (var i=0; i < json.length; i++) {
          json[i]
        };
    }else{
        loadAllPeopleInfo();
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
            //将当前登录人所在的一级公司的所有用户的头像信息存入缓存中，以便聊天模块适用。
            appcan.locStorage.setVal("allPeopleHeadImg",JSON.stringify(data.obj));
            //console.log(data.obj);
        }
    });
}