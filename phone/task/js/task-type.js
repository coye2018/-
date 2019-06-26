var vm = new Vue({
    el: '#taskType',
    data: {
        typeData:[],
        checked: -1
    },
    methods: {
        pick: function(itm, idx){
            this.checked = idx;
            appcan.locStorage.setVal('task-type', JSON.stringify(itm));
            appcan.window.publish('task-type', JSON.stringify(itm));
            appcan.window.close(1);
        }
    }
});


function init(){
    
    var json={
        path: serverPath +'focTaskController.do?focgetTaskType',
        data:{
            typegroupcode:"taskType"
        },
        layer: false,
       	layerErr: false
    };
    ajaxRequest(json, function (result, e){
    	// console.log(JSON.stringify(result));
        if (e == 'success'){
           vm.typeData= vm.typeData.concat(result.obj);
        }
    });
}

(function($) {
	
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
    	init();
        var typeStr = appcan.locStorage.getVal('task-type'),
            typeJson = JSON.parse(typeStr);
        
        if(isDefine(typeStr)){
            $('.lists-box').each(function(i, n){
                if(n.dataset.value==typeJson.value){
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