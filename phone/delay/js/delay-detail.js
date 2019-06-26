var platForm = appcan.locStorage.getVal("platForm");
var delayHistoryID = appcan.locStorage.getVal('delayHistoryID');

var vm = new Vue({
    el: '#delay-detail',
    data: {
        id: null,
        content: '',
        level: null,
        create_time: null,
        dynamicsInfo: [],
        appReceivers: {
            receivednum: 0,
            totalnum: 0
        },
        messageReceivers: {
            receivednum: 0,
            totalnum: 0
        }
    },
    methods: {
        msgList: function(type) {
            // type: 1 应用内, 2应用外
            appcan.locStorage.setVal("delayMsgListType", type);
            if(platForm == "1"){
                appcan.window.open('delay-getmsg-status', 'delay-getmsg-status.html', 2);
            }else{
                appcan.window.open({
                    name:'delay-getmsg-status',
                    dataType:0,
                    data:'delay-getmsg-status.html',
                    aniId:0,
                    type:1024
                });  
            }
        }
    },
    filters: {
        levelFilter: function (level) {
          var text = '--';
          switch (level) {
              case 1: 
                text = '红色';
                break;
              case 2: 
                text = '橙色';
                break;
              case 3: 
                text = '黄色';
                break;
              case 4: 
                text = '蓝色';
                break;
          }
          return text;
        },
        formatDate: function (value, type) {
            if (value == null) {
                return '--:--';
            } else {
                if (type == 'title') {
                    return timeStemp(value, 'MM-dd HH:mm').commonDate;
                } else if (type == 'list') {
                    return timeStemp(value, 'MM-dd HH:mm').date;
                }
            }
        }
    },
    computed: {
        sendAppMsgPercent: function () {
            var self = this,
                receivednum = self.appReceivers.receivednum,
                totalnum = self.appReceivers.totalnum,
                percent = 0;
            if (receivednum && totalnum) {
                var percent = (receivednum / totalnum) * 100;
            }
            return percent;
        },
        sendSmsMsgPercent: function () {
            var self = this,
                receivednum = self.messageReceivers.receivednum,
                totalnum = self.messageReceivers.totalnum,
                percent = 0;
            if (receivednum && totalnum) {
                var percent = (receivednum / totalnum) * 100;
            }
            return percent;
        },
        levelIcon: function () {
            var self = this;
            var icon = '';
            switch (self.level) {
                case 1: 
                icon = 'red';
                break;
              case 2: 
                icon = 'orange';
                break;
              case 3: 
                icon = 'yellow';
                break;
              case 4: 
                icon = 'blue';
                break;
            }
            return icon;
        }
    }
});

(function($) {
    
    
    appcan.ready(function() {
        
        //初始化数据           
        initData();
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        appcan.button("#nav-left", "btn-act",function() {
            appcan.window.close(1);
        });
        
        appcan.button("#nav-right", "btn-act",function() {});
        
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

function initData () {
    var json = {
        path:serverPath+'focDelayController.do?focGetDelayInfo',
        data: {
            id: delayHistoryID
        }
    };
    ajaxRequest(json,function(data,e){
        console.log(data);
        if(e=="success"){
            var result = data.obj;
            vm.id = result.id;
            vm.level = result.level;
            vm.content = result.content;
            vm.create_time = result.create_time;
            vm.dynamicsInfo = result.dynamicsInfo;
            vm.appReceivers = result.appReceivers;
            vm.messageReceivers = result.messageReceivers;
        }
    });          
};
