 var platForm = appcan.locStorage.getVal("platForm");

 var vm = new Vue({
    el: '#accpet',
    data: {
        deadline: {
            time: ''
        },
        tasktext: ''
    },
    methods: {
        submit: function(){
            appcan.window.publish('duty-problem-acceptance-shade', 'show');
            
            addConfirm({
                content: '确定接受问题吗？',
                yes: function(i) {
                    layerRemove(i);
                    
                    var stNow = timeStemp(new Date().toLocaleDateString(),'yyyy-MM-dd').dateTimeSecond;
                    var timer = timeStemp(vm.deadline.time,'yyyy-MM-dd').dateTimeSecond;
                    
                    if(vm.deadline.time==''){
                         appcan.window.publish('duty-problem-acceptance-shade', 'hide');
                         
                         layerToast('请选择时间', 3);
                         return false;
                    }else if(parseInt(timer) < parseInt(stNow)){
                         appcan.window.publish('duty-problem-acceptance-shade', 'hide');
                         
                         layerToast('预计完成时间不能早于今天', 3);
                         return false;
                    }
                    
                    var json = {
                        path: serverPath + 'focDutyFeedbackInfo.do?focConfirmInfo',
                        data: {
                            infoId: appcan.locStorage.getVal("dataId"),
                            remark: filterBrow(unescape(vm.tasktext)),
                            preFinishtime: timer
                        }
                    }
                    ajaxRequest(json, function(data, e) {
                        
                        appcan.window.publish('duty-problem-acceptance-shade', 'hide');
                        
                        if (e == "success") {
                            appcan.window.publish("reloadTaskList", "reloadTaskList");
                            layerToast('接收成功！');
                            var closeArr = ['duty-problem-detail', 'duty-problem-acceptance'];
                                closeArr.forEach(function(name){
                                    appcan.window.evaluateScript({
                                        name:name,
                                        scriptContent:'appcan.window.close(-1);'
                                    });
                                });
                           
                        }
                    });
                },
                no: function () {
                    appcan.window.publish('duty-problem-acceptance-shade', 'hide');
                }
            });    
        }
    }
});

;(function($) {
     
        appcan.ready(function(){
            
           
        });
        
	 	appcan.button("#nav-left", "btn-act", function() {
	        appcan.window.close(1);
	    });
	    
	    appcan.button("#nav-right", "btn-act", function() {});
	    
        //选择时间         
        pickTime();
        
})($);

function pickTime(){
     //时间
    var now = new Date(),
        cY   = now.getFullYear(),
        cM   = parseInt(now.getMonth()+1),
        cD   = (parseInt(now.getDate()) < 10) ? '0'+now.getDate() : now.getDate();
        
    // 获取当前时间  yyyy-mm-dd
    vm.deadline.time = cY +'-'+ cM +'-'+ cD;
    
    var instance = mobiscroll.date('#picktime', {
        lang: 'zh',
        theme:'ios',
        display: 'bottom',
        headerText: '日期选择',
        minWidth: 130,
        dateFormat: 'yy-mm-dd', 
        showLabel: true,
        onInit: function (evtObj, obj) {
        },
        onBeforeShow: function (evtObj, obj) {
        },
        onSet: function (evtObj, obj) {
            // 选择后的时间
            vm.deadline.time = evtObj.valueText;
        }
    });
}

