var platForm = appcan.locStorage.getVal("platForm");
var vm = new Vue({
    el: '#duty_four',
    data: {
        isNothing: false,
        nonet: false,
        dutyData: []
        // ishideBegin: true
    },
    mounted: function() {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    methods: {
        unclick: function(item,index) {
            // console.log(item.dutyDate)
            // 测试用的
            //appcan.locStorage.setVal("dutyDeptId","8a8a8bfc59977acf01599790be75000e");
            appcan.locStorage.setVal("dutyDeptId", appcan.locStorage.getVal("deptId"));
            appcan.locStorage.setVal("duty-four-summary-dutyDay", item.dutyDate.date);
            appcan.locStorage.setVal("dutyScore", item.avgScore*100);
            //Android
            if (platForm == "1") {
                appcan.window.open('duty-four-3','duty-four-3.html',2);
            } else {
                appcan.window.open({
                    name: 'duty-four-3',
                    dataType: 0,
                    data: 'duty-four-3.html',
                    aniId: 10,
                    type: 0
                });
            }
            if (item.isFinish == 0) {
                //可编辑
                appcan.locStorage.setVal("isCanEdit", true);
            }else{
                //不可编辑
                appcan.locStorage.setVal("isCanEdit", false);
            }
        },
        // openTable: function() {
            // //Android
            // if(platForm == "1"){
                // appcan.window.open("duty-four-table", "duty-four-table.html",2);
            // }else{
                // appcan.window.open({
                    // name: 'duty-four-table',
                    // dataType: 0,
                    // data: 'duty-four-table.html',
                    // aniId: 10,
                    // type: 0
                // });
            // }
        // },
        // beginPatrol: function() {
            // var rootID = appcan.locStorage.getVal("rootID");
            // if (rootID == "8a8a8bfc59977acf0159978d29db0002") {
               // var isDutyAccount = appcan.locStorage.getVal("isDutyAccount");
               // if(isDutyAccount != "1"){
                   // layerToast("您的帐号无权执行四必。");
                   // return false;
               // }else{
                    // var now = timeStemp(new Date().getTime(),"yyyy-MM-dd").date;
                    // console.log(now)
                    // appcan.locStorage.setVal("dutyDeptId", appcan.locStorage.getVal("deptId"));
                    // appcan.locStorage.setVal("dutyDeptTime", now);
                    // //开始巡检弹出框
                    // addConfirm({
                        // content: '是否开始巡检？',
                        // yes: function(i){
                            // var json = {
                                // path: serverPath + "focTrackInfoController.do?focAppDoAdd",
                                // data: {
                                    // deptID: appcan.locStorage.getVal("deptId"),
                                    // time: now,
                                    // inlet:0,
                                    // layer:true
                                // }
                            // };
                            // ajaxRequest(json, function(data, e) {
                                // console.log(JSON.stringify(data));
                                // if (e == "success") {
                                    // //删除巡查项的缓存数据、特殊情况的图片及内容缓存数据
                                    // appcan.locStorage.remove('duty-4-term');
                                    // appcan.locStorage.remove("dutySpecialImg");
                                    // appcan.locStorage.remove("dutySpecialContent");
                                    // appcan.locStorage.remove("duty4question");
                                    // appcan.locStorage.remove("duty4questionIdx");
                                    // //可编辑
                                    // appcan.locStorage.setVal("isCanEdit",true);
                                    // //Android
                                    // if (platForm == "1") {
                                        // appcan.window.open("duty-four-3", "duty-four-3.html", 2);
                                    // } else {
                                        // appcan.window.open({
                                            // name: 'duty-four-3',
                                            // dataType: 0,
                                            // data: 'duty-four-3.html',
                                            // aniId: 10,
                                            // type: 0
                                        // });
                                    // }
                                // }
                            // })
                            // layerRemove(i);
                        // },
                        // no: function (i) {
                            // layerRemove(i);
                        // }
                    // });
               // }
            // }
//             
        // }
    }
});

(function($) {
    // 第一次访问该页面显示教程
    // var isFirst = appcan.locStorage.getVal('isFirst-dutyFourList');
    // if(!isDefine(isFirst) || isFirst=='0'){
        // // animateShade();
    // };
    
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
                size : 20
            },
            callback: load4DutyDate
        }
    });
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(13);
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function() {
        // 页面返回重载数据
        appcan.window.subscribe("reloadDuty",function(msg){
            vm.dutyData = [];
            mescroll.resetUpScroll();
        });
        
        appcan.window.subscribe("refreshFourList",function(msg){
            vm.dutyData = [];
            mescroll.resetUpScroll();
        });
        //如果是ios设备，设置向右滑动关闭页面
        // uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            // isSupport: (platForm != "1")
        // }));
        // uexWindow.onSwipeRight = function(){
            // appcan.window.close(1);
        // };
        
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click", "option-click");
        appcan.window.subscribe("duty-four-click", function(msg){
            yesClick($('.clickable'));
        });
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
    // function animateShade(){
        // var act = 'actives';
//         
        // ModalHelper.afterOpen();
        // $('.shade').removeClass('shade-hide');
        // setTimeout(function(){
            // $('.du4-list-shade-1').addClass(act);
        // }, 200);
        // setTimeout(function(){
            // $('.du4-list-shade-2').addClass(act);
        // }, 1000);
        // setTimeout(function(){
            // $('.du4-list-shade-3').addClass(act);
        // }, 2000);
    // };
    
    function load4DutyDate(page) {
        var pageIndex = page.num,
            pageSize = page.size;
        if (pageIndex == 1) {
            vm.dutyData = [];
        };  
        var today = new Date().getDate();
        var json = {
            path: serverPath + "focTrackInfoController.do?focInfoList",
            data:{
                startPage: pageIndex-1,
                endPage: pageSize
            },
            layer: false
        };
        // console.log(json)
        ajaxRequest(json, function(data, e) {
            // console.log(JSON.stringify(data));
        
        //var data = {"attributes":null,"obj":[{"create_time":1517463666,"dutyDate":1517463678,"id":1071,"finish_time":1528188637,"isFinish":1},{"create_time":1514884450,"dutyDate":1514884455,"id":1070,"finish_time":1517827534,"isFinish":1},{"create_time":1513903167,"dutyDate":1513903216,"id":981,"finish_time":1514883553,"isFinish":0},{"create_time":1512433720,"dutyDate":1512433724,"id":781,"finish_time":1513904579,"isFinish":0},{"create_time":1512308644,"dutyDate":1512308647,"id":765,"finish_time":1512310260,"isFinish":0},{"create_time":1511919153,"dutyDate":1511919178,"id":729,"finish_time":1512309988,"isFinish":0},{"create_time":1509063618,"dutyDate":1509063630,"id":330,"finish_time":1511919145,"isFinish":0},{"create_time":1508977855,"dutyDate":1508977865,"id":316,"finish_time":1509063098,"isFinish":0},{"create_time":1508900325,"dutyDate":1508900334,"id":306,"finish_time":1508977853,"isFinish":0},{"create_time":1508804859,"dutyDate":1508804864,"id":287,"finish_time":1528363892,"isFinish":1}],"msg":"操作成功","success":true};
        //var e = "success";
        
            if (e == "success") {
                // console.log(data)
                mescroll.endSuccess(data.attributes.infoList.length);
                vm.nonet = false;
                // if(pageIndex == 1){
                   // // no data
                    // if (data.attributes.infoList.length == 0) {
                        // vm.isNothing = true;
                        // // vm.ishideBegin = false;
                        // mescroll.endErr();
                        // return;
                    // }
//                      
                    // var firstIsFinish = (data.attributes.infoList[0].isFinish == 0),
                        // noData = (data.attributes.infoList.length == 0),
                        // now = timeStemp(new Date().getTime(),'yyyy-MM-dd').date,
                        // dutTimes = timeStemp(Number(data.attributes.infoList[0].dutyDate),'yyyy-MM-dd').date,
                        // isToday = (now == dutTimes);
                    // if(!noData){
                        // vm.isNothing = false;
                    // }
                    // // 显示四个必按钮
                    // if ((firstIsFinish == true) || (isToday == true)) {
                        // vm.ishideBegin = true;
                        // $('#ScrollContent').addClass('nopadding-b');
                    // }else{
                        // vm.ishideBegin = false;
                    // }
                // }
                if (data.attributes.infoList.length > 0) {
                    setPageData(data, pageIndex, pageSize);
                    
                }
            } else {
               vm.nonet = true;
               mescroll.endErr();
            }
        });
    }
    
    function setPageData(data, pageIndex, pageSize) {
        for (var i = 0; i < data.attributes.infoList.length; i++) {
            var thisDutyDate = timeStemp(Number(data.attributes.infoList[i].unixTimestamp), 'yyyy年MM月dd日');
            data.attributes.infoList[i].dutyDate = timeStemp(Number(data.attributes.infoList[i].unixTimestamp), 'yyyy-MM-dd');
            data.attributes.infoList[i].dutyDateTime = thisDutyDate.date + ' ' + thisDutyDate.weekDay;
             
            if(isDefine(data.attributes.infoList[i].infoType)){
                 vm.dutyData = vm.dutyData.concat(data.attributes.infoList[i]);
            }
           
        }
        if (vm.dutyData.length == 0) {
            vm.isNothing = true;
            // vm.ishideBegin = false;
            mescroll.endErr();
            return;
        }
        // if(data.attributes.isDate == 0){
            // vm.ishideBegin = false;
        // }
        // else{
            // vm.ishideBegin = true;
        // }
        Vue.nextTick(function() {
            
            for (var u = 0; u < vm.dutyData.length; u++) {
                var nomalColor="bg-main";
                var realIndex = (pageIndex - 1) * pageSize + u;
                if(vm.dutyData[realIndex].infoType!=1){
                    nomalColor = "bg-sub";
                }
                $('#list_' + realIndex).prog({
                    total: 100,
                    normal: vm.dutyData[realIndex].avgScore*100,
                    normalBg: nomalColor,
                    abnormal: 0,
                    //abnormalBg: 'bg-sub',
                    hastext: false
                });
            }
        })
    }
})($);
