var vm = new Vue({
    el: '#Page',
    data: {
        banci: ['班次'],
        banciindex: 0,
        banciid:31,
        shade: false
    },
    methods: {
        changeBan: function (i,id) {
            appcan.window.publish('duty-switch-table-toggle', JSON.stringify({banciindex:i,banciid:id}));
        },
        submitBtn: function () {
            appcan.window.publish('duty-switch-submit-btn');
        }
    }
});  

function createPopover () {
    var titleHeight = parseInt($('#Header').height()),
        footerHeight = parseInt($('#Footer').height()),
        pageHeight = parseInt($('#Page').height()),
        pageWidth = parseInt($('#Page').width());
    
    appcan.window.openPopover({
        name: 'duty-switch-page',
        url: 'duty-switch-page.html',
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight-titleHeight-footerHeight
    });
};

(function($) {
    appcan.ready(function() {
        createPopover();
        
        appcan.window.subscribe('duty-switch-banci', function (banci) {
            vm.banci = JSON.parse(banci);
        });
        
        appcan.window.subscribe('duty-switch-banciindex', function (banciindex) {
            vm.banciindex = JSON.parse(banciindex);
        });
        appcan.window.subscribe('duty-switch-banciid', function (banciid) {
            vm.banciid = JSON.parse(banciid);
        });
        appcan.window.subscribe('duty-switch-shade', function (type) {
            vm.shade = (type == 'hide' ? false : true);
        });
    
        //换班指引动画
        appcan.button("#nav-ins", "btn-act", function() {
            vm.shade = true;
            appcan.locStorage.setVal('isFirst-dutySwitch', '0');
            appcan.window.publish('duty-switch-ani', '1');
        });
        
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
        
        window.onorientationchange = window.onresize = function(){
            var titleHeight = parseInt($('#Header').height()),
                footerHeight = parseInt($('#Footer').height()),
                pageHeight = parseInt($('#Page').height()),
                pageWidth = parseInt($('#Page').width());
            
            //重置指定弹出窗口的高度
            appcan.window.resizePopover({
                name: 'duty-switch-page',
                url: 'duty-switch-page.html',
                left: 0,
                top: titleHeight,
                width: pageWidth,
                height: pageHeight-titleHeight-footerHeight
            });
        };
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.locStorage.remove('switchcompany'); //删去之前选择的公司数据
                appcan.locStorage.remove('singleSwitchIndex');
                appcan.locStorage.remove('singleSwitchId');
                appcan.locStorage.setVal('isFirst-dutySwitch', '1');
                appcan.window.close(1);
            }
        };
        
    }); 
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.locStorage.remove('switchcompany'); //删去之前选择的公司数据
        appcan.locStorage.remove('singleSwitchIndex');
        appcan.locStorage.remove('singleSwitchId');
        appcan.window.close(13);
    });
    
    //换班历史列表
    appcan.button("#nav-history", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('duty-switch-history', 'duty-switch-history.html', 2);
        }else{
            appcan.window.open({
                name:'duty-switch-history',
                dataType:0,
                data:'duty-switch-history.html',
                aniId:aniId,
                type:1024
            });  
        }
    });
    
})($);
