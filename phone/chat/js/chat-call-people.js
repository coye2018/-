var vm = new Vue({
    el: '#chat-file-people',
    data: {
        file: {},
        realname:"",
        callText:"电话等待对方同意接听"
    },
    methods: {
        sendMsg:function(file){
            appcan.locStorage.setVal("chat-dialog-groupChatId",file.username);
            appcan.locStorage.setVal("chatType",0);
            
            var isAddress=appcan.locStorage.getVal("isAddress");
            var thispeople=JSON.parse(appcan.locStorage.getVal('thispeoplefile'));
                var arr=new Array();
                arr.push(thispeople);
                 var  chatFileGroup={
                     chatType:0,
                     groupName:file.realname,
                     people:arr
                 }
            appcan.locStorage.setVal("chat-file-group",JSON.stringify(chatFileGroup));
            appcan.window.publish("reloadChat",file.realname);
            appcan.window.publish("reloadChatZhu",file.realname);
            if(isDefine(isAddress)&&isAddress=="false"){
                var closeArr=["chat-file-group","chat-file-group-more","chat-file-people"];
                closeArr.forEach(function(name){
                   appcan.window.evaluateScript({
                        name:name,
                        scriptContent:'appcan.window.close(-1);'
                   });
                })
            }else{
               
                appcan.locStorage.setVal("chatPepleName",file.realname);
                var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                    appcan.window.open('chat-dialog','chat-dialog.html',2);
                }else{
                    appcan.window.open({
                    name:'chat-dialog',
                    dataType:0,
                    data:'chat-dialog-zhu.html',
                    aniId:0,
                    type:1024
                });
                }
                
            }
            
        },
        accept:function(){
            uexEasemob.answerCall();
        },
        unAccept:function(){
            
            uexEasemob.endCall();
            appcan.window.close(-1);
        }
        
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.locStorage.remove('thispeoplefile');
        appcan.locStorage.remove('isAddress');
        appcan.window.close(13);
        
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    var thisfile = appcan.locStorage.getVal('thispeoplefile');
    //从哪里来的用户
    var callFromCode = appcan.locStorage.getVal("callFromCode");
    vm.realname=callFromCode;
    var headImgPath= disposeHeadImg(callFromCode).headImgPath
    
    //console.log(vm.file);
    appcan.ready(function() {
        appcan.window.subscribe("callState",function(data){
            if(data=="1"){
                vm.callText="正在连接对方";
            }else if(data=="2"){
                vm.callText="双方已经建立连接";
            }else if(data=="3"){
                vm.callText="同意语音申请,建立语音通话中";
            }else if(data=="4"){
                vm.callText="连接中断";
            }else if(data=="5"){
                vm.callText="电话暂停中";
            }else if(data=="6"){
                vm.callText="电话等待对方同意接听";
            }else if(data=="7"){
                vm.callText="通话中";
            }
            
        })
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                 
                appcan.window.close(1);
            }
        };
         
    });
    
})($);
function disposeHeadImg(code){
    var allPeopleHeadImg=appcan.locStorage.getVal("allPeopleHeadImg");
    var headImgPath="";
    var userId="";
    if(isDefine(allPeopleHeadImg)){
         var allPeoples=JSON.parse(allPeopleHeadImg);
         for (var j=0; j < allPeoples.length; j++) {
            if(code==allPeoples[j].username){
                userId=allPeoples[j].id;
                headImgPath=allPeoples[j].head_image;
                break;
            }
         };
    }
    var json={
        headImgPath:headImgPath,
        userId:userId
    }
    return json;
}
