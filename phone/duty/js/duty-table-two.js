//定义，默认选中的下角标。
var activeIndex=3;
//定义vue， 
var vm = new Vue({
    el: '#Page',
    data: {
        weekdays:[],
        today:new Date().getFullYear()+'年'+(new Date().getMonth()+1)+'月',
        todayFull: ''
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
        $.scrollbox($("body")).on("releaseToReload",
        function() { //After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
        }).on("onReloading",
        function(a) { //if onreloading status, drag will trigger this event
        }).on("dragToReload",
        function() { //drag over 30% of bounce height,will trigger this event
        }).on("draging",
        function(status) { //on draging, this event will be triggered.
        }).on("release",
        function() { //on draging, this event will be triggered.
        }).on("scrollbottom",
        function() { //on scroll bottom,this event will be triggered.you should get data from server
            $("#ScrollContent").trigger("more", this);
        }).hide();
        
        vm.weekdays = getLast7Days(0);
        vm.todayFull = timeStemp(new Date(), 'yyyy-MM-dd').date.toString(); //今天的日期
    });
    
})($);