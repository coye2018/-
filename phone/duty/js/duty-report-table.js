//定义，默认选中的下角标。
var activeIndex=3;

//定义vue， 
var vm = new Vue({
    el: '#Page',
    data: {
        weekdays:[],
        today:new Date().getFullYear()+'年'+(new Date().getMonth()+1)+'月',
        todayFull: '',
        nothing:false,
        nonet:false,
        dutyReportTable:[]
    },
    methods: {
        pick:function(item,index){
            //改变原来选中的状态。
            vm.weekdays[activeIndex].actives=false;
            //把现在点击的dom元素改为选中状态。
            vm.weekdays[index].actives=true;
            //将今天的月份修改为当前月份
            vm.today=vm.weekdays[index].fullYearAndMoth;
            //最后赋值
            activeIndex=index;
            //下面写ajax
            
            loadReportDate(vm.weekdays[index].dateTime);
       },
       call:function(item){
           if(isDefine(item.dutyphone)){
               uexCall.dial(item.dutyphone);
           }else{
                var phone=""; 
                for (var i=0; i < item.dutyPeoples.length; i++) {
                    phone=item.dutyPeoples[i].mobilePhone;
                    //console.log(phone);
                    if(isDefine(phone)){
                        break;
                    }else{
                        continue;
                    }
                };
                if(isDefine(phone)){
                    uexCall.dial(phone);
                }else{
                    layerToast('暂无该人员电话号码！');
                }
                
           }
       },
       unclick:function(item,index){
            //将所有列表数据点击事件上锁，以防多次点击导致打开多个同样页面
            noClick($('li'));
            if(item.isFinish){
            	appcan.locStorage.setVal("dutyId",item.briefing_id);
            	var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                   appcan.window.open('duty-report-detail','duty-report-detail.html',2);
                }else{
                   appcan.window.open({
                        name:'duty-report-detail',
                        dataType:0,
                        data:'duty-report-detail.html',
                        aniId:aniId,
                        type:1024
                    }); 
                }
            }else{
                //解锁
                yesClick($('li'));
            	layerToast('暂未提交值班简报');
            }
       }, 
       getMonthDuty:function(item){
           //将各公司id存入缓存中
           appcan.locStorage.setVal("dutyMonthDeptId",item.departId);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open("duty-month","duty-month.html",2);
            }else{
               appcan.window.open({
                    name:'duty-month',
                    dataType:0,
                    data:'duty-month.html',
                    aniId:aniId,
                    type:1024
                }); 
            }
           
       }
   }
});
var today=0;
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {
        vm.weekdays = getLast7Days(0);
        vm.todayFull = timeStemp(new Date().getTime(), 'yyyy-MM-dd').date; //今天的日期
        var today=Math.round(new Date().getTime()/1000);
        //加载值班数据。
        loadReportDate(today);
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
        //解锁，使值班简报提交情况列表能够点击
        appcan.window.subscribe("duty-report-click",function(e){
            yesClick($('li'));
        })
    });

})($);
function loadReportDate(day){
    today=day;
    if(!isDefine(day)){
        day=Math.round(new Date().getTime()/1000);
    }
    var json={
        path:serverPath+'focBriefingController.do?focgetAllDepartsDutyReportList ',
        data:{
            time:day
        },
        layer:false,
        layerErr:false
    };
    ajaxRequest(json,function(data,e){
        
       if(e=="success"){
       	   //console.log(data);
           vm.nonet=false;
           for(var i=0;i<data.obj.length;i++){
           		if(data.obj[i].briefing_id!=""){
           			data.obj[i].isFinish=true;
           		}else{
           			data.obj[i].isFinish=false;
           		}
           }
           vm.dutyReportTable=data.obj;
           //vm.dutyPeopleType=data.attributes.dutyModeDetail;
       }else{
           vm.nonet=true;
           $('.shade').addClass('shade-hide');
       } 
    });
}