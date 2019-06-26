var vm = new Vue({
    el : '#Page',
    data : {
        option : [{
            "id" : "111",
            "name" : "跑道号码标志"
        }, {
            "id" : "222",
            "name" : "跑道入口前标志"
        }, {
            "id" : "333",
            "name" : "跑道入口标志"
        }, {
            "id" : "444",
            "name" : "跑道入口内移标志"
        }, {
            "id" : "555",
            "name" : "接地带标志"
        }, {
            "id" : "666",
            "name" : "瞄准点标志"
        }, {
            "id" : "777",
            "name" : "跑道中线标志"
        }, {
            "id" : "888",
            "name" : "跑道边线标志"
        }],
        v_example1 : [{
            "id" : "888",
            "name" : "跑道边线标志"
        }],
        v_example2 : [{
            "id" : "555",
            "name" : "接地带标志"
        }, {
            "id" : "666",
            "name" : "瞄准点标志"
        }],
        v_example3 : [{
            "id" : "555",
            "name" : "接地带标志"
        }],
        v_example4 : [{
            "id" : -1,
            "name" : "你写的是其它啦啦啦啦啦"
        }]
    },
    methods : {
        backto : function() {
            pageClose();
        },
        getVal : function() {
            //获取已选择的项数据
            var val1 = this.$refs.example1.getVal();
            var val2 = this.$refs.example2.getVal();
            var val3 = this.$refs.example3.getVal();
            var val4 = this.$refs.example4.getVal();
            console.log(val1);
            console.log(val2);
            console.log(val3);
            console.log(val4);
            //alert("单选：" + JSON.stringify(val1) + " 复选：" + JSON.stringify(val2) + " 复选带其它项：" + JSON.stringify(val3));
        }
    }
});

(function($) {
    appcan.button('#nav-left', 'btn-act', function() {
        pageClose();
    });

    appcan.ready(function() {
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                pageclose();
            }
        };
    })
})($);

function pageClose() {
    appcan.window.close(1);
}
