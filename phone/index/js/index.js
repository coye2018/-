var t1,t2,t3;
var isConfirmFourTime = true;
var nowTimeHours = new Date().getHours();
var hasConfirmNewFour = false;
var changeTime = 0;

(function($) {
    FastClick.attach(document.body);
    //是否登录过，如果没有登录过，则不用在index页面请求数据。
    //var isLogin=true;
    //第一底部tab 对象。通过得到聊天未读数来动态的替换tab的data
    var tabview;
    //这个是聊天的未读消息数
    var chatCount=0;
    var optionClick=0;
    var addressClick=0;
    var timeAreaData;
    appcan.button("#nav-left", "btn-act",
    function() {});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        appcan.locStorage.setVal("isConfirmUpdate",'true');
        appcan.locStorage.setVal("isOpenDuty","0");
        appcan.locStorage.setVal("isConfirmTimeArea","0");
        appcan.window.subscribe('isLoginEvent', function (msg) {
            var isDutyAccount = appcan.locStorage.getVal("isDutyAccount");
            if(isDutyAccount=="1"){ //0:不是值班账号  1：是值班账号
                var json={
                    path:serverPath+'schedule.do?focgetChangeTime',
                    data:{},
                    layer: false,
                    layerErr: false
                };
                ajaxRequest(json,function(data,e){
                    if(e=="success"){
                        changeTime = data.obj.change_time*1;
                        var confirNewFourDate = Number(appcan.locStorage.getVal('confirNewFourDate'));
                        // if(new Date().getDate() != confirNewFourDate || !isDefine(confirNewFourDate)){
                            // if(new Date().getHours() >= changeTime){
                                // confirmSubmitFour();
                            // }
                        // }
                    }else{
                    } 
                });
//                 
                var deptId=appcan.locStorage.getVal("deptId");
                var timeAreaArray;//必到时间地点的对象数组
                var json={//请求四个必当日必到时间地点数据，departId：部门id，num：0为只请求数据不推送，1为请求手机推送。
                    path:serverPath+"focTrackInfoController.do?focTimedTask",
                    data:{
                        departId: deptId,
                        num: 0
                    },
                    layer: false,
                    layerErr: false
                };
                ajaxRequest(json,function(data,e){
                    //console.log(JSON.stringify(data));
                    if(e == "success"){
                        timeAreaArray = data.obj;
                        fourTimeAreaWarn(timeAreaArray);//四个必推送和弹窗提醒
                    }
                });
                // t1=setInterval(function () {
                    // load4Duty();
                // },540000);
                t2=setInterval(function(){
                    fourTimeAreaWarn(timeAreaArray);//四个必推送和弹窗提醒
                    var confirNewFourDate = Number(appcan.locStorage.getVal('confirNewFourDate'));
                    if(new Date().getDate() != confirNewFourDate || !isDefine(confirNewFourDate)){
                        if(new Date().getHours() >= changeTime){
                            confirmSubmitFour();
                        }
                    }
                },1000*60)
                
            }
           
           
        });
        var uname = appcan.locStorage.getVal("uname");
        var upswd = appcan.locStorage.getVal("upswd");
        var isLogin=appcan.locStorage.getVal("isLogin");
        var platForm = appcan.locStorage.getVal("platForm");
        // 版本号
        var appInfoVersion = uexWidgetOne.getCurrentWidgetInfo();
        if (isDefine(appInfoVersion)) {
            appInfoVersion = appInfoVersion.version;
        };
        // 存储的版本号
        var oldVersion = appcan.locStorage.getVal("appInfoVersion");
        //!isDefine(oldVersion) 表示从来就没有存储过版本号，第一次更新，或者从来就没有安装过此应用。
        //(isDefine(oldVersion) && !(oldVersion == appInfoVersion))  已经更新过一次，并且出现过一次更新动画，这个是第n次更新，抛出第一次
        if (!isDefine(oldVersion) || (isDefine(oldVersion) && !(oldVersion == appInfoVersion)) ) {
            appcan.locStorage.setVal("appInfoVersion", appInfoVersion);
            if(platForm == "1"){
                appcan.window.open('startup','startup/startup.html',5);
            }else{
                appcan.window.open('startup','startup/startup.html',5);
            }    
        }else{
                if((isDefine(isLogin) && isLogin=="false") || !isDefine(isLogin)){
                    appcan.locStorage.setVal("isLogin","false");
                    var platForm=appcan.locStorage.getVal("platForm");
                    if(platForm=="1"){
                        appcan.window.open('login','login-andriod.html',10);
                    }else{
                        appcan.window.open('login','login.html',10);
                    }
                }else{
                    var isDutyAccount = appcan.locStorage.getVal("isDutyAccount");
                    if(isDutyAccount=="1"){ //0:不是值班账号  1：是值班账号
                        var json={
                            path:serverPath+'schedule.do?focgetChangeTime',
                            data:{},
                            layer: false,
                            layerErr: false
                        };
                        ajaxRequest(json,function(data,e){
                            if(e=="success"){
                                changeTime = data.obj.change_time*1;
                                var confirNewFourDate = Number(appcan.locStorage.getVal('confirNewFourDate'));
                                // if(new Date().getDate() != confirNewFourDate || !isDefine(confirNewFourDate)){
                                    // if(new Date().getHours() >= changeTime){
                                        // confirmSubmitFour();
                                    // }
                                // }
                            }else{
                            } 
                        });
                        var deptId=appcan.locStorage.getVal("deptId");
                        var json={
                            path:serverPath+"focTrackInfoController.do?focTimedTask",
                            data:{
                                departId: deptId,
                                num: 0
                            },
                            layer: false,
                            layerErr: false
                        };
                        ajaxRequest(json,function(data,e){
                            //console.log(data)
                            // alert(e)
                            //console.log(JSON.stringify(data));
                            if(e == "success"){
                                timeAreaArray = data.obj;
                                fourTimeAreaWarn(timeAreaArray);//四个必推送和弹窗提醒
                            }
                        });
                        // t1=setInterval(function () {
                            // load4Duty();
                        // },540000);
                        t2=setInterval(function(){
                            fourTimeAreaWarn(timeAreaArray);//四个必推送和弹窗提醒
                            var confirNewFourDate = Number(appcan.locStorage.getVal('confirNewFourDate'));
                            if(new Date().getDate() != confirNewFourDate || !isDefine(confirNewFourDate)){
                                if(new Date().getHours() >= changeTime){
                                    confirmSubmitFour();
                                }
                            }
                        },1000*60)
                    }

                    //初始化环信插件，聊天主键
                    // initChat();
                    //监听极光推送机制
                    // initJpush();
                    //加载所有人的头像信息
                    loadAllPeopleInfo();
                    appcan.locStorage.setVal("isLogin","true");
                    var updateJson = {
                        AppStoreUrl: serverPath+"appVersionController.do?upgrade",
                        IosUpdateUrl: "https://itunes.apple.com/cn/app/zhang-hui-ji-chang/id1279605064?mt=8",
                        updateUrl: serverPath+"appVersionController.do?upgrade"
                    };
                    appcan.plugInCheckUpdate.checkUpdate(updateJson,function(e){
                    });
                    t3=setInterval(function(){
                        updateVersion();
                    },1000*60*30);
                }
        };

        var conHeight = 0,
            conWidth = 0;
            
        var t = setInterval(function(){
            conHeight = $('#ContentFlexVer').offset().height,
            conWidth = $('#ContentFlexVer').offset().width;
            
            if(conHeight!=0 && conWidth!=0){
                openIndexFrame(0);
                //有用户名密码时执行相应的操作。调用百度地图上传轨迹的方法，此方法需要在用户登录的时候以及以后每次打开APP都要执行
                initUexBaiduMap();
                clearInterval(t);
            }
        }, 500);
        //判断平台Android、iOS
        var platformName=appcan.widgetOne.getPlatformName();
        if(platformName=="android"){
            uexKPBackground.startBackground('5799b66e38234b783bd4f84f59072f08.gbIDyfCIDyfCUZeZ2ZIDyfCUZeZ');
        }else{
        }


        //注释这两个才能在测试环境登录
        // initChat();
        // initJpush();
        
        //心跳接口，存储用户信息。每1分钟执行一次
        setInterval(heartbeat,60000);
        tabview = appcan.tab({
            selector: $("#Tab"),
            hasIcon: true,
            hasAnim: false,
            hasLabel: true,
            hasBadge: true,
            index: 0,
            data : [
            {
                label : "首页",
                icon : "icon-24 icon-24-index ooo"
            }, 
            {
                label : "聊天",
                icon : "icon-24 icon-24-chat",
                badge: chatCount
            }, {
                label : "功能",
                icon : "icon-24 icon-24-option"
            }, {
                label : "通讯录",
                icon : "icon-24 icon-24-address"
            }, {
                label : "我",
                icon : "icon-24 icon-24-my"
            }]
        });
        appcan.window.subscribe("option-num",function(msg){
            tabview.badge(2,Number(msg));
        })
        //点击tab, 返回点击的tab对象和序号
        tabview.on("click", function(obj, index) {
             openIndexFrame(index);
        });
        
        var frameData = [
            {'frameName': 'main','flag': 0,'isOpen':0},
            {'frameName': 'chat','flag': 0,'isOpen':0},
            {'frameName': 'option','flag': 0,'isOpen':0},
            {'frameName': 'address','flag': 0,'isOpen':0},
            {'frameName': 'my','flag': 0,'isOpen':0}
        ];
        var firstOpen = true;
        /**
         *  指定tab打开的对应窗口
         *
         *  @param {number} i 点击的tab对应显示的窗口
         */
        function openIndexFrame(i){
            //如果当前tab对应的窗口是当前窗口, 不做任何操作
            if(frameData[i].flag) return;
            
            frameData.forEach(function(v, j){
                var thisurl,thisleft;
                    thisurl = v.frameName+'/'+v.frameName+'.html';
                    thisleft = 0;
                if(i==j){
                    thisleft = 0;
                    frameData[j].flag = 1;
                }else{
                    thisleft = -conWidth;
                    frameData[j].flag = 0;
                }
                
                if(firstOpen){
                    appcan.window.openPopover({
                        name: 'p'+j,
                        url: thisurl,
                        left: thisleft,
                        top: 0,
                        width: conWidth,
                        height: conHeight
                    });
                }else{
                    appcan.window.resizePopover({
                        name: 'p'+j,
                        left: thisleft,
                        top: 0,
                        width: conWidth,
                        height: conHeight
                    });
                }
            });
            firstOpen = false;
        }
        /*
        function openIndexFrame(i){
            //如果当前tab对应的窗口是当前窗口, 不做任何操作
            if(frameData[i].flag) return;
                var thisurl,thisleft;
                    thisurl = frameData[i].frameName+'/'+frameData[i].frameName+'.html';
                if(frameData[i].isOpen==0){
                    
                    appcan.window.openPopover({
                        name: 'p'+i,
                        url: thisurl,
                        left: 0,
                        top: 0,
                        width: conWidth,
                        height: conHeight
                    });
                    frameData[i].isOpen=1;
                }else{
                    frameData.forEach(function(v, j){
                                if(i==j){
                                    thisleft = 0;
                                    frameData[j].flag = 1;
                                }else{
                                    thisleft = -conWidth;
                                    frameData[j].flag = 0;
                                }
                        appcan.window.resizePopover({
                                name: 'p'+j,
                                left: thisleft,
                                top: 0,
                                width: conWidth,
                                height: conHeight
                        });
                     });  
                }
        }**/
       
        window.onorientationchange = window.onresize = function() {
            //openIndexFrame(0);
        };
        
        //清空某些缓存字段
        var locArr = ['peoplepick', 'peoplepick_1', 'peoplepick_2', 'groupmember'];
        locArr.forEach(function(name){
            appcan.locStorage.remove(name);
        });
        //从my：我的页面退出操作过来的
        appcan.window.subscribe('reseat',function(data){
            if(data=="reseat"){
                if(isDefine(t1)){
                    clearInterval(t1);
                }
                if(isDefine(t3)){
                    clearInterval(t3);
                }
                //打开第一个页面
                openIndexFrame(0);
                //将tab默认选中第一个
                tabview.moveTo(0);
            }
        });
        appcan.window.subscribe('isChatOpen',function(data){
             if(data=="open"){
                 var uexEasemobConnect=appcan.locStorage.getVal("uexEasemobConnect");
                 if(uexEasemobConnect=="true"){
                     appcan.window.publish("loadRecent","loadRecent");
                 }
             }
        });
        appcan.window.subscribe('closeMyPasswordNew',function(data){
            if(data=="closeMyPasswordNew"){
                 var closeArr = ['my-safety','my-password-old','my-password-new'];
                 closeArr.forEach(function(name){
                    appcan.window.evaluateScript({
                        name:name,
                        scriptContent:'appcan.window.close(0);'
                    });
                 });
                //打开第一个页面
                openIndexFrame(0);
                //将tab默认选中第一个
                tabview.moveTo(0);
                var platForm=appcan.locStorage.getVal("platForm");
                if(platForm=="1"){
                    appcan.window.open('login','login-andriod.html',9);
                }else{
                    appcan.window.open('login','login.html',9);
                }
            }
        });
        uexWidget.onResume = function(){
            
            //程序恢复，告诉聊天页面延迟1秒再执行刷新列表。
            
            isResume=true;
            appcan.locStorage.setVal("isResume",true);
            //延迟1秒刷新列表。
            setTimeout(function(){
                appcan.window.publish("chatOnResume","chatOnResume");
                uexEasemob.getTotalUnreadMsgCount(function(data){
                             tabview.badge(1,Number(data.count));
                });
                 
            },2000);
            appcan.window.publish("option-get-num","option-get-num");
        };
        //从登录页过来的，初始化环信即使通信
        appcan.window.subscribe('initEasemob',function(data){
            if(data=="initEasemob"){
                //initChat();
                 //加载所有人的头像信息
                loadAllPeopleInfo();
                //心跳接口，存储用户信息。每1分钟执行一次
                //setInterval(heartbeat,60000);
            }
        });
        
        //从initChat.js过来的。更新未读数
        appcan.window.subscribe('reloadUnread',function(data){
            if(data=="reloadUnread"){
                //获取未读消息数
                uexEasemob.getTotalUnreadMsgCount(function(data){
                    tabview.badge(1,Number(data.count));
                })
            }
        });
        //从initChat.js过来的。更新未读数
        appcan.window.subscribe('canReloadUnread',function(data){
            if(data=="canReloadUnread"){
                var isLoResume=appcan.locStorage.getVal("isResume");
                //如果是第一次启动app则等2秒后更新聊天未读数。否则及时更新 isResume false表示不是第一次进入 。
                if(!isDefine(isLoResume)||isLoResume=='false'){
                    //获取未读消息数
                    uexEasemob.getTotalUnreadMsgCount(function(data){
                        tabview.badge(1,Number(data.count));
                    })
                }
                
            }
        });
        appcan.window.subscribe('connected',function(data){
            //获取未读消息数
            uexEasemob.getTotalUnreadMsgCount(function(data){
                tabview.badge(1,Number(data.count));
            })
        });
        appcan.window.subscribe('loadUpdate',function(data){
            //更新操作
           var updateJson = {
                    AppStoreUrl: serverPath+"appVersionController.do?upgrade",
                    IosUpdateUrl: "https://itunes.apple.com/cn/app/zhang-hui-ji-chang/id1279605064?mt=8",
                    updateUrl: serverPath+"appVersionController.do?upgrade"
                };
            
            appcan.plugInCheckUpdate.checkUpdate(updateJson,function(e){
            });
            t3=setInterval(function(){
                updateVersion();
            },1000*60*30);
        });
        //捕获从login页面传过来的消息，开始执行百度地图的位置信息上传代码
        appcan.window.subscribe('beginUploadLocation',function(data){
            if(data=="begin"){
                //开始执行百度地图轨迹上传代码
                //alert("enter subscribe function");
                initUexBaiduMap();
            }
        });
        
         appcan.window.subscribe('startupClose',function(data){
              appcan.window.evaluateScript({
                    name: "startup",
                    scriptContent: "uexWindow.close(5, 500);"
              });
             
        });
       //截图信息 
       //平台Android、iOS
        var platformName=appcan.widgetOne.getPlatformName();
        if(platformName=="android"){
        }else{
            // uexPhotoLibraryObserver.onData = onData;
        }
        
        var json_w10021 = {
            "uname": appcan.locStorage.getVal("uname"),
            "token": appcan.locStorage.getVal("token"),
            "platForm": appcan.locStorage.getVal("platForm")
        };
        appcan.window.subscribe('widget-10021', function(e) {
            appcan.widget.startWidget({
                appId : 'aaalb10021',
                animId : '2',
                funName : 'widgetDidFinish',
                info : JSON.stringify(json_w10021),
                animDuration : 200,
                callback : function(err,data,dataType,opId){
                    if(!err){
                        
                    }
                }
            })
        });
        
     });
})($);

//子widget结束时将String型的任意字符回调给该方法
function widgetDidFinish(e) {
    //alert(e);
}

/**
 * 心跳接口。每1分钟执行一次，存储用户信息。 
 *
 */
function heartbeat(){
    var isLogin=appcan.locStorage.getVal("isLogin");
    if((isDefine(isLogin) && isLogin=="false") || !isDefine(isLogin)){
        return;
    }
    var userid=appcan.locStorage.getVal("userID");
    var userName=appcan.locStorage.getVal("userName");
    var deptName=appcan.locStorage.getVal("deptName");
    var deptId=appcan.locStorage.getVal("deptId");
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
    var platFormName;
    if(platformName=="android"){
        platForm=1;
        platFormName="Android";
    }else{
        platForm=0;
        platFormName="Ios";
    }
    
    var content="公司："+deptName+" ,员工："+userName+" ,登录的app版本："+version+" ,登录的平台："+platFormName+",百度回调次数："+locationIndex;
    var json={
        path:serverPath+"focAppHeartbeatController.do?focDoAdd",
        data:{
            userid:userid,
            content:content,
            platform:platForm,
            version:version,
            type:0,
            orgid:deptId,
            orgname:deptName
        },
        layer:false,
        layerErr:false
    };
    ajaxRequest(json,function(data,e){
        locationIndex=0;
        
    })
}
/**
 *  更新App的方法 ，每半个小时查询一次。
 */
function updateVersion(){
    //更新操作
    var updateJson = {
            AppStoreUrl: serverPath+"appVersionController.do?upgrade",
            IosUpdateUrl: "https://itunes.apple.com/cn/app/zhang-hui-ji-chang/id1279605064?mt=8",
            updateUrl: serverPath+"appVersionController.do?upgrade"
        };
    
    appcan.plugInCheckUpdate.checkUpdate(updateJson,function(e){
    });
}

/**
 * 存储截图图片及拍照图片信息 
 *
 */
 function onData(data) {
     var date=new Date().getTime();
     var json={
         "date":date,
         "path":data.path
     }
     appcan.locStorage.setVal("photo",json);
     appcan.window.publish("photoLibraryObserver",JSON.stringify(data.path));
    }


function load4Duty(){
    var json={
        path:serverPath+"focTrackInfoController.do?focInfoList",
        data:{
            startPage: 0,
            endPage: 10
        },
        layer: false,
        layerErr: false
    };
    ajaxRequest(json,function(data,e){
        //console.log(data)
        // alert(e)
        //console.log(JSON.stringify(data));
        if(e == "success"){
            setPage(data);
            if (data.attributes.infoList.length == 0) {
                return;
            }
            var firstIsFinish = (data.attributes.infoList[0].infoType == 0),
                noData = (data.attributes.infoList.length == 0),
                nowDate = timeStemp(new Date().getTime(),'MM-dd').date,
                nowDate2 = timeStemp(new Date().getTime(),'yyyy-MM-dd').date,
                nowTime = timeStemp(new Date().getTime(),'yyyy-MM-dd HH:ss').date,
                planTime = nowDate2+' 09:00',
                dutTimes = timeStemp(Number(data.attributes.infoList[0].unixTimestamp),'MM-dd').date;
                // dutyTimeu = timeStemp(Number(data.obj[0].dutyDate),'MM-dd').commonDate;
                appcan.locStorage.setVal('dutyTime',dutTimes);
                // alert(dutTimes)
            if(data.attributes.infoList.length > 0){
                if (firstIsFinish) {
                    if (dutTimes !== nowDate && nowTime >= planTime) {
                        af();
                    }
                }
            }
        }
    });
};

function fourTimeAreaWarn(obj){
    var timeAreaData,
        timeAreaArray = obj,
        userId = appcan.locStorage.getVal("userID"),
        nowDate = timeStemp(new Date().getTime(),'MM-dd').date,
        nowDate2 = timeStemp(new Date().getTime(),'yyyy/MM/dd').date,
        nowTime = timeStemp(new Date().getTime(),'yyyy-MM-dd HH:mm:ss').date,
        nowTimeStamp = new Date().getTime();//当前时间戳
    for(var i=0; i<timeAreaArray.length; i++){
        var mustTime = (nowDate2+" "+timeAreaArray[i].taskStartTime);//四必巡查时间，格式为yyyy/MM/dd HH:mm:ss
        var mustTimeStamp = new Date(mustTime).getTime();//四必巡查时间戳，用以算提前时间。
        var confirmTime = timeStemp(mustTimeStamp-600000,'yyyy-MM-dd HH:mm:ss').dateTime;//四必巡查弹窗和推送时间戳
        //每次开app就会运行一次，弹窗和推送只进行一次
        if(nowTimeStamp < mustTimeStamp){
            if(nowTimeStamp > confirmTime){
                if(isConfirmFourTime == true){
                    timeAreaData = timeAreaArray[i];
                    //alert('您'+ timeAreaData.taskStartTime +'有巡查地点：'+timeAreaData.taskArea+'需要巡查。')
                    confirmTimeArea(timeAreaData);
                }
            }else{
                isConfirmFourTime = true;
            }
            
            break;
        }
    }
};

function confirmSubmitFour(){
    var deptId=appcan.locStorage.getVal("deptId");
    var json={
        path:serverPath+"focTrackInfoController.do?focGetTrackResult",
        data:{
            deptID:deptId
        },
        layer: false,
        layerErr: false
    };
    ajaxRequest(json,function(data,e){
        // console.log(data)
        // console.log(hasConfirmNewFour)
        if(e == "success"){
            if(data.obj >= 1 && hasConfirmNewFour == false){
                
                hasConfirmNewFour = true;
                uexWindow.confirm({
                    title:"温馨提示",
                    message:"您今天的四必巡检已经开始啦，不要忘记按时去执行四必哦！ ",
                    buttonLabels:"确定"
                },function(index) {
                    if (index == 0) {
                        appcan.locStorage.setVal('confirNewFourDate', new Date().getDate());
                        appcan.window.publish("refreshFourList",1);
                    } else {
                    }
                });
            }
            
        }
    });
};

function setPage(data) {
        // data.attributes.infoList[0].unixTimestamp=timeStemp(Number(data.attributes.infoList[0].unixTimestamp),'yyyy-MM-dd').date;
        // if(data.attributes.infoList[0].infoType==0){
            // data.attributes.infoList[0].time=timeStemp(Number(data.attributes.infoList[0].create_time),'yyyy-MM-dd').date;
        // }else{
            // data.attributes.infoList[0].time=timeStemp(Number(data.attributes.infoList[0].finish_time),'yyyy-MM-dd').date;
        // }
    appcan.locStorage.setVal("dutyDeptId",appcan.locStorage.getVal("deptId"));
    appcan.locStorage.setVal("dutyDeptTime",timeStemp(Number(data.attributes.infoList[0].unixTimestamp),'yyyy-MM-dd').date);
    if(data.attributes.infoList[0].infoType==0){
        //可编辑
        appcan.locStorage.setVal("isCanEdit",true);
    }else{
        //不可编辑
        appcan.locStorage.setVal("isCanEdit",false);
    }
};