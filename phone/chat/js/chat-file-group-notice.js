 var gnOld ;
 var access_token;
(function($) {
   
    appcan.ready(function() {
          gnOld = appcan.locStorage.getVal('groupnotice');
        $('#groupnotice').val(gnOld);
        appcan.window.subscribe("chat-file-group-notice-close",function(data){
            appcan.window.publish('chat-file-group-notice', $.trim($('#groupnotice').val()));
            layerRemove(data);
            appcan.window.close(0);
        })
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
$("#nav-left").on("click",function(){
     appcan.window.close(1);
})
$("#nav-right").on("click",function(){
    var platForm=appcan.locStorage.getVal("platForm");
    if(platForm=="1"){
        var gn = $.trim($('#groupnotice').val());
        if(gn.length>140){
            layerToast('群公告字数不多于140字。');
            return false;
        }else if(gn==gnOld){
            layerToast('群公告无修改。');
            return false;
        }else{
            var index = layerLoading();
            var groupChatId=appcan.locStorage.getVal("groupChatId");
            var param={
                  groupId:groupChatId,// 
                  changedGroupDescription:gn,//改变后的群公告
            }
            uexEasemob.changeGroupDescription(param);
            appcan.window.publish("chat-file-group-notice-close",index);
       }
    }else{
        var gn = $.trim($('#groupnotice').val());
        var index = layerLoading();
        getToken(gn,index);
        
    }        
})
function getToken(gn,index){
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
                      updateDes(gn,index);
                },
                error : function(ret) {
                }
            });
    
    
}
function updateDes(gn,index){
    var json={
        description:gn
    };
    var j=JSON.stringify(json);
    var groupChatId=appcan.locStorage.getVal("groupChatId");
    var path= "http://a1.easemob.com/1137161221178828/zhanghuibaiyun/chatgroups/"+groupChatId;
     $.ajax({
         url  : path,
         headers  :   {
             "content-type" : "application/json;charset=UTF-8",
             "Authorization": "Bearer "+access_token
         },
         data : j,
         type : 'put',
         dataType : 'json',
         success : function(ret) {
             appcan.window.publish("chat-file-group-notice-close",index);
         },
         error : function(ret) {
             appcan.window.publish("chat-file-group-notice-close",index);
         }
     });
}
