(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.ready(function() {
        $('#groupname').val(appcan.locStorage.getVal('groupname'));
        appcan.window.subscribe("chat-file-group-name-close",function(index){
            appcan.window.publish('chat-file-group-name', $.trim($('#groupname').val()));
            layerRemove(index);
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
$("#nav-right").on("click",function(){
    var gn = $.trim($('#groupname').val());
        if(gn==''){
            layerToast('群名称不能为空。');
            return false;
        }else if(gn==appcan.locStorage.getVal('groupname')){
            layerToast('群名称无修改。');
            return false;
        }else{
            var index = layerLoading();
            var groupChatId=appcan.locStorage.getVal("groupChatId");
            var param={
                  groupId:groupChatId,// 
                  changedGroupName:gn,//改变后的群组名称
            }
            uexEasemob.changeGroupName(param);
            appcan.window.publish("chat-file-group-name-close",index);
        }
        
})
