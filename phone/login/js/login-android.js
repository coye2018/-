(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        $('#thisyear').html(_thisyear);
        
        $.scrollbox($("body")).on("releaseToReload",
        function() { //After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
        }).on("onReloading",
        function(a) { //if onreloading status, drag will trigger this event
        }).on("dragToReload",
        function() { //drag over 30% of bounce height,will trigger this event
        }).on("draging",
        function(status) { //on draging, this event will be triggered.
        }).on("release",
        function() { //on draging, this event will be triggered.
        }).on("scrollbottom",
        function() { //on scroll bottom,this event will be triggered.you should get data from server
            $("#ScrollContent").trigger("more", this);
        }).reload();
        $('#username').val(appcan.locStorage.getVal("uname"));
        //手机返回键退出app
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                uexWidgetOne.exit();
            }
        };
    });
    
    //密码是否可见
    $('.seepswd').on('click', function(){
        var that = $(this),
            ipt = that.siblings('.input-oneline-ctr').find('.input-oneline-ipt'),
            ico = that.find('i'),
            act = 'actives';
        
        if(ipt.attr('type')=='text'){
            ipt.attr('type', 'password');
            ico.removeClass(act);
        }else{
            ipt.attr('type', 'text');
            ico.addClass(act);
        }
    });
        
    //点击登录按钮
    $('#loginBtn').on('click', function(){
        var uname = $('#username'),
            upswd = $('#password');
        
        if(!isDefine(uname.val())){
            layerToast('请输入账号名。');
            return;
        }else if(!isDefine(upswd.val())){
            layerToast('请输入密码。');
            return;
        }
        login($.trim(uname.val()), upswd.val());
        //appcan.window.open('index', 'index.html', 2);
    });
        
    /**
     * token失效之后重新自动登录一下。在发送请求请求原来的接口。
     * @param {Object} json　原接口的参数，
     * @param {Object} cb　　原接口的返回方法
     */
    function login(uname,upswd){
        //打开遮罩层
        ModalHelper.afterOpen();
        var layerIndex = -1;
        layer.open({
            className: 'layer-a'
            ,type: 2
            ,shadeClose: false
            ,content: '正在登录中，请稍候……'
            ,success: function(elem){
                layerIndex = elem.getAttribute('index');
            }
        });
        //这个是获取app的信息，其中有版本号
        var appInfo = uexWidgetOne.getCurrentWidgetInfo();
        var version;
        if(!isDefine(appInfo)){
            version="01.00.0002";
        }else{
            version=appInfo.version;
        }
        //平台Android、iOS
        var platformName=appcan.widgetOne.getPlatformName();
        var platForm;
        if(platformName=="android"){
            platForm=1;
        }else{
            platForm=0;
        }
        var imei= uexDevice.getInfo('10');
        appcan.request.ajax({
            url: serverPath+'focUserController.do?appLogin',
            type: "POST",
            data: {
                    'userName':uname,
                    'password':upswd,
                    'platform':platForm,
                    'imei':imei,
                    'method':'applogin',
                    'version':version
                    
            },
            dataType: 'application/json',
            timeout:40000,
            success: function(data) {
                var loginJson=JSON.parse(data);
                //console.log(loginJson);
                var platForm=appcan.locStorage.getVal("platForm");
                if(platForm=="1"){
                     uexJPush.resumePush();
                }
                if(loginJson.success){
                    //console.log(JSON.stringify(loginJson.obj));
                    // 首页航班出入港
                    appcan.window.publish('isLoginEvent');
                    //token
                    appcan.locStorage.setVal("token",replaceDefine(loginJson.obj.token));
                    //公司id
                    appcan.locStorage.setVal("deptId",replaceDefine(loginJson.obj.deptID));
                    //公司名称
                    appcan.locStorage.setVal("deptName",replaceDefine(loginJson.obj.deptName));
                    //公司简称
                    appcan.locStorage.setVal("deptShortName",replaceDefine(loginJson.obj.deptShortName));
                    //头像地址
                    appcan.locStorage.setVal("headPortraitURL",replaceDefine(loginJson.obj.headPortraitURL));
                    //是否值班帐号
                    appcan.locStorage.setVal("isDutyAccount",replaceDefine(loginJson.obj.isDutyAccount));
                    //根节点部门id
                    appcan.locStorage.setVal("rootID",replaceDefine(loginJson.obj.rootID));
                    //根节点部门名称
                    appcan.locStorage.setVal("rootName",replaceDefine(loginJson.obj.rootName));
                    //登录人userCode
                    appcan.locStorage.setVal("userCode",replaceDefine(loginJson.obj.userCode));
                    //登陆人id
                    appcan.locStorage.setVal("userID",replaceDefine(loginJson.obj.userID));
                    //登录人名称
                    appcan.locStorage.setVal("userName",replaceDefine(loginJson.obj.userName));
                    //登录人名称
                    appcan.locStorage.setVal("sex",replaceDefine(loginJson.obj.sex));
                    //登录人名称
                    appcan.locStorage.setVal("email",replaceDefine(loginJson.obj.email));
                    //登录人名称
                    appcan.locStorage.setVal("mobilePhone",replaceDefine(loginJson.obj.mobilePhone));
                    //角色编码名称
                    appcan.locStorage.setVal("roleCode",replaceDefine(loginJson.obj.roleCode));
                    //加载我的页数据
                    appcan.window.publish("loadMyData","loadMyData");
                    //通知index页面开始执行百度地图的轨迹上传代码
                    appcan.window.publish("beginUploadLocation","begin");
                    //加载功能页
                    appcan.window.publish("loadOptionsData","loadOptionsData");
                    //加载联系人
                    appcan.window.publish("loadAddressData","loadAddressData");
                    //执行更新操作
                    appcan.window.publish("loadUpdate","loadUpdate");
                    uexJPush.getConnectionState(function(error) {
                        if(!error){
                           var params = {
                                alias:imei
                           };
                           var data = JSON.stringify(params);
                           uexJPush.setAlias(data, function(error,data) {
                               if(!error){
                               }else{
                               }
                            });
                       }else{
                       }
                    });
                   
                     //移除遮罩层
                     var uexEparam2 = {
                         "username":loginJson.obj.userCode,//用户名
                         "password":"888888"//密码
                     };
                    uexEasemob.login(JSON.stringify(uexEparam2),function(data){
                     if(data.result=="1"){
                         //将用户名密码存入缓存中，退出时清除缓存中的用户名密码
                        appcan.locStorage.setVal("uname",uname);
                        appcan.locStorage.setVal("upswd",upswd);
                        appcan.locStorage.setVal("isLogin","true");
                         //移除遮罩层
                        layerRemove(layerIndex);
                        //加载群头像
                        appcan.window.publish("initEasemob","initEasemob");
                        //重新监听
                        appcan.window.publish("carchEasemobLog","carchEasemobLog");
                          // 关闭引导页 
                        appcan.window.close(14);
                        
                     } 
                    });
                    
                }else{
                    //移除遮罩层
                    layerRemove(layerIndex); 
                    //弹出登录失败原因
                    layerToast(loginJson.msg,2);
                }
                
            },
            error: function(err, e, errMsg, error) {
                //移除遮罩层
                layerRemove(layerIndex);
                //弹出登录失败原因
                layerToast('登录失败，请检查网络环境',2)
            }
        })
    }
    /* 
     * state 1 success false　 : 表示用户名密码错误　　　　　这个是登录接口返回的
     * state 2 success false  : 表示用户已在其他设备登录        这个是登录接口返回的
     * state 3 success false  : token 失效。 所有接口都会有这个状态，除了登录接口
     * state 4 success false  : 网络错误，请检查网络
     * 
     */

})($);
