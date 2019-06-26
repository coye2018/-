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
        dutyFour:[]
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
            
            loadDutyDate(vm.weekdays[index].dateTime);
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
           if(!isDefine(item.isFinish)){
               layerToast('该值班单位暂未提交四必执行情况');
               return;
           }
            appcan.locStorage.setVal("dutyDeptId", item.orgID);
            appcan.locStorage.setVal("dutyDeptTime", today);
            //appcan.locStorage.setVal("isCanEdit",false);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-four-2', 'duty-four-2.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-2',
                    dataType:0,
                    data:'duty-four-2.html',
                    aniId:aniId,
                    type:1024
                });
            }
       }, 
       getMonthDuty:function(item){
           //将各公司id存入缓存中
            appcan.locStorage.setVal("dutyMonthDeptId",item.departId);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-month', 'duty-month.html', 2);
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
        appcan.window.publish("reloadDuty","reloadDuty");
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {
        vm.weekdays = getLast7Days(0);
        vm.todayFull = timeStemp(new Date().getTime(), 'yyyy-MM-dd').date; //今天的日期
        var today=Math.round(new Date().getTime()/1000);
        //加载值班数据。
        loadDutyDate(today);
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
            appcan.window.publish("reloadDuty","reloadDuty");
            appcan.window.close(1); 
        }
    });
    
    //左滑显示操作按钮
    $('.myli').on('swipeLeft', 'li', function(e){
        e.stopPropagation();
        var that = $(this);
        var distant = that.find('.myli-right').width();
        
        that.find('.myli-center-lg').css({
            '-webkit-transform': 'translate(-'+distant+'px)',
            'transform': 'translate(-'+distant+'px)'
        });
        that.siblings().find('.myli-center-lg').css({
            '-webkit-transform': 'translate(0)',
            'transform': 'translate(0)'
        });
        
    });
    
    //右滑该项, 列表恢复原位
    $('.myli').on('swipeRight', 'li', function(e){
        var that = $(this);
        
        that.find('.myli-center-lg').css({
            '-webkit-transform': 'translate(0)',
            'transform': 'translate(0)'
        });
    });
    
    //点击每一项的操作
    $('.myli').on('click', '.myli-center-lg', function(e){
        e.stopPropagation();
        var that = $(this);
        
        that.parents('.myli').find('.myli-center-lg').css({
            '-webkit-transform': 'translate(0)',
            'transform': 'translate(0)'
        });
    });
    
    //点击按钮本身, 列表不恢复原位
    $('.myli').on('click', '.myli-btn', function(e){
        e.stopPropagation();
    });
    
    //点击其他地方, 列表恢复原位
    $('body').on('click', function(e){
        $('.myli>li').trigger('swipeRight');
        return false;
    });
    
    uexWindow.setReportKey(0, 1);
    uexWindow.onKeyPressed = function(keyCode) {
        if (keyCode == 0) {
            appcan.window.publish("reloadDuty","reloadDuty");
            appcan.window.close(1);
        }
    };

})($);
function loadDutyDate(day){
    today=day;
    if(!isDefine(day)){
        day=Math.round(new Date().getTime()/1000);
    }
    var json={
        path:serverPath+'focFourMustController.do?focGetAllMustInfo',
        data:{
            dutyDate:day
        },
        layer:false,
        layerErr:false
    };
    ajaxRequest(json,function(data,e){
        
       if(e=="success"){
           vm.nonet=false;
           if(data.obj.length==0){
               vm.nothing=true;
           }else{console.log(JSON.stringify(data.obj));
               vm.nothing=false;
           }
           vm.dutyFour=data.obj;
           //vm.dutyPeopleType=data.attributes.dutyModeDetail;
       }else{
           vm.nonet=true;
           $('.shade').addClass('shade-hide');
       } 
    });
}