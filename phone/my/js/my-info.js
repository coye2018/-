var vm = new Vue({
       el: '#ScrollContent',
       data: {
           hashead: false,
           headClassBg: '',
           my: {
               userName: '',
               userNameShort: '',
               userCode: '',
               deptName: '',
               headPic : '',
               sex     : '',
               phone   : '',
               email   : ''
           }
       } 
});
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        vm.my.userName  =   appcan.locStorage.getVal("userName");
        vm.my.userCode  =   appcan.locStorage.getVal("userCode");
        vm.my.deptName  =   appcan.locStorage.getVal("deptName");
        var headPic     =   appcan.locStorage.getVal("headPortraitURL");
        
        vm.headClassBg = getHeadClass(appcan.locStorage.getVal('userID'));
        vm.my.userNameShort = appcan.locStorage.getVal('userName').substr(-2, 2);
        //判断是否设置了头像
        if(!isDefine(headPic)){
            vm.hashead = false;
            vm.my.headPic = 'img/default-head.png';
        }else{
            vm.hashead = true;
            vm.my.headPic = serverPath+headPic;
        }
        
        vm.my.sex       =   appcan.locStorage.getVal("sex");
        vm.my.phone     =   appcan.locStorage.getVal("mobilePhone");
        vm.my.email     =   appcan.locStorage.getVal("email");
        appcan.window.subscribe('my-sex', function(msg){
            $('#sex-show').text(msg);
        });
        appcan.window.subscribe('my-phone', function(msg){
            $('#phone-show').text(hidePhoneNumber(msg));
        });
        appcan.window.subscribe('reloadHead', function(msg){
            var headPic     =   appcan.locStorage.getVal("headPortraitURL");
            vm.my.headPic=serverPath+msg;
            vm.hashead=true;
            loadAllPeopleInfo();
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
             appcan.window.close(-1); 
        }
        appcan.window.publish("my-yes-click","my-yes-click");
        appcan.window.subscribe("my-info-click",function(msg){
            yesClick($("#head"));
            yesClick($("#phone"));
        })
    });
    
    //更改头像
    appcan.button("#head", "btn-act", function() {
        noClick($("#head"));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
           appcan.window.open('my-head','my-head.html',2);
        }else{
            appcan.window.open({
                name:'my-head',
                dataType:0,
                data:'my-head.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    //更改性别
    appcan.button("#sex", "btn-act", function() {
        return;
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-sex','my-sex.html',2);
        }else{
            appcan.window.open({
                name:'my-sex',
                dataType:0,
                data:'my-sex.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    //更改手机号码
    // appcan.button("#phone", "btn-act", function() {
        // noClick($("#phone"));
        // var platForm=appcan.locStorage.getVal("platForm");
        // var aniId=0;
        // //Android
        // if(platForm=="1"){
            // appcan.window.open('my-phone','my-phone.html',2);
        // }else{
            // appcan.window.open({
                // name:'my-phone',
                // dataType:0,
                // data:'my-phone.html',
                // aniId:aniId,
                // type:1024
            // });
        // }
//         
    // });
    
})($);
function loadAllPeopleInfo(){
    var ajaxJson={
        path:serverPath+"focchat.do?focgetAllUserHeadImages",
        data:{},
        layer:false
    }
    ajaxRequest(ajaxJson,function(data,e){
        if(e=="success"){
            //console.log(data);
            //将当前登录人所在的一级公司的所有用户的头像信息存入缓存中，以便聊天模块适用。
            appcan.locStorage.setVal("allPeopleHeadImg",JSON.stringify(data.obj));
            
        }
    });
}
