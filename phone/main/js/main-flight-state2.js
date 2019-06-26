var vm = new Vue({
    el: "#Page",
    data: {
        nothing: false,
        nonetwork: false
    }
});

;(function ($) {
    var docWidth = document.documentElement.clientWidth;
    $('.e-charts').css({
        width: docWidth * 3,
        height: '100%'
    });
})($);


;(function ($){
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function (){
        
        getChartsData('focFlightLeaveController.do?focGetEnterPlan', 'jingang');
        
        getChartsData('focFlightLeaveController.do?focGetLeavePlan', 'chugang');
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
    });
    
    //tab切换
    $('.tab-pill-box').on('click', '.tab-pill-text', function(e) {
        var that = $(this),
            idx = that.index(),
            box = $('.tab-box'),
            clsa = 'actives',
            clsb = 'actives';
            
        vm.tagIndex = that.index();
        that.addClass(clsa).siblings().removeClass(clsa);
        box.eq(idx).addClass(clsb).siblings().removeClass(clsb);
        $('body').scrollTop(0);
    });
    
})($);

function getChartsData (src, eleId) {
    var json = {
        path: serverPath + src,
        data: {}
    };
    
    if (eleId == 'jingang') {
        json.data['est'] = timeStemp(new Date().getTime(), 'yyyy-MM-dd').date;       
    } else if (eleId == 'chugang') {
        json.data['sst'] = timeStemp(new Date().getTime(), 'yyyy-MM-dd').date;
    }
    
    ajaxRequest(json, function (result, e) {
        if (e == 'success') {
            var data = result.obj,
                chartsData = {
                    plan: [],
                    actual: []
                };
            
            if (eleId == 'jingang') {
                for (item in data) {
                    chartsData.plan.push(data[item].est); // 计划
                    chartsData.actual.push(data[item].eat); // 实际
                };
            } else if (eleId == 'chugang') {
                for (item in data) {
                    chartsData.plan.push(data[item].sst); // 计划
                    chartsData.actual.push(data[item].sat) // 实际
                };
            }
            
            initChartsExport(eleId, chartsData)
            
        } else {
            vm.nonetwork = true;
            $('.tab-box').addClass('hide');
        }
    });    
};

function initChartsExport(eleId, chartsData){
    var options = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: 'rgba(0,0,0,0)'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: [5, 10],
            textStyle: {
                color: '#FFFFFF',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        legend: {
            left: '3%',
            bottom: 20
            // data: ['计划出港航班', '实际出港航班']
        },
        xAxis: {
            type: 'category',
            data: ['00:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', "11:00",'12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', "23:00"],
            boundaryGap: false,
            splitLine: {
                show: false,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#E2E1E1'
                }
            },
            axisLabel: {
                color: '#333333',
                margin: 10,
                padding: [0, 10],
                textStyle: {
                    fontSize: 14
                }
            }
        },
        yAxis: {
            type: 'value',
            position: 'left',
            min: 0,
            max: 50,
            splitLine: {
                lineStyle: {
                    color: ['#E2E1E1'],
                    type: 'dashed'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#999999'
                }
            },
            axisLabel: {
                inside: false,
                color: '#999999',
                margin: 10,
                textStyle: {
                    fontSize: 12
                }
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '50',
            bottom: '100'
        },
        series: [{
            // name: '计划出港航班',
            type: 'line',
            smooth: false,
            showSymbol: true,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
            data: chartsData.plan,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(199, 237, 250,1)'
                    }, {
                        offset: 0.5,
                        color: 'rgba(199, 237, 250,0.6)'
                    }, {
                        offset: 1,
                        color: 'rgba(255, 255, 255,0.1)'
                    }], false)
                }
            },
            itemStyle: {
                normal: {
                    color: '#52A7FF'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }, {
            // name: '实际出港航班',
            type: 'line',
            smooth: true,
            showSymbol: true,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
            data: chartsData.actual,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(216, 244, 247,1)'
                    }, {
                        offset: 0.5,
                        color: 'rgba(216, 244, 247,0.6)'
                    }, {
                        offset: 1,
                        color: 'rgba(255, 255, 255,0.1)'
                    }], false)
                }
            },
            itemStyle: {
                normal: {
                    color: '#FA9461'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }]
    };
    
    if (eleId == 'jingang') {
        options.legend.data = ['计划进港航班', '实际进港航班'];
        options.series[0].name = '计划进港航班';
        options.series[1].name = '实际进港航班';
    } else if (eleId == 'chugang') {
        options.legend.data = ['计划出港航班', '实际出港航班'];
        options.series[0].name = '计划出港航班';
        options.series[1].name = '实际出港航班';
    }
    var myChart = echarts.init(document.getElementById(eleId));
    myChart.setOption(options);
};
