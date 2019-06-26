var vm = new Vue({
    el: "#Page",
    data: {
        nothing: false,
        nonet: false
    }
});


;(function ($){
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function (){
        
        return;
        
        initEchart();
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
    });
    
})($);

// var option = {
    // color: ['#3398DB'],
    // tooltip : {
        // trigger: 'axis',
        // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            // type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        // }
    // },
    // grid: {
        // left: '13%',
        // right: '14%',
        // bottom: '3%',
        // containLabel: true
    // },
    // dataZoom: {
      // type: 'slider',
      // start: 1,
      // end: 50
    // },
    // xAxis : [
        // {
            // type : 'category',
            // data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            // axisTick: {
                // alignWithLabel: true
            // }
        // }
    // ],
    // yAxis : [
        // {
            // type : 'value'
        // }
    // ],
    // series : [
        // {
            // name:'直接访问',
            // type:'bar',
            // barWidth: '60%',
            // data:[10, 52, 200, 334, 390, 330, 220]
        // }
    // ]
// };


function initEchart () {
    var titleHeight = parseInt($('#Header').height());
    var pageWidth = parseInt($('#Page').width());
    var pageHeight = parseInt($('#Page').height());
    $("#Echart").css({
        width: pageWidth,
        height: pageWidth
    });
    var myChart = echarts.init(document.getElementById('Echart'));
    myChart.setOption(option)
    return;
    var json = {
        // path: serverPath+'focFlightLeaveController.do?focGetLeavePlan',
        path: 'http://172.27.35.3/single/focFlightLeaveController.do?focGetLeavePlan',
        data: {
            sst: '2017-11-08'
        }
    }
    ajaxRequest(json, function (result, e) {
        if (e == 'success') {
            $('#Echart').show();
            
            var data   = result.obj,
                plan   = [],
                actual = [];
            for (item in data) {
                plan.push(data[item].sst)
                actual.push(data[item].sat)
            }
            option.series[0].data = plan;
            option.series[1].data = actual;
            myChart.setOption(option)
        } else {
            vm.nonet = true;
        }
    });
      
};

(function () {
    
    
var data1 = [];
var data2 = [];
var data3 = [];

var random = function (max) {
    return (Math.random() * max).toFixed(3);
};

for (var i = 0; i < 500; i++) {
    data1.push([random(15), random(10), random(1)]);
    data2.push([random(10), random(10), random(1)]);
    data3.push([random(15), random(10), random(1)]);
}

var option = {
    animation: false,
    legend: {
        data: ['scatter', 'scatter2', 'scatter3']
    },
    tooltip: {
    },
    xAxis: {
        type: 'value',
        min: 'dataMin',
        max: 'dataMax',
        splitLine: {
            show: true
        }
    },
    yAxis: {
        type: 'value',
        min: 'dataMin',
        max: 'dataMax',
        splitLine: {
            show: true
        }
    },
    dataZoom: [
        {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 1,
            end: 35
        },
        {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            left: '93%',
            start: 29,
            end: 36
        },
        {
            type: 'inside',
            xAxisIndex: [0],
            start: 1,
            end: 35
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            start: 29,
            end: 36
        }
    ],
    series: [
        {
            name: 'scatter',
            type: 'bar',
            itemStyle: {
                normal: {
                    opacity: 0.8
                }
            },
            symbolSize: function (val) {
                return val[2] * 40;
            },
            data: data1
        },
        {
            name: 'scatter2',
            type: 'bar',
            itemStyle: {
                normal: {
                    opacity: 0.8
                }
            },
            symbolSize: function (val) {
                return val[2] * 40;
            },
            data: data2
        },
        {
            name: 'scatter3',
            type: 'bar',
            itemStyle: {
                normal: {
                    opacity: 0.8,
                }
            },
            symbolSize: function (val) {
                return val[2] * 40;
            },
            data: data3
        }
    ]
}


var option = {
    color: ['#3398DB'],
    grid: {
        top: '2%',
        left: '5%',
        right: '7%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'value',
            position: 'top',
            axisLabel: {
                interval: 0,
                rotate: 90
            },
            min: 0,
            max: 50,
        }
    ],
    yAxis : [
        {
            type : 'category',
            data : [6,5,4,3,2,1,0,6,5,4,3,2,1,0,6,5,4,3,2,1,0],
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                rotate: -90
            }
        }
    ],
    series : [
        {
            name:'直接访问',
            type:'bar',
            data:[10, 45, 20, 34, 39, 30, 22, 10, 45, 20, 34, 39, 30, 22, 10, 45, 20, 34, 39, 30, 22],
            label: {
                normal: {
                    show: true,
                    rotate: -90
                }
            }
        },
        {
            name:'直接访问',
            type:'line',
            data:[10, 50, 27, 23, 36, 25, 20, 10, 50, 27, 23, 36, 25, 20, 10, 50, 27, 23, 36, 25, 20],
            label: {
                normal: {
                    show: true,
                    rotate: -90,
                    color: '#000'
                }
            },
            lineStyle: {
                normal: {
                    color: '#000'
                }
            }
        }
    ]
};


    var titleHeight = parseInt($('#Header').height());
    var pageWidth = parseInt($('#Page').width());
    var pageHeight = parseInt($('#Page').height());
    $("#Echart").css({
        width: pageWidth,
        height: '1000px'
    });

var myChart = echarts.init(document.getElementById('Echart'));
    myChart.setOption(option)
    
})($);



