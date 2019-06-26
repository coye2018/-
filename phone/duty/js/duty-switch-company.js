var vm = new Vue({
    el: '#switch_company',
    data: {
        company: [{}],
        checked: -1
    },
    methods: {
        returnPickData: function(itm, idx){
            var com = {};
            com.name = itm.departname;
            com.deptid = itm.id;
            
            var str = JSON.stringify(com);
            appcan.locStorage.setVal('switchcompany', str);
            appcan.window.publish('duty-switch', str);
            
            this.checked = idx;
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
        loadDeptDuty();
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
    });
    
})($);

function loadDeptDuty(){
    var json = {
        path: serverPath+'schedule.do?focgetDutyDeparts',
        data: {}
    };
    
    ajaxRequest(json,function(data, e){
       if(e=="success"){
           deptHandle(data.obj);
       }else{
           layerToast('获取值班公司列表出错，请稍后重试。');
       }
    });
}

function deptHandle(obj){
    vm.company = [].concat(obj);
    //这个缓存的暂时去掉
    // var swc = appcan.locStorage.getVal('switchcompany');
    // if(isDefine(swc)){
        // var swcJson = JSON.parse(swc);
        // for(var i=0; i<vm.company.length; i++){
            // if(vm.company[i].departname==swcJson.name){
                // vm.checked = i;
                // break;
            // }
        // }
    // }
}
