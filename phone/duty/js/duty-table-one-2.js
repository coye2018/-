//定义，默认选中的下角标。
var activeIndex = 3;

Vue.use(VueLazyload, {
    preLoad: 2
});

//定义vue， 
var vm = new Vue({
    el: '#Page',
    data: {
        weekData: ['日','一','二','三','四','五','六'],
        monthDays: [],
        today: new Date().getFullYear()+'年'+(new Date().getMonth()+1)+'月',
        todayFull: '',
        dutyPeople:[],
        dutyPeopleType: [],
        showIndex: -1,
        showKey: -1,
        isSlide: false,
        nothing: false,
        nonet: false,
        dutyAccount:[]
    },
    mounted: function () {
        //ios300ms延时
        FastClick.attach(document.body);
    },
    methods: {
        hideOption: function() {
            this.showIndex = -1;
            this.showKey = -1;
        },
        showOption: function(item, index, value, key) {
            var id = Number(value.detail_id);
            if (this.showIndex != -1 && this.showIndex == index && this.showKey == id) {
                this.hideOption();
            } else {
                this.showIndex = index;
                this.showKey = Number(id);
            }
        },
        pick:function(item,index){
            //改变原来选中的状态。
            vm.weekdays[activeIndex].actives=false;
            //把现在点击的dom元素改为选中状态。
            vm.weekdays[index].actives=true;
            //将今天的月份修改为当前月份
            vm.today=vm.weekdays[index].fullYearAndMoth;
            //最后赋值
            activeIndex=index;
            //下面写ajax
            loadDutyDate(vm.weekdays[index].dateTime);
       },
       call:function(item){
            for(var i=0;i<vm.dutyAccount.length;i++){
                if(vm.dutyAccount[i].departId==item.departId){
                    if(vm.showKey==31){
                        if(isDefine(vm.dutyAccount[i].majorUserPhone)){
                            uexCall.dial(vm.dutyAccount[i].majorUserPhone);
                            break;
                        }else{
                            layerToast('暂无该人员电话号码！');
                            break;
                        }
                    }else{
                        if(isDefine(vm.dutyAccount[i].viceUserPhone)){
                            uexCall.dial(vm.dutyAccount[i].viceUserPhone);
                            break;
                        }else{
                            layerToast('暂无该人员电话号码！');
                            break;
                        }
                    }
                }
            }
       },
       getMonthDuty:function(item){
           console.log(vm.showKey);
           
           //月表id
           appcan.locStorage.setVal("banciid",vm.showKey);
           //将各公司id存入缓存中
           appcan.locStorage.setVal("dutyMonthDeptId",item.departId);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-month','duty-month.html',2);
            }else{
               appcan.window.open({
                name:'duty-month',
                dataType:0,
                data:'duty-month.html',
                aniId:aniId,
                type:1024
            }); 
            }
            
       },
       /**
        *当点击轨迹时调用此方法
        * @param {Object} item:包含该单位所有值班信息的JSON
        * @param {Object} vm.dutyPeopleType:公司的值班规则详情，包括班次名称、换班时间  
        */
       getTrack:function(item){
           console.log(vm.showKey);
           if(vm.showKey==32){
               layerToast('副班暂时不上传轨迹，所以无法查看其位置和轨迹');
               return;
           }
           
           //if(vm.showIndex=1)
           
            var deptid=appcan.locStorage.getVal("deptId");
            //当前公司的第一个值班人员
           var userId="";
           //是否是值班帐号，1为是，如果是值班帐号则取当天的值班人员的userId;否则取当前登录人userid
           var isDutyAccount=appcan.locStorage.getVal("isDutyAccount");
           if(isDutyAccount=="1"){
               for (var i=0; i < vm.dutyPeople.length; i++) {
                   if(vm.dutyPeople[i].departId==deptid){
                       userId=vm.dutyPeople[i].dutyPeoples[0].userid;
                       break;
                   }
                }; 
           }else{
               userId=appcan.locStorage.getVal("userID");
           }
           //调用后台接口查看用户是否有查看该值班人员的轨迹位置权限
           var json={
               path:serverPath+"focPositionRightController.do?focGetCanLookUserTFByDepartId",
               data:{
                    departId:deptid,//查看人
                    aid:item.dutyPeoples[0].userid//被查看人
               },
               layer:false,
               layerErr:false
           }
           ajaxRequest(json,function(data,e){
                if(e=="success"){
                    //obj中返回true时是有权限查看
                    if(data.obj){
                         var dutyData={
                           "dutyPersons":item,
                           "dutyRoleInfo":vm.dutyPeopleType
                        }
                        showPositionOrTrack(2,dutyData);
                    }else{
                        layerToast("您暂无查看该值班人员的轨迹权限！");
                    }
                }else{
                    
                }
           })
           
           //将数据存储到缓存中。
           //appcan.locStorage.setVal("dutyTrackInfo",JSON.stringify(json));
           //appcan.window.open("duty-four-track","duty-four-track.html",2);
       },
       /**
        *当点击位置时调用此方法
        * @param {Object} item:包含该单位所有值班信息的JSON
        * @param {Object} vm.dutyPeopleType:公司的值班规则详情，包括班次名称、换班时间  
        */
       getTrackPosition:function(item){
           if(vm.showKey==32){
               layerToast('副班暂时不上传轨迹，所以无法查看其位置和轨迹');
               return;
           }
           var deptid=appcan.locStorage.getVal("deptId");
           //当前公司的第一个值班人员
           var userId="";
           //是否是值班帐号，1为是，如果是值班帐号则取当天的值班人员的userId;否则取当前登录人userid
        var isDutyAccount=appcan.locStorage.getVal("isDutyAccount");
        if(isDutyAccount=="1"){
            for (var i=0; i < vm.dutyPeople.length; i++) {
                if(vm.dutyPeople[i].departId==deptid){
                    userId=vm.dutyPeople[i].dutyPeoples[0].userid;
                    break;
                }
             }; 
        }else{
            userId=appcan.locStorage.getVal("userID");
        }
          //调用后台接口查看用户是否有查看该值班人员的轨迹位置权限
          var json={
               path:serverPath+"focPositionRightController.do?focGetCanLookUserTFByDepartId",
               data:{
                    departId:deptid,//查看人
                    aid:item.dutyPeoples[0].userid//被查看人
               },
               layer:false,
               layerErr:false
           }
           ajaxRequest(json,function(data,e){
                if(e=="success"){
                    //obj中返回true时是有权限查看
                    if(data.obj){
                        var dutyData={
                           "dutyPersons":item,
                           "dutyRoleInfo":vm.dutyPeopleType
                        }
                        showPositionOrTrack(1,dutyData);
                    }else{
                        layerToast("您暂无查看该值班人员的位置权限！");
                    }
                }else{
                    
                }
           }) 
           
           
          
           //将数据存储到缓存中。
           //appcan.locStorage.setVal("dutyTrackInfo",JSON.stringify(json));
           //appcan.window.open("duty-four-track-position","duty-four-track-position.html",2);
       }
   }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(13);
    });
    //是否第一次访问该页面
    var isFirst = appcan.locStorage.getVal('isFirst-dutyTableOne');
    //如果是第一次访问
    if(!isDefine(isFirst) || isFirst=='0'){
        //animateShade();
    }
    
    appcan.ready(function() {
        
        // vm.weekdays = getLast7Days(0);
        vm.todayFull = timeStemp(new Date().getTime(), 'yyyy-MM-dd').date; //今天的日期
        
        //加载值班数据。
        //var today = Math.round(new Date().getTime() / 1000);
        //loadDutyDate(today);
        
        var platFormC=appcan.locStorage.getVal("platForm");
        var isSupport=false;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
             //appcan.window.close(-1); 
        }
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
    });
    //测试轨迹用的
    $("#nav").on('click',function(){
        //值班日期，格式：2017-05-25 00：00：00.0
    var dutyStartTime="8";
    var queryStartTime=parseInt(new Date(((timeStemp(new Date().getTime(),'yyyy-MM-dd').date)+" 00:00:00.0").replace(/\-/g,"/")).getTime()/1000)+dutyStartTime*60*60;
    var queryParams={
            "queryUsercode":appcan.locStorage.getVal("userCode"),
            "queryUserName":appcan.locStorage.getVal("userName"),
            "queryStartTime":queryStartTime
    };
    
    //将要查询的参数放入缓存
    appcan.locStorage.setVal("dutyQueryParams",JSON.stringify(queryParams));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('duty-four-track','duty-four-track.html',2);
         }else{
              appcan.window.open({
                     name:'duty-four-track',
                     dataType:0,
                     data:'duty-four-track.html',
                     aniId:10,
                     type:0
              }); 
         }
    });
    //动态绑定右键,判断此用户是否有权限查看所有人位置。
    $("#nav-right").on('click',function(){
         var platForm=appcan.locStorage.getVal("platForm");
         var aniId=0;
        //调用后台接口查看用户是否有查看所有值班人员的轨迹位置权限
         var json={
               path:serverPath+"focUserController.do?focShowGJ",
               data:{
               },
               layer:false,
               layerErr:false
           }
           ajaxRequest(json,function(data,e){
                if(e=="success"){
                    //obj中返回true时是有权限查看
                     if(data.attributes.cansee){
                         if(platForm=="1"){
                                appcan.window.open('duty-four-track-allduty-position','duty-four-track-allduty-position.html',2);
                             }else{
                                  appcan.window.open({
                                         name:'duty-four-track-allduty-position',
                                         dataType:0,
                                         data:'duty-four-track-allduty-position.html',
                                         aniId:10,
                                         type:0
                                  }); 
                             }
                     }else{
                         layerToast("您暂无查看所有值班人员位置的权限！");
                     }
                }else{
                    
                }
           })
    })
    
    //引导遮罩的动画效果
    function animateShade(){
        var act = 'actives';
        
        ModalHelper.afterOpen();
        $('.shade').removeClass('shade-hide');
        setTimeout(function(){
            $('.duty-shade-1').addClass(act);
        }, 200);
        setTimeout(function(){
            $('.duty-shade-2').addClass(act);
        }, 1000);
        setTimeout(function(){
            $('.duty-shade-3').addClass(act);
        }, 2000);
    }
    
    //点击遮罩, 隐藏且不再出现
    $('.duty-shade-3').on('click', function(e){
        e.stopPropagation();
        
        ModalHelper.beforeClose();
        $('.shade').addClass('shade-hide');
        appcan.locStorage.setVal('isFirst-dutyTableOne', '1');
        return false;
    });
    
})($);
/**
 *  
 * @param {Object} day 值班日期，后台处理某个时间段的值班人
 */
window.ISTIME = false;

function loadDutyDate(day){
    if(!isDefine(day)){
        day = Math.round(new Date().getTime()/1000);
    }
    
    if (ISTIME) {
        var fixTime = new Date(day * 1000);
        fixTime.setDate(fixTime.getDate() + 1);
        day = Date.parse(fixTime) / 1000;
    }
    
    var json={
        path:serverPath+'schedule.do?focgetDayDuty',
        data:{
            time: day
        },
        layer:false,
        layerErr:false
    };
    ajaxRequest(json,function(data,e){
        if(e=="success"){
            console.log(data);
            //有网
            vm.nonet=false;
            vm.nothing=false;
            if(data.obj.length==0){
                //无数据
                vm.nothing=true;
            }
            
            vm.dutyPeople=data.obj;
            vm.dutyAccount=data.attributes.dutyAccount;
            
            vm.dutyPeople.forEach(function(n, i, a){
                //var sj = getRandomNum(44, 1080);
                //Vue.set(n, 'dutyHead', 'https://unsplash.it/'+sj+'/'+sj+'/?random');
                Vue.set(n, 'departHead', serverPath + n.departImage);
            });
            //定义所有单位的信息以便查看所有人地理位置所使用。
            var ondutyPhone=new Array();
            for (var i=0; i < data.obj.length; i++) {
                var ondutyAll={};
                ondutyAll.dutyNum = data.obj[i].dutyCode;
                ondutyAll.dutyNameShort = data.obj[i].description;
                ondutyAll.dutyName = data.obj[i].departname;
                ondutyPhone.push(ondutyAll);
            };
            //将所有单位的信息以便查看所有人地理位置所使用。
            appcan.locStorage.setVal("ondutyPhone",JSON.stringify(ondutyPhone));
            vm.dutyPeopleType=data.attributes.dutyModeDetail;
        }else{
            
            if(vm.dutyPeople.length>0){
                 //有网
                vm.nonet=false;
                vm.nothing=false;
            }else{
                //无网
                vm.nonet=true;
                vm.nothing=false;
            }
            
            $('.shade').addClass('shade-hide');
        } 
    });
}

/**
 * 
 * @param {Number} flag:用来表示是查看位置还是轨迹，1：位置，2：轨迹
 * @param {Object} data：传递的参数，包括值班信息以及值班规则等信息
 */
function showPositionOrTrack(flag,data){
    /*
     *关于值班规则的问题，目前我们认定(或者说支持)只有以下两种规则
     * 1、白云机场的规则：有两个班次，主副班，但是值班的时候都用值班账号登录
     * 2、其他机场规则：只有一个班次，没有值班账号，每次值班的时候都用自己的个人账号登录
     *  不支持其他情况暂时，所有的代码逻辑都按照这个规则来实施
     */
    //var data=JSON.parse(appcan.locStorage.getVal("dutyTrackInfo"));
    //要查看的单位的ID
    var seeDeptID=data.dutyPersons.departID;
    
    //首先判断当前用户是否有查看该单位值班人员定位轨迹的权限
    if(!isAllowed()){
        layerToast("对不起，您无权查看该信息！",2);
        return;
    }
    var dutyAccount;
    if(vm.showKey==31){
        for(var i=0;i<vm.dutyAccount.length;i++){
            if(vm.dutyAccount[i].departId==data.dutyPersons.departId){
                dutyAccount=vm.dutyAccount[i].majorUserUserName;
                break;
            }
        }
    }
    console.log(dutyAccount);
    //该单位值班账号，可能为空
    
    //第一个值班人的userCode，只取第一个   
    var dutyPersonUserCode=data.dutyPersons.dutyPeoples[0].username;
    //第一个值班人的userName，只取第一个   
    var dutyPersonUserName=data.dutyPersons.dutyPeoples[0].realname;
    //alert(dutyPersonUserName);
    //交接班时间，只取第一个
    var dutyStartTime=data.dutyRoleInfo[0].change_time;
    //根节点的名称，用来区分是哪个机场
    var rootName=appcan.locStorage.getVal("rootName");
    //值班日期，格式：2017-05-25 00：00：00.0
    var dutyDateTime=data.dutyPersons.duty_time;
    //要查询定位和轨迹的用户的userCode
    var queryUsercode,queryStartTime;
    //查询轨迹的起始时间，规则是：值班日期的时间戳加上值班起始时间的时间戳，以秒计算
    var queryStartTime=parseInt(new Date((dutyDateTime.split(" ")[0]).replace(/\-/g,"/")).getTime()/1000)+dutyStartTime*60*60;
    
    //如果是白云机场，则查询的是值班账号的定位
    if(rootName=="白云股份公司"){
        //如果没有值班账号，则直接返回
        if(!isDefine(dutyAccount)){
            layerToast("该单位没有值班账号，无法查询位置信息！",2);
            return;
        }
        //白云机场的查询的就是值班账号
        queryUsercode=dutyAccount;        
    }else{
        //如果没有值班人员，则直接返回
        if(!isDefine(dutyPersonUserCode)){
            layerToast("该单位没有值班人员，无法查询位置信息！",2);
            return;
        }
        //其他机场查询的是值班人员的个人账号
        queryUsercode=dutyPersonUserCode; 
    }
    
    var queryParams={
        "queryUsercode":queryUsercode,
        "queryUserName":dutyPersonUserName,
        "queryStartTime":queryStartTime
    };
    //将要查询的参数放入缓存
    appcan.locStorage.setVal("dutyQueryParams",JSON.stringify(queryParams));
    //根据参数判断是打开位置还是轨迹页面
    var platForm = appcan.locStorage.getVal("platForm");
    var aniId = 0;
    var nowStamps = (new Date().getTime())/1000;
    if(flag==1){
        if (nowStamps >= queryStartTime) {
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-four-track-position','duty-four-track-position.html',2);
            }else{
                appcan.window.open({
                    name:'duty-four-track-position',
                    dataType:0,
                    data:'duty-four-track-position.html',
                    aniId:10,
                    type:0
                });
             }
         } else {
             layerToast('您无法查看未来的位置。', 3);
         }
    }else{
        if (nowStamps >= queryStartTime) {
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-four-track','duty-four-track.html',2);
            }else{
                appcan.window.open({
                    name:'duty-four-track',
                    dataType:0,
                    data:'duty-four-track.html',
                    aniId:10,
                    type:0
                }); 
            }
         } else {
             layerToast('您无法查看未来的轨迹。', 3);
         }
    }
}

/**
 *判断当前用户是否有权限查看该部门值班人员的定位和轨迹
 * @return {boolean} false:无权限；true:有权限 
 */
function isAllowed(){
    //由于此规则比较复杂，目前尚未开发，所以直接返回true
    return true;
}

;(function (){
    /**
     * 请求值班时间，通过该时间渲染值班日历
     */
    var json={
        path:serverPath+'schedule.do?focgetChangeTime',
        data:{},
        layer: true,
        layerErr: true
    };
    ajaxRequest(json,function(data,e){
        if(e=="success"){
           var nowHours = new Date().getHours();
           ISTIME = nowHours < (data.obj.change_time*1);
           var dd = new Date();
           if (ISTIME) {
               dd.setDate(dd.getDate() - 1);
           }
           
           var dObj = {
               y: dd.getFullYear(),
               m: dd.getMonth(),
               d: dd.getDate()  
           }
           initCanlendar(dObj);
           // 渲染日历
           $(".calendar-box").removeClass("visibility");
        }else{
           ISTIME = false;
           vm.nonet = true;
        } 
    });
})();

