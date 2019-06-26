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
                            appcan.window.open("duty-switch-detail","duty-switch-detail.html",2);
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
var page=0;
var stop=false;
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
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
            //在滚动的底部，这个事件将被触发。你应该从服务器获取数据
            $("#ScrollContent").trigger("more", this);
            scrollbox.reset();
            if(!stop){
                page++;
                loadUnapproved(page,10,1);
            }
            
        });
        loadUnapproved(0,10,1);
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
function loadUnapproved(page,size,status){
    var json={
        path:serverPath+'applyFor.do?focgetAllUnconfirmedDutyShiftApplyList',
        data:{
            page:page,
            size:size,
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
                      //data.obj[i].name_a=name_b;
                      //data.obj[i].name_b=name_a;
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
            if(isDefine(data.obj)){
                if(page>0){
                  vm.approveDuty = vm.approveDuty.concat(data.obj);  
                }else{
                  vm.approveDuty = data.obj;  
                }
                
            }else{
                stop=true;
            }
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