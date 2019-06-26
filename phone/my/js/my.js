
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
               headPic : ''
           }
       } 
});

(function($) {
    FastClick.attach(document.body);  
    appcan.button("#nav-left", "btn-act",
    function() {});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        //渲染个人信息
        function setMyInfo(){
            vm.my.userName=appcan.locStorage.getVal("userName");
            vm.my.userCode=appcan.locStorage.getVal("userCode");
            vm.my.deptName=appcan.locStorage.getVal("deptName");
            
            if(isDefine(vm.my.userName)){
                vm.my.userNameShort = appcan.locStorage.getVal('userName').substr(-2, 2);
            }
            if(isDefine(appcan.locStorage.getVal('userID'))){
                vm.headClassBg = getHeadClass(appcan.locStorage.getVal('userID'));
            }
            setMyHead();
        }
        
        //设置头像
        function setMyHead(){
            var headPic = appcan.locStorage.getVal("headPortraitURL");
            //判断是否设置了头像
            if(!isDefine(headPic)){
                vm.hashead = false;
            }else{
                vm.hashead = true;
                vm.my.headPic = serverPath+headPic;
            }
        }
        
        setMyInfo();
        appcan.window.subscribe('loadMyData',function(data){
            if(data=='loadMyData'){
                setMyInfo();
            }
        });
        appcan.window.subscribe('reloadHead', function(msg){
                //判断是否设置了头像
                vm.hashead = true;
                vm.my.headPic = serverPath+msg;
        });
        appcan.window.subscribe('my-yes-click', function(msg){
            
        });
    });
    
    //个人信息
    appcan.button("#info", "btn-act", function(){
        /*
        var platForm = appcan.locStorage.getVal("platForm");
        //Android
         if (platForm == "1") {
             appcan.window.open('my-info', 'my-info.html', 2);
         } else {
             appcan.window.open({
                 name: 'my-info',
                 dataType: 0,
                 data: 'my-info.html',
                 aniId: 0,
                 type: 1024
             }); 
         }
        */
        
        //widget入口测试
        appcan.window.publish('widget-10021', '1');
    });
    //账号与安全
    appcan.button("#safety", "btn-act", function(){
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-safety', 'my-safety.html', 2);
        }else{
            appcan.window.open({
                name:'my-safety',
                dataType:0,
                data:'my-safety.html',
                aniId:aniId,
                type:1024
            });
        }
        
        
    });
    //通用
    appcan.button("#general", "btn-act", function(){
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-general','my-general.html',2);
        }else{
            appcan.window.open({
                name:'my-general',
                dataType:0,
                data:'my-general.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    //帮助与反馈
    appcan.button("#feedback", "btn-act", function(){
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-feedback','my-feedback.html',2);
        }else{
            appcan.window.open({
                name:'my-feedback',
                dataType:0,
                data:'my-feedback.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    //关于
    appcan.button("#about", "btn-act", function(){
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-about','my-about.html',2);
        }else{
            appcan.window.open({
                name:'my-about',
                dataType:0,
                data:'my-about.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    
    
})($);

//动态绑定退出
$("#exit").on('click',function(){
     
    uexEasemob.logout(function(data){});
    //这个是获取app的信息，其中有版本号
    var appInfo = uexWidgetOne.getCurrentWidgetInfo();
    //版本号
    var version;
    if(!isDefine(appInfo)){
        version="01.00.0002";
    }else{
        version=appInfo.version;
    }
    //平台Android、iOS
    var platformName=appcan.widgetOne.getPlatformName();
    var platForm=appcan.locStorage.getVal("platForm");
    
    var imei= uexDevice.getInfo('10');
    var json={
        path:serverPath+"focUserController.do?focloginOut",
        data:{
            'platform':platForm,
            'imei':imei,
            'version':version,
            'lo':0,
            'la':0
        },
        layer:false
    }
    ajaxRequest(json,function(data,e){
        
        //appcan.locStorage.remove("uname");
        appcan.locStorage.setVal("isLogin","false");
        appcan.locStorage.remove("upswd");
        appcan.locStorage.remove("token");
        
        if(platForm=="1"){
            uexJPush.stopPush();
        }
        if(platformName=="android"){
            platForm=1;
            appcan.window.open('login','../login-andriod.html',9);
        }else{
            platForm=0;
            appcan.window.open('login','../login.html',9);
        }
        appcan.window.publish("reseat","reseat");
        //重置打开index页面的第一tab
       
        
       
    })
    
    
    
});
