var vm = new Vue({
   el: '#Page',
   data: {
       approveDuty: [],
       nonet: false,
       isNothing: false
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

(function($) {
    // 上下拉加载
    var mescroll = new MeScroll('mescroll', {
        down: {
            auto: false
        },
        up: {
            use: true,
            auto: true,
            noMoreSize: 5,
            page: {
                num : 0, 
                size : 10
            },
            callback: loadUnapproved
        }
    });
    
    appcan.ready(function() {
        updatedutyNum();
    });
    
    function loadUnapproved(page){
        
        if (page.num == 1) {
            vm.approveDuty = [];
        }
        
        var json={
            path:serverPath+'applyFor.do?focgetDutyShiftApplyList',
            data:{
                page: page.num -1,
                size: page.size,
                status: 3
            },
            layer: false
        }
        ajaxRequest(json,function(data,e){
            if(e == "success"){
                if(data.obj.length == 0 && page.num == 1){
                    vm.isNothing = true;
                };
                setData(data);
                mescroll.endSuccess(data.obj.length);
            } else {
                vm.nonet = true; 
                mescroll.endErr();
            }
        });
        
    };   
    
    function setData (data) {
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
                  data.obj[i].name_b_time=timeStemp(name_a_time,'MM-dd').date;
                  var name_b=data.obj[i].name_b;
                  var name_a=data.obj[i].name_a;
                  //data.obj[i].name_b=name_a;
                  //data.obj[i].name_a=name_b;
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
            vm.approveDuty = vm.approveDuty.concat(data.obj);
        }
        
    };     
    
        
    // 修改换班申请历史记录的消息数。
    function updatedutyNum(){
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
    };
    
})($);
