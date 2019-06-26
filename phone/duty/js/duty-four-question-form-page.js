var vm = new Vue({
    el: '#Page',
    data: {
        questions: {
            id: '',
            question: '',
            templateAnswer: '',
            answer: ''
        },
        questionIndex: 1,
        isCanEdit:false
    },
    methods: {
    }
});

(function($) {

    var d4q = appcan.locStorage.getVal('duty4question');
    var d4qIndex = appcan.locStorage.getVal('duty4questionIdx');
    if(isDefine(d4q)){
        vm.questions = $.extend({}, JSON.parse(d4q));
        vm.questionIndex = parseInt(d4qIndex)+1;
        
        //console.log(vm.questions)
        //console.log(vm.questions.templateAnswer)
        
        appcan.locStorage.setVal('mobandaan', vm.questions.templateAnswer);
        if(!isDefine(vm.questions.answer)){
            vm.questions.answer = appcan.locStorage.getVal('mobandaan');
        }
        
    }
    
    appcan.ready(function() {
        
        vm.isCanEdit=appcan.locStorage.getVal("isCanEdit");
      
        appcan.window.subscribe('duty-four-question-form-page-submit', function () {
            saveData();
        });
      
    });
    
})($);

function saveData(){
    if(vm.isCanEdit=="true"){
            if(vm.questions.answer.trim() == ''){
                layerToast('请回答该必问问题。');
                return false;
            }else{
                appcan.window.publish('duty-four-question-form-shade', 'show');
                var index = layerLoading();
                setTimeout(function(){
                   
                    layerRemove(index);
                    //这里写ajax提交数据
                    var json={
                        path:serverPath+"focFourMustController.do?focUpdateMustAskQuestion",
                        data:{
                            questionID:vm.questions.id,
                            dutyDate:appcan.locStorage.getVal("dutyDeptTime"),
                            answer:vm.questions.answer
                        },
                        layer:false
                    }
                    ajaxRequest(json,function(data,e){
                        appcan.window.publish('duty-four-question-form-shade', 'hide');
                        if(e=="success"){
                            layerToast("保存成功!");
                            //appcan.window.publish('duty-four-question-form', JSON.stringify(vm.questions));
                            var platForm=appcan.locStorage.getVal("platForm");
                            if(platForm=="1"){
                                appcan.window.evaluateScript({
                                    name:"duty-four-question",
                                    scriptContent:"handleDate("+JSON.stringify(vm.questions)+")"
                                });
                                 appcan.window.publish('duty-four-question-form-close',JSON.stringify(vm.questions));
                            }else{
                                appcan.window.publish('duty-four-question-form-close',JSON.stringify(vm.questions));
                            }
                            
                        }else{
                            layerToast("保存失败!"); 
                        }
                    })
                    
                }, 1000);
                
            }
        }
    
    
}
