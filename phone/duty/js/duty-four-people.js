var vm = new Vue({
    el: '#duty_four_people',
    data: {
        mustPerson: [
            {
                id: '123dk344k5',
                person: '本单位正班',
                isSee: 2
            },{
                id: '123dk344k6',
                person: '本单位副班',
                isSee: 1
            }
        ],
        isCanEdit:false
    },
    methods: {
        changeStatus: function(itm){
            if(vm.isCanEdit=='true'){
                itm.isSee = itm.isSee==2?1:2;
                var json={
                    path:serverPath+"focFourMustController.do?focUpdateMustSeePerson",
                    data:{
                        personID:itm.id,
                        dutyDate:appcan.locStorage.getVal("dutyDeptTime"),
                        isSee:itm.isSee
                    },
                    layer:false
                }
                ajaxRequest(json,function(data,e){
                    if(e=="success"){
                        
                    }else{
                        
                    }
                });
            }
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.publish('duty-four-person', JSON.stringify(vm.mustPerson));
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    //读取duty-four.html传来的数据
    var this_prsn = appcan.locStorage.getVal('duty-4-person');
    if(isDefine(this_prsn)){
        vm.mustPerson = [].concat(JSON.parse(this_prsn));
    }
    
    appcan.ready(function() {
        vm.isCanEdit=appcan.locStorage.getVal("isCanEdit");
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                 appcan.window.publish('duty-four-person', JSON.stringify(vm.mustPerson));
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
             appcan.window.publish('duty-four-person', JSON.stringify(vm.mustPerson));
             appcan.window.close(1);
        }
    });
    
})($);