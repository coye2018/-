var vm = new Vue({
    el: '#duty_four_term',
    data: {
        checkItem: [
            {id: '123dk344k5',item: '时钟',isCheck: 0}
        ]
    },
    methods: {
        changeStatus: function(itm, flg){
            var isCanEdit=appcan.locStorage.getVal("isCanEdit");
            if(isCanEdit=="true"){
            //console.log(JSON.stringify(itm))
            itm.isCheck = flg;
            var json={
                path:serverPath+"focFourMustController.do?focUpdateMustCheckItem",
                data:{
                    checkItemID:itm.id,
                    dutyDate:appcan.locStorage.getVal("dutyDeptTime"),
                    status:itm.isCheck
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
        appcan.window.publish('duty-four-term', JSON.stringify(vm.checkItem));
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    //读取duty-four.html传来的数据
    var this_term = appcan.locStorage.getVal('duty-4-term');
    if(isDefine(this_term)){
        vm.checkItem = [].concat(JSON.parse(this_term).checkItem);
    }
    
    appcan.ready(function() {
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.window.publish('duty-four-term', JSON.stringify(vm.checkItem));
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
             appcan.window.publish('duty-four-term', JSON.stringify(vm.checkItem));
             appcan.window.close(1);
        }
    });
    
})($);