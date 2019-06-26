//建群的逻辑
 var members = new Array();
 var access_token;
function createGroup(obj,index) {
     
    var allPeopleHeadImg = appcan.locStorage.getVal("allPeopleHeadImg");
    var allPeoples = JSON.parse(allPeopleHeadImg);
    var name = "";
    var ifMembersBig = false;
    for (var i = 0; i < obj.length; i++) {
        if (obj.length > 3) {
            ifMembersBig = true;
        }
        for (var j = 0; j < allPeoples.length; j++) {
            if (allPeoples[j].username == obj[i].userCode) {
                if (i <= 2) {
                    name = name + allPeoples[j].realname + ",";
                }
            }
        };
        members.push(obj[i].userCode);
    };
    name = name.substring(0, name.length - 1);
    if (ifMembersBig) {
        name = appcan.locStorage.getVal("userName") + "," + name + "等" + obj.length + "人";
    } else {
        name = appcan.locStorage.getVal("userName") + "," + name;
    }
    getToken(name,index);
    //创建公开群。
    // var groupName = name;
    // var param = {
        // groupName: groupName,
        // //要创建的群聊的名称
        // desc: groupName,
        // //群聊简介
        // members: members,
        // //群聊成员,为空时这个创建的群组只包含自己
        // needApprovalRequired: false,
        // //如果创建的公开群用需要户自由加入,就传false.否则需要申请,等群主批准后才能加入,传true
        // maxUsers: '2000',
        // //最大群聊用户数,可选参数,默认为200,最大为2000
        // initialWelcomeMessage: "欢迎加入" + groupName //群组创建时发送给每个初始成员的欢迎信息
    // };
    // uexEasemob.createPublicGroup(param);
    // //layerToast("建群成功！");
    // createGroupForServer();
    
};
function createGroupForServer(groupName,index){
     var content={
          "groupname":groupName,
          "desc":groupName,
          "public":true,
          "maxusers":2000,
          "approval":false,
          "owner":appcan.locStorage.getVal("userCode"),
          "members":members
    };
    var r=JSON.stringify(content);
    var path= "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/chatgroups";
     $.ajax({
         url  : path,
         headers  :   {
             "content-type" : "application/json;charset=UTF-8",
             "Authorization": "Bearer "+access_token
         },
         data :r,
         type : 'post',
         dataType : 'application/json',
         success : function(ret) {
                var goto = appcan.locStorage.getVal('createCallback');
                if(goto == 'chat-forward'){
                    layerRemove(index);
                    //建群转发
                    //alert('建群转发~');
                    var closeArr = ['chat-forward', 'address-pick'];
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
                }
                if(goto == 'chat'){
                    layerRemove(index);
                    //直接建群
                    appcan.window.publish("loadRecentCreate", "loadRecentCreate");
                    appcan.window.close(1);
                    appcan.locStorage.remove('address-pick-from');
                }
              
         },
         error : function(ret) {
             layerRemove(index);
             layerToast("创建群失败，请重新创建！");
         }
     });
    
    
    
    
}
function getToken(groupName,index){
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
                      createGroupForServer(groupName,index);
                },
                error : function(ret) {
                    layerToast("创建群失败，请重新创建！");
                }
            });
    
    
}