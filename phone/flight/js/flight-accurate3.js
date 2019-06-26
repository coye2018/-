var platForm = appcan.locStorage.getVal("platForm");

var vm = new Vue({
    el: '#searchFlight',
    data: {
        deadline: {
            time:''
        }
    },
    methods: {
        //航班查询
        query:function(){
            var flightnum=$("#flight-num").val();
            appcan.locStorage.setVal('flightnum',flightnum);
            var airLine=$("#airline").val();
            appcan.locStorage.setVal('airLine',airLine);
            var planeno=$("#plane-No").val();
            appcan.locStorage.setVal('planeno',planeno);
            var Model=$("#model").val();
            appcan.locStorage.setVal('Model',Model);
            var gate=$("#Gate").val();
            appcan.locStorage.setVal('gate',gate);
            var DepartureCity=$("#Departure-city").val();
            appcan.locStorage.setVal('DepartureCity',DepartureCity);
            var arrivalCity=$("#arrival-city").val();
            appcan.locStorage.setVal('arrivalCity',arrivalCity);
            noClick($('li'));
            //打开航班信息
            if(platForm == "1"){
                appcan.window.open('flight-search3', 'flight-search3.html', 2);
            }else{
                appcan.window.open({
                    name:'flight-search3',
                    dataType:0,
                    data:'flight-search3.html',
                    aniId:0,
                    type:1024
                });
            }
        }
    }
});

(function($) {
    appcan.ready(function(){
        appcan.window.publish("option-click","option-click");
    });
    appcan.button("#nav-left", "btn-act",
        function() {
            appcan.window.close(1);
        });
    appcan.button("#nav-right", "btn-act",
        function() {});
    $('.tab-pill-box').on('click', '.tab-pill-text', function(e){
        var that = $(this),
            idx = that.index(),
            clsa = 'actives';
        that.addClass(clsa).siblings().removeClass(clsa);
        $(".items").hide().eq(idx).show();
    });

})($)

