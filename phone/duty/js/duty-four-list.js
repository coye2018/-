var vm = new Vue({
    el: '#duty_four',
    data: {
        isNothing: false,
        nonet: false,
        dutyData: [],
        ishideBegin: true
    },
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    methods: {
        unclick:function(item,index){
            //noClick($('.clickable'));
            
            // 测试用的
            //appcan.locStorage.setVal("dutyDeptId","8a8a8bfc59977acf01599790be75000e");
            appcan.locStorage.setVal("dutyDeptId",appcan.locStorage.getVal("deptId"));
            appcan.locStorage.setVal("dutyDeptTime",item.dutyDate);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-four-2','duty-four-2.html',2);
            }else{
                appcan.window.open({
                    name:'duty-four-2',
                    dataType:0,
                    data:'duty-four-2.html',
                    aniId:aniId,
                    type:1024
                });
            }
            if(item.isFinish==0){
                //可编辑
                appcan.locStorage.setVal("isCanEdit",true);
            }else{
                //不可编辑
                appcan.locStorage.setVal("isCanEdit",false);
            }
        },
        openTable:function(){
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("duty-four-table","duty-four-table.html",2);
            }else{
                appcan.window.open({
                    name:'duty-four-table',
                    dataType:0,
                    data:'duty-four-table.html',
                    aniId:aniId,
                    type:1024
                });
            }
            
        },
        beginPatrol:function(){
            var rootID=appcan.locStorage.getVal("rootID");
            if(rootID=="8a8a8bfc59977acf0159978d29db0002"){
               var  isDutyAccount=appcan.locStorage.getVal("isDutyAccount");
               if(isDutyAccount!="1"){
                   layerToast("您的帐号无权执行四必。");
                   return false;
               }
            }
            var now=timeStemp(new Date().getTime(),"yyyy-MM-dd").dateTimeSecond;
            appcan.locStorage.setVal("dutyDeptId",appcan.locStorage.getVal("deptId"));
            appcan.locStorage.setVal("dutyDeptTime",now);
            var json={
                path:serverPath+"focFourMustController.do?focBeginTodayInspect",
                data:{
                    dutyDate:now
                }
            };
            ajaxRequest(json,function(data,e){
                if(e=="success"){
                    //删除巡查项的缓存数据、特殊情况的图片及内容缓存数据
                    appcan.locStorage.remove('duty-4-term');
                    appcan.locStorage.remove("dutySpecialImg");
                    appcan.locStorage.remove("dutySpecialContent");
                    appcan.locStorage.remove("duty4question");
                    appcan.locStorage.remove("duty4questionIdx");
                    //可编辑
                    appcan.locStorage.setVal("isCanEdit",true);
                    var platForm=appcan.locStorage.getVal("platForm");
                    var aniId=0;
                    //Android
                    if(platForm=="1"){
                        appcan.window.open("duty-four-2","duty-four-2.html",2);
                    }else{
                        appcan.window.open({
                            name:'duty-four-2',
                            dataType:0,
                            data:'duty-four-2.html',
                            aniId:aniId,
                            type:1024
                        });
                    }
                    
                    
                }
            })
            
        }
    }
});


(function($) {

    // 第一次访问该页面显示教程
    var isFirst = appcan.locStorage.getVal('isFirst-dutyFourList');
    if(!isDefine(isFirst) || isFirst=='0'){
        animateShade();
    };
    
    // 上下拉加载
    var mescroll = new MeScroll('mescroll', {
        down: {
            auto: false
        },
        up: {
            use: true,
            auto: true,
            page: {
                num : 0, 
                size : 10
            },
            callback: load4DutyDate
        }
    });
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function() {
        
        // 页面返回重载数据
        appcan.window.subscribe("reloadDuty",function(msg){
            //console.log(11111111111111);
            vm.dutyData = [];
            mescroll.resetUpScroll();
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
        appcan.window.subscribe("duty-four-click",function(msg){
            yesClick($('.clickable'));
        })
        
    });
    
    //点击遮罩, 隐藏且不再出现
    $('.du4-list-shade-3').on('click', function(e){
        e.stopPropagation();
        ModalHelper.beforeClose();
        $('.shade').addClass('shade-hide');
        appcan.locStorage.setVal('isFirst-dutyFourList', '1');
        return false;
    });
    
    //引导遮罩的动画效果
    function animateShade(){
        var act = 'actives';
        
        ModalHelper.afterOpen();
        $('.shade').removeClass('shade-hide');
        setTimeout(function(){
            $('.du4-list-shade-1').addClass(act);
        }, 200);
        setTimeout(function(){
            $('.du4-list-shade-2').addClass(act);
        }, 1000);
        setTimeout(function(){
            $('.du4-list-shade-3').addClass(act);
        }, 2000);
    };
    
    function load4DutyDate(page){
        var pageIndex = page.num,
            pageSize = page.size;
        if (pageIndex == 1) {
            vm.dutyData = [];
        };  
        var json={
            path:serverPath+"focFourMustController.do?focGetMyOrgMustList",
            data:{
                page: pageIndex,
                size: pageSize
            },
            layer:false
        };
        ajaxRequest(json,function(data,e){
            //console.log(JSON.stringify(data));
            if(e == "success"){
                if(pageIndex == 1){
                   // no data
                    if (data.obj.length == 0) {
                        vm.isNothing = true;
                        vm.ishideBegin = false;
                        mescroll.endErr();
                        return;
                    }
                     
                    var firstIsFinish = (data.obj[0].isFinish == 0),
                        noData = (data.obj.length == 0),
                        now = timeStemp(new Date().getTime(),'yyyy-MM-dd').date,
                        dutTimes = timeStemp(Number(data.obj[0].dutyDate),'yyyy-MM-dd').date,
                        isToday = (now == dutTimes);
                    if(!noData){
                        vm.isNothing = false;
                    }
                    // 显示四个必按钮
                    if ((firstIsFinish == true) || (isToday == true)) {
                        vm.ishideBegin = true;
                        $('#ScrollContent').addClass('nopadding-b');
                    }else{
                        vm.ishideBegin = false;
                    }
                };
                if(data.obj.length>0){
                    setPageData(data);
                    mescroll.endSuccess(data.obj.length);
                }
                
            }else{
               vm.nonet = true; 
               mescroll.endErr();
            }
        });
    };
    
    function setPageData(data) {
        for (var i=0; i < data.obj.length; i++) {
             data.obj[i].dutyDateTime=timeStemp(Number(data.obj[i].dutyDate),'yyyy-MM-dd').date;
             if(data.obj[i].isFinish==0){
                data.obj[i].time=timeStemp(Number(data.obj[i].create_time),'yyyy-MM-dd').commonDate;
             }else{
                data.obj[i].time=timeStemp(Number(data.obj[i].finish_time),'yyyy-MM-dd').commonDate;
             }
        };
        
        //console.log(data.obj)
        
        vm.dutyData = vm.dutyData.concat(data.obj);
       
    };
        
})($);






