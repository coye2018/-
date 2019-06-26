var vm = new Vue({
    el: '#alarm',
    data: {
        alarms: [
            {'text': '不提醒','value': '0'},
            {'text': '提前15分钟','value': '15'},
            {'text': '提前30分钟','value': '30'},
            {'text': '提前1小时','value': '60'},
            {'text': '提前2小时','value': '120'}
        ],
        checked: -1
    },
    methods: {
        pick: function(itm, idx){
            this.checked = idx;
            appcan.locStorage.setVal('task-send-alarm', JSON.stringify(itm));
            appcan.window.publish('task-send-alarm', JSON.stringify(itm));
            appcan.window.close(1);
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        var alarmStr = appcan.locStorage.getVal('task-send-alarm'),
            alarmJson = JSON.parse(alarmStr);
        
        if(isDefine(alarmStr)){
            $('.lists-box').each(function(i, n){
                if(n.dataset.value==alarmJson.value){
                    vm.checked = i;
                }
            });
        }
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
        appcan.window.publish('pick-send-click', 'pick-send-click');
    });
    
})($);