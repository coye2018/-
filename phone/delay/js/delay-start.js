// 0: ios ;  1: android 
var platForm = appcan.locStorage.getVal("platForm");

// 当前延航等级
var delayCurrentLevel = appcan.locStorage.getVal("delayCurrentLevel");
delayCurrentLevel = isDefine(delayCurrentLevel) ? (delayCurrentLevel * 1) : 4;

// 启动类型:   0 启动延航      1 升级延航     2 降级延航
var delayChangeType = appcan.locStorage.getVal("changeDelayType") * 1;
var startAjaxUrl = '';
switch (delayChangeType) {
    case 1: 
       startAjaxUrl = 'focDelayController.do?focUpgrade';
       break;   
    case 2: 
       startAjaxUrl = 'focDelayController.do?focDemotion';
       break; 
    case 0: 
       startAjaxUrl = 'focDelayController.do?focStartDelay';
       break;     
};

var startTitle = '';
switch (delayChangeType) {
    case 0: 
        startTitle = '延航预警';
        break;
    case 1: 
        startTitle = '升级预警';
        break;
    case 2: 
        startTitle = '降级预警';
        break;
};

var vm = new Vue({
    el: '#delay-start',
    data: {
        title: startTitle,
        level: delayCurrentLevel,
        delayBtn: [{
            val: 1,
            text: '红色',
            color: 'fc-warn-red-b'
        },{
            val: 2,
            text: '橙色',
            color: 'fc-warn-orange-b'
        },{
            val: 3,
            text: '黄色',
            color: 'fc-warn-yellow-b'
        },{
            val: 4,
            text: '蓝色',
            color: 'fc-warn-blue-b'
        }],
        content: '',
        isSend: true
    },
    mounted: function () {
        var self = this;
        if (delayChangeType != 0) {
            if (delayChangeType == 1) {
                // 升级操作
                self.delayBtn.splice(self.level, 100);
            } else if (delayChangeType == 2) {
                // 降级操作  (减一包含当前类目)
                self.delayBtn.splice(0, self.level - 1);
            }
        };
        self.delayBtn.reverse();
    },
    methods: {
         sendMsg: function sendMsg () {
            // 是否发送短信
            var self = this;
            self.isSend = self.isSend ? false : true;
         },
         contactsList: function (type) {
               // type: 1 应用内通知人, 2短信通知人列表
               appcan.locStorage.setVal('delayContactsType', type);
               if(platForm == "1"){
                    appcan.window.open('delay-contacts', 'delay-contacts.html', 2);
                }else{
                    appcan.window.open({
                        name:'delay-contacts',
                        dataType:0,
                        data:'delay-contacts.html',
                        aniId:0,
                        type:1024
                    });  
                }
         },
         startDelay: function () {
            var self = this; 
            addConfirm({
                content: '是否确认启动预警',
                yes: function(index){
                    layerRemove(index);             
                    self.sendData();
                }
            });
         },
         sendData: function () {
             var self = this;
             var json = {
                path: startAjaxUrl,
                data: {
                    level:  self.level,
                    content: self.content,
                    isSend: (self.isSend == true) ? 1 : 0   // 0不发送1发送
                }
             };
             
            console.log(json)
            ajaxRequest(json,function(data,e){
                console.log(data);
                if(e=="success"){
                   if(platForm == "1"){
                        appcan.window.open('delay', 'delay.html', 2);
                    }else{
                        appcan.window.open({
                            name:'delay',
                            dataType:0,
                            data:'delay.html',
                            aniId:0,
                            type:1024
                        });  
                    }
                }
            });
         }
    },
    filters: {
        delayLevelTitle: function (type) {
            var text = '';
            switch (type) {
                case 0: 
                    text = '延航预警';
                    break;
                case 1: 
                    text = '升级预警';
                    break;
                case 2: 
                    text = '降级预警';
                    break;
            };
            return text;
        }
    }
});

(function($) {
    
    // 返回上一级
    appcan.button("#nav-left", "btn-act", function() {
        closePage();
    });

    appcan.ready(function() {
        
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
        appcan.locStorage.remove("delayCurrentLevel");
        appcan.window.close(1);
    };
    
})($);
