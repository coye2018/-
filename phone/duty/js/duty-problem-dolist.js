var vm = new Vue({
    el: '#dolist',
    data: {
        // recvdepartinfos:[
            // {
                // "id":171,
                // "info_id":156,
                // "recv_depart_id":"8a8a8bfc59977acf01599790be75000e",
                // "state":"0",
                // "receive_time":1513046623,
                // "update_time":1513046623,
                // "departname":"信息科技公司"
            // }
        // ]
        doyes:[]
    },
    methods: {
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
        var taskReceiver = JSON.parse(appcan.locStorage.getVal("taskReceiver"));
        if(isDefine(taskReceiver)){
            for(var i=0;i<taskReceiver.length;i++){
                taskReceiver[i].backup3=serverPath + taskReceiver[i].backup3;
                if(taskReceiver[i].state==3||taskReceiver[i].state==4){
                    taskReceiver[i].text='已于'+timeStemp(taskReceiver[i].update_time, 'MM-dd HH:mm').commonDate+'完成'
                }else{
                    taskReceiver[i].text=taskReceiver[i].state_text;
                }
                
            }
            vm.doyes=taskReceiver;
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
        appcan.window.publish('duty-problem-detail-click','duty-problem-detail-click');
    });
    
    $('.tab-pill-box').on('click', '.tab-pill-text', function(e){
        var that = $(this),
            idx = that.index(),
            box = $('.tab-box'),
            clsa = 'actives';
        
        that.addClass(clsa).siblings().removeClass(clsa);
        box.eq(idx).addClass(clsa).siblings().removeClass(clsa);
        $('body').scrollTop(0);
    });
    
})($);
