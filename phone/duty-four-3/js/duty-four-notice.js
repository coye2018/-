var vm = new Vue({
    el: '#duty_four_notice',
    data: {
        nt: [
            {
                flag: false,
                title: '必到时间地点的执行进度百分比是怎么计算出来的？',
                content: '必到时间地点的执行进度数值是系统根据您上传的轨迹信息和您单位的四必细则进行比对后自动计算的，影响因素有四必时间内您在四必区域的停留时间、活动频率、轨迹点数量等等。'
            },{
                flag: false,
                title: '当我到达必到地点时应该如何签到？',
                content: '不需要签到，系统会自动根据您的位置信息和您单位的四必细则进行智能匹配，如果在必到时间您到了必到地点，那么系统会自动开始计算该段时间段内的四必执行百分比。'
            },{
                flag: false,
                title: '为什么我在必到时间到达了必到地点，但是执行情况的百分比却很低？',
                content: '首先请您确认您在该时间段内的轨迹是否正常上传到了服务器上，如果确定上传了，然后请确认您在该必到区域的停留时间，如果停留时间也足够长，请联系系统管理员寻求技术支持。'
            }
        ]
    },
    methods: {
        show: function(obj) {
            obj.flag = !obj.flag;
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(13);
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function() {
        // var paramClose = {
            // isSupport: (appcan.locStorage.getVal('platForm') != '1')
        // };
        // uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        // uexWindow.onSwipeRight = function() {
             // appcan.window.close(1); 
        // };
    });
    
})($);