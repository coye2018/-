var platForm = appcan.locStorage.getVal("platForm");

var vm = new Vue({
    el: '#delay',
    data: { 
        id: null,     // 延航id
        content: '',  // 响应内容
        level: null,  // 响应等级
        create_time: null,  // 响应时间
        dynamicsInfo: [],   // 升降级信息
        appReceivers: {     // 应用内接收百分比
            receivednum: 0,
            totalnum: 0
        },
        messageReceivers: {  // 应用外接收百分比
            receivednum: 0,
            totalnum: 0
        },
        nonet: false
    },
    methods: {
        startDelay: function () {
            appcan.locStorage.setVal('changeDelayType', 0);
            // 启动延航
            if(platForm == "1"){
                appcan.window.open('delay-start', 'delay-start.html', 2);
            }else{
                appcan.window.open({
                    name:'delay-start',
                    dataType:0,
                    data:'delay-start.html',
                    aniId:0,
                    type:1024
                });
            }
        },
        msgList: function(type) {
            // type: 1 应用内, 2应用外 接收人列表
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
        },
        changeDelayStatus: function (val) {
            // val:  1 升级预警操作        2 降级预警操作    
            appcan.locStorage.setVal('changeDelayType', val);
            if(platForm == "1"){
                appcan.window.open('delay-start', 'delay-start.html', 2);
            }else{
                appcan.window.open({
                    name:'delay-start',
                    dataType:0,
                    data:'delay-start.html',
                    aniId:0,
                    type:1024
                });  
            }
        },
        cancelDelay: function () {
            // 取消预警
            addConfirm({
                content: '是否确认取消预警？',
                yes: function(i){
                    layerRemove(i);
                    
                    ajaxRequest({
                        path:serverPath+'focDelayController.do?focIsUnfinishDelay',
                        data:{
                            id: vm.id
                        },
                        layer: true,
                        layerErr: true
                    },function(data,e){
                        console.log(data);
                        if(e=="success"){
                            window.location.reload();
                        }
                    });
                }
            });
        }
    },
    filters: {
        levelFilter: function (level) {
          // 预警等级颜色文字
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
            // 时间转换, 区分格式
            if (!isDefine(value)) {
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
            // 应用内消息接受百分比
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
            // 应用外消息接受百分比
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
            // 预警等级图标显示
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


var layerIndex = layerLoading();

(function($) {

    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {
        if(platForm == "1"){
            appcan.window.open('delay-history', 'delay-history.html', 2);
        }else{
            appcan.window.open({
                name:'delay-history',
                dataType:0,
                data:'delay-history.html',
                aniId:0,
                type:1024
            });  
        }  
    });
    
    appcan.ready(function() {
        
        // 延航是否启动中
        checkIsStart(); 
       
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
       
        //如果是ios设备，设置向右滑动关闭页面
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platForm == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
    });
    
    // 延航启动中的数据
    function loadData (delayId) {
        ajaxRequest({
            path:serverPath+'focDelayController.do?focGetDelayInfo',
            data: {
                id: delayId
            },
            layer: false,
            layerErr: false
        },function(data,e){
            console.log(data);
            layerRemove(layerIndex);
            
            if(e=="success"){
                var result = data.obj;
                // id
                vm.id = result.id;
                // 等级
                vm.level = result.level;
                // 通知内容
                vm.content = result.content;
                // 启动时间
                vm.create_time = result.create_time;
                // 响应级别变更列表
                vm.dynamicsInfo = result.dynamicsInfo;
                // app 通知人数[]
                vm.appReceivers = result.appReceivers;
                // 短信通知人数[]
                vm.messageReceivers = result.messageReceivers;
                
                // 保存id及等级 - 后续页面使用
                appcan.locStorage.setVal('delayID', vm.id);
                appcan.locStorage.setVal('delayCurrentLevel', vm.level);
                
                $(".js-delay-detail").removeClass('hide');
            } else {
                vm.nonet = true;
            }
        });   
    };
      
    // 延航是否启动中
    function checkIsStart () {
        var json={
            path:serverPath+'focDelayController.do?focIsUnfinishDelay',
            data:{},
            layer: false,
            layerErr: false
        };
        ajaxRequest(json,function(data,e){
            console.log(data);
            if(e=="success"){
                if (isDefine(data.obj)) {
                    loadData(data.obj.id);
                } else {
                    $('.js-no-delay').removeClass('hide');
                    layerRemove(layerIndex);
                }
            } else {
                vm.nonet = true;
                layerRemove(layerIndex);
            }
        });
    };
})($);
