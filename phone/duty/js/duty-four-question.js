var vm = new Vue({
    el: '#duty_four_question',
    data: {
        ques: [
            {
                id: '00001',
                question: '昨天的故障处理、设备运行和及保养情况，重点关注故障遗留情况',
                answerMoban: '我觉得ok',
                answer: ''
            }
        ],
        isCanEdit: false
    },
    methods: {
        jumptoForm: function(itm, idx){
            appcan.locStorage.setVal('duty4question', JSON.stringify(itm));
            appcan.locStorage.setVal('duty4questionIdx', idx);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('duty-four-question-form', 'duty-four-question-form.html', 2);
            }else{
               appcan.window.open({
                    name:'duty-four-question-form',
                    dataType:0,
                    data:'duty-four-question-form.html',
                    aniId:aniId,
                    type:1024
                }); 
            }
            
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.publish('duty-four-question', JSON.stringify(vm.ques));
        handleDutyfour();
        appcan.locStorage.remove('duty4question');
        appcan.locStorage.remove('duty4questionIdx');
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    //读取duty-four.html传来的数据
    var this_ques = appcan.locStorage.getVal('duty-4-question');
    if(isDefine(this_ques)){
        vm.ques = [].concat(JSON.parse(this_ques));
    }
    
    appcan.ready(function() {
        
        vm.isCanEdit=appcan.locStorage.getVal("isCanEdit");
        
        //接收填写的答案, 改变该问题是否已回答的状态
        appcan.window.subscribe('duty-four-question-form', function(msg){
            var d4q = JSON.parse(msg),
                d4qIdx = appcan.locStorage.getVal('duty4questionIdx');
            
            Vue.set(vm.ques[d4qIdx], 'answer', d4q.answer);
            Vue.set(vm.ques[d4qIdx], 'status', true);
        });
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.window.publish('duty-four-question', JSON.stringify(vm.ques));
                handleDutyfour()
                appcan.locStorage.remove('duty4question');
                appcan.locStorage.remove('duty4questionIdx');
                appcan.window.close(1);
            }
        };
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
             appcan.window.publish('duty-four-question', JSON.stringify(vm.ques));
             appcan.locStorage.remove('duty4question');
             appcan.locStorage.remove('duty4questionIdx');
             appcan.window.close(1);
        }
    });
    
})($);
function handleDate(msg){
    var d4q = msg,
    d4qIdx = appcan.locStorage.getVal('duty4questionIdx');
    Vue.set(vm.ques[d4qIdx], 'answer', d4q.answer);
    Vue.set(vm.ques[d4qIdx], 'status', true);
}
function handleDutyfour(){
    appcan.window.evaluateScript({
        name:"duty-four",
        scriptContent:"handleDateDutyfour("+JSON.stringify(vm.ques)+")"
    });
}
