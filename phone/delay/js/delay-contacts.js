var platForm = appcan.locStorage.getVal("platForm");
var delayContactsType = appcan.locStorage.getVal('delayContactsType');

var vm = new Vue({
    el: '#delay-contacts',
    data: {
        type: isDefine(delayContactsType) ? delayContactsType * 1 : null,
        lists: [],
        nonetwork: false,
        nothing: false
    },
    filters: {
        title: function (type) {
            var valu = "--";
            switch (type) {
                case 1:
                    valu = "应用内通知人"; 
                    break;
                case 2: 
                    valu = "短信通知人";
                    break;
            };
            return valu;
        }
    }
});

(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function() {
        
        if (vm.type != null) {
            getContactsInfo();
        }
        
        appcan.button("#nav-left", "btn-act",function() {
            closePage();
        });
        
        appcan.button("#nav-right", "btn-act",function() {});
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        // 安卓返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                 closePage();
            }
        };
        
        //如果是ios设备，设置向右滑动关闭页面
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platForm == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            closePage();
        };
        
        
    });
    
    function closePage() {
        appcan.locStorage.remove('delayContactsType');
        appcan.window.close(1);
    }
    
    function getContactsInfo () {
        var json={
            path:serverPath+'focDelayController.do?focGetAllPeoplesInfo',
            data:{},
            layerErr: false
        };
        ajaxRequest(json,function(data,e){
            console.log(data);
            if(e=="success"){
                var result = data.obj;
                if (vm.type == 1) {
                    if (result.appPeoples.length == 0) {
                        vm.nothing = true;
                    } else {
                        vm.lists = result.appPeoples;
                    }
                } else if (vm.type == 2) {
                    if (result.messagePeoples.length == 0) {
                        vm.nothing = true;
                    } else {
                        vm.lists = result.messagePeoples;
                    }
                }
            } else {
                vm.nonet = true;
            }
        });
    };
    
})($);
