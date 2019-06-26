//定义，默认选中的下角标。
var activeIndex = 3;

Vue.use(VueLazyload, {
    preLoad: 2
});

//定义vue，
var vm = new Vue({
    el: '#Page',
    data: {
        weekData: ['日','一','二','三','四','五','六'],
        monthDays: [],
        today: new Date().getFullYear()+'年'+(new Date().getMonth()+1)+'月',
        todayFull: '',
        dutyPeople:[],
        dutyPeopleType: [],
        isSlide: false,
        nothing: false,
        nonet: false
    },
    mounted: function () {
        //ios300ms延时
        FastClick.attach(document.body);
    },
    methods: {

    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
        function() {
            appcan.window.close(13);
        });

    appcan.ready(function() {
        var dd = new Date();
        var dObj = {
            y: dd.getFullYear(),
            m: dd.getMonth(),
            d: dd.getDate()
        }
        initCanlendar(dObj);
        // vm.weekdays = getLast7Days(0);
        vm.todayFull = timeStemp(new Date().getTime(), 'yyyy-MM-dd').date; //今天的日期

        //加载值班数据。
        //var today = Math.round(new Date().getTime() / 1000);
        //loadDutyDate(today);

        // console.log(dObj)

        var platFormC=appcan.locStorage.getVal("platForm");
        var isSupport=false;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            //appcan.window.close(-1);
        }
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
    });

})($);
/**
 *
 * @param {Object} day 值班日期，后台处理某个时间段的值班人
 */




