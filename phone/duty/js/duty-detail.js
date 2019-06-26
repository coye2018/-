var vm = new Vue({
    el : '#Page',
    data : {
        approveDuty : {
            name_a_time: '　',
            name_a_weekday: '　',
            name_a: '　',
            name_b_time: '　',
            name_b_weekday: '　',
            name_b: '　'
        }
    }
});
(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act", function() {
    });

    appcan.ready(function() {
        $.scrollbox($("body")).on("releaseToReload", function() {//After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
        }).on("onReloading", function(a) {//if onreloading status, drag will trigger this event
        }).on("dragToReload", function() {//drag over 30% of bounce height,will trigger this event
        }).on("draging", function(status) {//on draging, this event will be triggered.
        }).on("release", function() {//on draging, this event will be triggered.
        }).on("scrollbottom", function() {//on scroll bottom,this event will be triggered.you should get data from server
            $("#ScrollContent").trigger("more", this);
        }).hide();
        var dutyDetailId = appcan.locStorage.getVal("duty-detail-Id");
        loadUnapproved(dutyDetailId);
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
function loadUnapproved(id) {
    var json = {
        path : serverPath + 'applyFor.do?focgetInfoByid',
        data : {
            id : id
        }
    }
    ajaxRequest(json, function(data, e) {
        if (e == "success") {
            for (var i = 0; i < data.obj.length; i++) {
                var name_a_time = data.obj[i].name_a_time;
                var name_b_time = data.obj[i].name_b_time;
                if (data.obj[i].approval_type == 2) {
                    data.obj[i].name_a_time = timeStemp(name_b_time, 'MM-dd').date;
                    data.obj[i].name_b_time = timeStemp(name_a_time, 'MM-dd').date;
                    data.obj[i].name_a_weekday = timeStemp(name_b_time, 'MM-dd').weekDay;
                    data.obj[i].name_b_weekday = timeStemp(name_a_time, 'MM-dd').weekDay;
                } else {
                    var name_a=data.obj[i].name_a;
                    var name_b=data.obj[i].name_b;
                    //data.obj[i].name_a=name_b;
                    //data.obj[i].name_b=name_a;
                    data.obj[i].name_a_time = '';
                    data.obj[i].name_b_time = timeStemp(name_a_time, 'MM-dd').date;
                    data.obj[i].name_a_weekday = '';
                    data.obj[i].name_b_weekday = timeStemp(name_a_time, 'MM-dd').weekDay;
                    
                }
                var statusJson = ["待审批", "已审批"];
                var appStateCode = data.obj[i].approval_state;
                var appState = statusJson[appStateCode];
                data.obj[i].approval = appState;
                data.obj[i].create_time = timeStemp(data.obj[i].create_time, 'MM-dd HH:mm').date;
                if(appStateCode==1){
                    data.obj[i].approval_time= timeStemp(data.obj[i].approval_time, 'MM-dd HH:mm').date;
                }else{
                    data.obj[i].approval_time="";
                }
                
            };
             vm.approveDuty = data.obj[0];
        }
    });

}