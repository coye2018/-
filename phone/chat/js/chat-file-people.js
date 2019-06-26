var vm = new Vue({
    el: '#chat-file-people',
    data: {
        file: {}
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
    vm.file = $.extend({}, JSON.parse(thisfile) );
    vm.file.mobilePhoneHr="tel:"+vm.file.mobilePhone;
    
    //console.log(vm.file);
    appcan.ready(function() {
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.locStorage.remove('isAddress');
                appcan.locStorage.remove('thispeoplefile');
                appcan.window.close(1);
            }
        };
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
            appcan.locStorage.remove('isAddress');
            appcan.locStorage.remove('thispeoplefile');
            appcan.window.close(1);
        }
        appcan.window.publish("address-yes-click","address-yes-click");
    });
    
})($);
