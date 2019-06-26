var platForm = appcan.locStorage.getVal("platForm");

var vm = new Vue({
    el: '#searchFlight',
    data: {
        text:'',
        deadline: {
            time:''
        }
    },
    methods: {}
});

(function($) {
    appcan.ready(function(){
        appcan.window.publish("option-click","option-click");
        appcan.window.subscribe('task-send-submit', function(msg){
               if(vm.text==''){
                layerToast('请详细描述原因。');
                return false;
            }else if(vm.text.length>1000){
                layerToast('不能超过1000字。');
                return false;
            }else{
                appcan.window.publish('task-send-shade', 'show');
                addConfirm({
                        content: '确定审核不通过吗？',
                        yes: function(i) {
                            layerRemove(i);
                            var json = {
                                path: serverPath + 'focDutyFeedbackInfo.do?focExamineInfo',
                                data: {
                                    infoId: appcan.locStorage.getVal("dataId"),
                                    content:filterBrow(unescape(vm.text)),
                                    examineState:0
                                }
                            }
                            ajaxRequest(json, function(data, e) {
                                if (e == "success") {
                                    appcan.window.publish("reloadTaskList", "reloadTaskList");
                                    layerToast('审核不通过成功！');
                                    var closeArr = ['duty-problem-detail', 'duty-problem-noauditpage'];
                                    closeArr.forEach(function(name){
                                        appcan.window.evaluateScript({
                                            name:name,
                                            scriptContent:'appcan.window.close(-1);'
                                        });
                                    });
                                }
                            });
                        },
                        end:function(){
                            appcan.window.publish('task-send-shade', 'hide');
                        }
                });  
            }
             
            
        })
        
        
        
    });
    appcan.button("#nav-left", "btn-act",
        function() {
            appcan.window.close(1);
        });
    appcan.button("#nav-right", "btn-act",
        function() {});
        
    var platFormC=appcan.locStorage.getVal("platForm");
    var isSupport=true;
    if(platFormC=="1"){
        isSupport=false;
    }
    var paramClose = {
        isSupport:isSupport
    };
    uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
    uexWindow.onSwipeRight = function(){
        appcan.window.close(1);
    }   
        
    $('.tab-pill-box').on('click', '.tab-pill-text', function(e){
        var that = $(this),
            idx = that.index(),
            clsa = 'actives';
        that.addClass(clsa).siblings().removeClass(clsa);
        $(".items").hide().eq(idx).show();
    });
})($)


