var platForm = appcan.locStorage.getVal("platForm");
var delayID = appcan.locStorage.getVal('delayID');
var delayMsgListType = appcan.locStorage.getVal('delayMsgListType');
console.info(delayID)
console.info(delayMsgListType)

var vm = new Vue({
    el: '#Page',
    data: {
        toggleText: [{
            type: 1,
            text: '未接收'
        }, {
            type: 2,
            text: '已接收'
        }],
        type: 1,
        noReceivedInfo: [],
        receivedInfo: [],
        nonet: false        
    },
    computed: {
        dataList: function () {
            var self = this;
            if (self.type == 1) {
                return self.noReceivedInfo
            } else {
                return self.receivedInfo
            }
        }
    }
});

(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.locStorage.remove('delayMsgListType');
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {});
    

    appcan.ready(function() {
        
        getContactsInfo();
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platForm == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.locStorage.remove('delayMsgListType');
            appcan.window.close(1);
        };
        
    });
    
    function getContactsInfo () {
        var json={
            path:serverPath+'focDelayController.do?focGetReceiversInfo',
            data:{
                id: delayID,
                type: delayMsgListType
            },
            layer: false,
            layerErr: false
        };
        ajaxRequest(json,function(data,e){
            console.log(data);
            if(e=="success"){
                vm.noReceivedInfo = data.obj.noReceivedInfo;
                vm.noReceivedInfo = data.obj.receivedInfo;
            } else {
                vm.nonet = true;
            }
        });
    };
    
})($);
