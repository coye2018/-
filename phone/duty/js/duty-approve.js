var vm = new Vue({
               el: '#Page',
               data: {
                   approveDuty: [],
                   nonet:false
               },
                methods: {
                   unclick:function(item,index){
                       appcan.locStorage.setVal("duty-detail-Id",item.id);
                        var platForm=appcan.locStorage.getVal("platForm");
                        var aniId=0;
                        //Android
                        if(platForm=="1"){
                            appcan.window.open('duty-switch-detail', 'duty-switch-detail.html', 2);
                        }else{
                              appcan.window.open({
                                name:'duty-switch-detail',
                                dataType:0,
                                data:'duty-switch-detail.html',
                                aniId:aniId,
                                type:1024
                            });  
                        }
                   }
               }
});
//
//var page=0;
//var stop=false;
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
             appcan.window.open('duty-approve-history', 'duty-approve-history.html', 2);
        }else{
              appcan.window.open({
                name:'duty-approve-history',
                dataType:0,
                data:'duty-approve-history.html',
                aniId:aniId,
                type:1024
            });  
        }
    });
    
    appcan.ready(function() {
        updateDutyApproveNum();
        var scrollbox= $.scrollbox($("body")).on("releaseToReload",
        function() { //After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
           
        }).on("onReloading",
        function(a) { //如果onReloading状态，拖动将触发该事件
        }).on("dragToReload",
        function() {
            
        }).on("draging",
        function(status) { //on draging, this event will be triggered.
        }).on("release",
        function() { //on draging, this event will be triggered.
        }).on("scrollbottom",
        function() { 
            //这个不做分页
            // //在滚动的底部，这个事件将被触发。你应该从服务器获取数据
            // $("#ScrollContent").trigger("more", this);
            // scrollbox.reset();
            // if(!stop){
                // page++;
                // loadUnapproved(page,10,0);
            // }
            
        }).hide();
        loadUnapproved(0);
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
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
    });
    
    appcan.button("#approve-all", "btn-act", function() {
        var data=vm.approveDuty;
        var dutyIdArr="";
        for (var i=0; i < data.length; i++) {
             dutyIdArr=dutyIdArr+data[i].id+",";
        };
       dutyIdArr=dutyIdArr.substring(0,dutyIdArr.length-1);
        if(dutyIdArr.length==0){
            layerToast("暂无可审批的申请！");
            return false;
        }
        addConfirm({
            content: '确定审批全部换班申请吗？',
            yes: function(index){
                
                var json={
                    path:serverPath+'applyFor.do?focconfirmAllDutyShfitApply',
                    data:{
                        allID:dutyIdArr
                    }
                }
                ajaxRequest(json,function(data,e){
                    //console.log(data);
                    if(e=="success"){
                        layerToast("审批成功！");
                        loadUnapproved(0);
                    }
                });
                layerRemove(index);
            }
        });
    });
    
})($);
function loadUnapproved(status){
    var json={
        path:serverPath+'applyFor.do?focgetAllUnconfirmedDutyShiftApplyList',
        data:{
            status:status
        },
        layerErr:false
    }
    ajaxRequest(json,function(data,e){
        if(e=="success"){
            vm.nonet=false;
            for (var i=0; i < data.obj.length; i++) {
                  var name_a_time=data.obj[i].name_a_time;
                  var name_b_time=data.obj[i].name_b_time;
                  if(data.obj[i].approval_type==2)
                  {
                      data.obj[i].name_a_time=timeStemp(name_b_time,'MM-dd').date;
                      data.obj[i].name_b_time=timeStemp(name_a_time,'MM-dd').date;
                      data.obj[i].name_a_weekday=timeStemp(name_b_time,'MM-dd').weekDay;
                      data.obj[i].name_b_weekday=timeStemp(name_a_time,'MM-dd').weekDay;
                  }else{
                       var name_a=data.obj[i].name_a;
                       var name_b=data.obj[i].name_b;
                      //data.obj[i].name_b=name_a;
                      //data.obj[i].name_a=name_b;
                      data.obj[i].name_b_time=timeStemp(name_a_time,'MM-dd').date;
                      data.obj[i].name_a_time='';
                      data.obj[i].name_b_weekday=timeStemp(name_a_time,'MM-dd').weekDay;
                      data.obj[i].name_a_weekday=''; 
                  }
                 var statusJson=["待审批","已审批"];
                 var appStateCode= data.obj[i].approval_state;
                 var appState=statusJson[appStateCode];
                 data.obj[i].approval=appState;
                 data.obj[i].create_time=timeStemp(data.obj[i].create_time,'MM-dd HH:mm').date;
            };
            //if(isDefine(data.obj)){
                vm.approveDuty = data.obj;
            //}else{
            //    stop=true;
            //}
            if(!isDefine(vm.approveDuty)){
                $("#nothing").removeClass("hide");
            }else{
                $("#nothing").addClass("hide");
            }
        }else{
            vm.nonet=true;
        }
    });
    
}
/**
 * 修改审批的消息数。
 */
function updateDutyApproveNum(){
    var json={
        path:serverPath+'focCommonController.do?focclearMessageNum',
        data:{
            model: appcan.locStorage.getVal("optionFunctionid")
        },
        layer:false
    }
    ajaxRequest(json,function(data,e){
        if(e=="success"){
            //通知功能页更新消息数
            appcan.window.publish("option-get-num","option-get-num");
        }else{
        }
    });
}