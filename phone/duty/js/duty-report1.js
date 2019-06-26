// 动画方式
var aniId=0;
var platForm=appcan.locStorage.getVal("platForm");
var isDutyAccount=appcan.locStorage.getVal("isDutyAccount");

var vm = new Vue({
    el: '#duty_report',
    data: {
        isDutyAccount: (isDutyAccount != "1") ? false : true,
        draft: false,
        newDutyBadge: 0
    },
    methods: {
    	list: function () {
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-report1-list', 'duty-report1-list.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-report1-list',
                    dataType:0,
                    data:'duty-report1-list.html',
                    aniId:aniId,
                    type:1024
                });  
            }
    	},
    	overall: function () {
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-report1-overall-list', 'duty-report1-overall-list.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-report1-overall-list',
                    dataType:0,
                    data:'duty-report1-overall-list.html',
                    aniId:aniId,
                    type:1024
                });  
            }
    	},
    	single: function () {
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-report1-single-list', 'duty-report1-single-list.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-report1-single-list',
                    dataType:0,
                    data:'duty-report1-single-list.html',
                    aniId:aniId,
                    type:1024
                });  
            }
    	},
    	add: function () {
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-report1-add', 'duty-report1-add.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-report1-add',
                    dataType:0,
                    data:'duty-report1-add.html',
                    aniId:aniId,
                    type:1024
                });  
            }
    	}
    }
});

;(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.ready(function() {
        
        FastClick.attach(document.body);
        
        // 新消息
        vm.newDutyBadge = appcan.locStorage.getVal('optionFunctionNum') * 1;
        
        appcan.window.subscribe('haveReadDutyReportNewMessages', function () {
            vm.newDutyBadge = 0;
        });
        
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        appcan.window.subscribe('duty-report-draft', function(val){
            vm.draft = (val == 'hide') ? false : true;
        });
        
        var dutyTextVal = appcan.locStorage.getVal('dutyTextVal');
        if (isDefine(dutyTextVal)) {
           vm.draft = true;
        };
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
    });
    
    
})($);

