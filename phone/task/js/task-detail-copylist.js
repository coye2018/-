var vm = new Vue({
    el: '#copylist',
    data: {
        copy: []
    },
    methods: {
        headpicReplace: function(val){
            val.hashead = false;
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
        var copyTaskReciver = JSON.parse(appcan.locStorage.getVal("copyTaskReciver"));
        if(isDefine(copyTaskReciver)){
            for (var i=0; i <copyTaskReciver.length; i++) {
                copyTaskReciver[i].headtext = copyTaskReciver[i].realname.substr(-2,2);
                copyTaskReciver[i].headbgclass = getHeadClass(copyTaskReciver[i].user_id);
                if(!isDefine(copyTaskReciver[i].headImage)){
                    copyTaskReciver[i].hashead=false;
                }else{
                    copyTaskReciver[i].hashead=true;
                    copyTaskReciver[i].headurl=serverPath+copyTaskReciver[i].headImage;
                }
            }
        }
        vm.copy=copyTaskReciver;
        //ios300ms延时
        FastClick.attach(document.body);
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
        appcan.window.publish('task-detail-click','task-detail-click');
    });

    
})($);
