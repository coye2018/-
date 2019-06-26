var vm = new Vue({
    el: '#main',
    data: {
        flight: {
            outtotal: '--', //放行航班总数
            outfinishednum: '--', //放行正常航班数
            dlyflight: '--', //延误航班数
            all_cancel: '--', //取消航班数 = 进港取消incancel + 出港取消offcancel
            vipflight: '--', // VIP航班(目前没有数据)
            rtnflight: '--', //返航
            altflight: '--', //备降
            bridge_rate: '--', //靠桥率bridgeRate
            information: {
                'data': []
            }
        },
        res: {}
    },
    methods: {},
    mounted: function () {
        //      myChart = echarts.init(document.getElementById('fangxinglv'));
        //      flightChart1 = echarts.init(document.getElementById('jingang'));
        //      flightChart2 = echarts.init(document.getElementById('chugang'));
        //myChart1 = echarts.init(document.getElementById('zhoufangxinglv'));
        //myChart2 = echarts.init(document.getElementById('yanwu'));
    }
});

(function ($) {
    appcan.button("#nav-left", "btn-act",
        function () {});
    appcan.button("#nav-right", "btn-act",
        function () {});
    //进出港切换
    $('.tab-pill-box').on('click', '.tab-pill-text', function (e) {
        var chkVal = $(this)[0].innerText;
        if (chkVal === '进港') {
            ent = 'A'
            appcan.locStorage.setVal('enout', ent);
            $(this).addClass('actives').siblings().removeClass('actives');
            $(".tab-charts").eq(0).addClass('showChart').removeClass('visibility').siblings().addClass(
                'visibility').removeClass('showChart');
        } else {
            ent = "D"
            appcan.locStorage.setVal('enout', ent);
            $(this).addClass('actives').siblings().removeClass('actives');
            $(".tab-charts").eq(1).addClass('showChart').removeClass('visibility').siblings().addClass(
                'visibility').removeClass('showChart');
        }
        console.log(ent)
    });
    var ent = 'A';
    appcan.locStorage.setVal('enout', ent);
    $(".choose").click(function () {

    })

    //每隔60秒请求一遍数据
    var gidPeriod = 60;
    setInterval(function () {
        getNum();
        getIndexData();
        getFlightChartsData('focFlightLeaveController.do?focGetEnterPlan', 'jingang');
        getFlightChartsData('focFlightLeaveController.do?focGetLeavePlan', 'chugang');
    }, gidPeriod * 1000);

    appcan.ready(function () {
        getIndexData();
        getNum();
        appcan.window.subscribe('isLoginEvent', function (msg) {
            getNum();
            getFlightChartsData('focFlightLeaveController.do?focGetEnterPlan', 'jingang');
            getFlightChartsData('focFlightLeaveController.do?focGetLeavePlan', 'chugang');
        });
        getFlightChartsData('focFlightLeaveController.do?focGetEnterPlan', 'jingang');
        getFlightChartsData('focFlightLeaveController.do?focGetLeavePlan', 'chugang');

        // var mySwiper = new Swiper ('.swiper-container', {
        // direction: 'horizontal',
        // pagination: '.swiper-pagination',
        // paginationClickable: true
        // });
    });

    //首页计划航班入口

    $('#Plan').click(function () {
        var platForm = appcan.locStorage.getVal("platForm");
        appcan.locStorage.setVal("number", 1);
        var aniId = 0;
        var count1=vm.res.count1
        if(count1==0){
            layerToast('暂无计划航班。');
            return false;
        }
        //Android
        if (platForm == "1") {
            appcan.window.open('../flight/flight-plan', '../flight/flight-plan.html', 2);
        } else {
            appcan.window.open({
                name: '../flight/flight-plan',
                dataType: 0,
                data: '../flight/flight-plan.html',
                aniId: aniId,
                type: 1024
            });
        }
    });

    //首页正常航班入口

    $('#Flight').click(function () {
        var platForm = appcan.locStorage.getVal("platForm");
        appcan.locStorage.setVal("number", 2);
        var aniId = 0;
        var count2=vm.res.count2
        if(count2==0){
            layerToast('暂无正常航班。');
            return false;
        }
        //Android
        if (platForm == "1") {
            appcan.window.open('../flight/flight-delay', '../flight/flight-delay.html', 2);
        } else {
            appcan.window.open({
                name: '../flight/flight-delay',
                dataType: 0,
                data: '../flight/flight-delay.html',
                aniId: aniId,
                type: 1024
            });
        }
    })

    //首页延误航班入口

    $('#Delay').click(function () {
        var platForm = appcan.locStorage.getVal("platForm");
        appcan.locStorage.setVal("number", 3);
        var aniId = 0;
        var count3=vm.res.count3
        if(count3==0){
            layerToast('暂无延误航班。');
            return false;
        }
        //Android
        if (platForm == "1") {
            appcan.window.open('../flight/flight-delay', '../flight/flight-delay.html', 2);
        } else {
            appcan.window.open({
                name: '../flight/flight-delay',
                dataType: 0,
                data: '../flight/flight-delay.html',
                aniId: aniId,
                type: 1024
            });
        }
    })

    //首页取消航班入口

    $('#Cancel').click(function () {
        var platForm = appcan.locStorage.getVal("platForm");
        appcan.locStorage.setVal("number", 4);
        var aniId = 0;
        var count4=vm.res.count4
        if(count4==0){
            layerToast('暂无取消航班。');
            return false;
        }
        //Android
        if (platForm == "1") {
            appcan.window.open('../flight/flight-delay', '../flight/flight-delay.html', 2);
        } else {
            appcan.window.open({
                name: '../flight/flight-delay',
                dataType: 0,
                data: '../flight/flight-delay.html',
                aniId: aniId,
                type: 1024
            });
        }
    });

    //首页VIP航班入口

    $('#Vip').click(function () {
        var platForm = appcan.locStorage.getVal("platForm");
        appcan.locStorage.setVal("number", 5);
        var aniId = 0;
        var count5=vm.res.count5
            if(count5==0){
                layerToast('暂无vip航班。');
                return false;
            }

        //Android
        if (platForm == "1") {
            appcan.window.open('../flight/flight-delay', '../flight/flight-delay.html', 2);
        } else {
            appcan.window.open({
                name: '../flight/flight-delay',
                dataType: 0,
                data: '../flight/flight-delay.html',
                aniId: aniId,
                type: 1024
            });
        }
    });

    //首页返航航班入口

    $('#Homeward').click(function () {
        var platForm = appcan.locStorage.getVal("platForm");
        appcan.locStorage.setVal("number", 6);
        var aniId = 0;
        var count6=vm.res.count6
        if(count6==0){
            layerToast('暂无返航航班。');
            return false;
        }
        //Android
        if (platForm == "1") {
            appcan.window.open('../flight/flight-delay', '../flight/flight-delay.html', 2);
        } else {
            appcan.window.open({
                name: '../flight/flight-delay',
                dataType: 0,
                data: '../flight/flight-delay.html',
                aniId: aniId,
                type: 1024
            });
        }
    });

    //首页备降航班入口

    $('#Alternate').click(function () {
        var platForm = appcan.locStorage.getVal("platForm");
        appcan.locStorage.setVal("number", 7);
        var aniId = 0;
        var count7=vm.res.count7
        if(count7==0){
            layerToast('暂无备降航班。');
            return false;
        }
        //Android
        if (platForm == "1") {
            appcan.window.open('../flight/flight-delay', '../flight/flight-delay.html', 2);
        } else {
            appcan.window.open({
                name: '../flight/flight-delay',
                dataType: 0,
                data: '../flight/flight-delay.html',
                aniId: aniId,
                type: 1024
            });
        }
    })
})($);

//航班数据


var json = {
    path: 'http://10.10.236.142:8092/jeezz-single/ibmwebspheremq.do?getFlightData',
    layer: false,
    data: {}
};
var isFirstOpen = true; //是否刚打开app
function getIndexData() {
    var indexData = appcan.locStorage.getVal('indexData'),
        hasIndexData = isDefine(indexData); //是否有缓存值

    //如果是第一次用app, 无缓存值时, 显示遮罩等待数据
    //json.layer = !hasIndexData;
    json.layer = false;
    // if(hasIndexData && isFirstOpen){
    // //刚打开app, 先加载上一次缓存数据
    // console.log('缓存~');
    // handleChartsData(indexData);
    // }
    isFirstOpen = false;
    appcan.request.ajax({
        url: serverPath + 'transitibmwebspheremq.do?getFlightData',
        type: "POST",
        dataType: 'application/json',
        timeout: 40000,
        success: function (data) {
            //alert(JSON.stringify(data))
            var d = JSON.parse(data);
            console.log(d)
            handleChartsData(d.obj);
        },
        error: function (err, e, errMsg, error) {
            layerToast('抱歉, 首页数据请求出错, 请稍候。');
            if (hasIndexData) handleChartsData(indexData);
        }
    })

    /*
     ajaxRequest(json, function(data, e){
            alert(222);
            console.log(data);
            console.log('涓嶆槸缂撳瓨~');
            if(e=='success'){
                handleChartsData(data.obj);
            }else if(e=='error'){
                layerToast('鎶辨瓑, 棣栭〉鏁版嵁璇锋眰鍑洪敊, 璇风◢鍊欍�');
                if(hasIndexData) handleChartsData(indexData);
            }
        });*/

}

//时间
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
var ssttime = new Date().format("yyyy-MM-dd");
// console.log(ssttime)

// 首页航班数据获取

function getNum() {
    var json = {
        path: serverPath + 'focFlightSecondController.do?focGetflightByStatusCount',
        data: {
            sst: ssttime
            // token :"8a8a8bfa5dcf1734015dcf21e1e30014@*@YKQi2DvQtc0szdTLfBhlg"
        },
        layer:false
    };
    //请求获取数据,判断
    ajaxRequest(json, function (result) {
        vm.res = result.obj;
        console.log(vm.res);


    });
};

function handleChartsData(o) {
    //写进缓存, 以防第一次打开app请求数据过慢
    appcan.locStorage.setVal('indexData', o);
    var obj = JSON.parse(JSON.parse(o).obj.value).data;
    obj.all_cancel = obj.incancel + obj.offcancel;
    obj.outfinished_rate = ((Number(obj.outfinishednum) / Number(obj.outtotal)) * 100).toFixed(2);
    obj.bridge_rate = obj.bridgeRate + '%';
    obj.getdata_date = timeStemp(new Date());
    myChart.setOption({
        title: {
            text: obj.outfinished_rate + '%',
            subtext: '更新于' + timeStemp(new Date()).commonDate
        },
        series: [{
            name: '1',
            data: [{
                value: obj.outfinished_rate
            }]
        }]
    });
    vm.flight = $.extend({}, obj);
}

//var gauge_value = 52; //幸运值取代码置于值于此处
var myChart = echarts.init(document.getElementById('fangxinglv'));
//解决下载、更新、退出登录时只显示一个图表的问题 
var flightChart1 = echarts.init(document.getElementById('jingang'));
var flightChart2 = echarts.init(document.getElementById('chugang'));
//var myChart1 = echarts.init(document.getElementById('zhoufangxinglv'));
// var myChart2 = echarts.init(document.getElementById('yanwu'));
//改变图表尺寸, 在容器大小发生改变时需要手动调用
window.onorientationchange = window.onresize = function () {
    myChart.resize();
    flightChart1.resize();
    flightChart2.resize();
    // myChart1.resize();
    // myChart2.resize();
};

var option = {
    title: {
        show: true,
        x: "center",
        y: "55%",
        text: '--%', //幸运值取代码置于值于此处
        textStyle: {
            fontSize: 30,
            fontWeight: 'bolder',
            fontStyle: 'normal',
            color: '#333333'
        },
        subtext: '更新于今日',
        subtextStyle: {
            fontSize: 9,
            color: '#333333'
        }
    },
    backgroundColor: 'rgb(255, 255, 255)',
    series: [{
        name: '0',
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        center: ['50%', '60%'],
        splitNumber: 10, //刻度数量
        min: 0,
        max: 100,
        radius: '65%', //图表尺寸
        axisLine: {
            show: false,
            lineStyle: {
                width: 2,
                shadowBlur: 0,
                color: [
                    [1, '#E5E5E5']
                ]
            }
        },
        axisTick: {
            show: false,
        },
        splitLine: {
            show: false,
        },
        axisLabel: {
            show: false,
        },
        pointer: {
            show: false,
        },
        data: [{
            name: "",
            value: ''
        }],
        detail: {
            show: false
        },
        title: {
            show: false
        }
    }, {
        name: '1',
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        center: ['50%', '60%'],
        splitNumber: 10, //刻度数量
        min: 0,
        max: 100,
        radius: '100%', //图表尺寸
        axisLine: {
            show: true,
            lineStyle: {
                width: 10,
                shadowBlur: 0,
                color: [
                    [0.2, '#FF7D7E'],
                    [0.8, '#A7E2FE'],
                    [1, '#1DBD87']
                ]
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false,
            length: 0,
            lineStyle: {
                color: '#C7FBFC'
            }
        },
        axisLabel: {
            distance: 12,
            textStyle: {
                color: "#e1e1e1",
                fontSize: "14",
            },
            formatter: function (e) {
                switch (e + "") {
                    case "0":
                        return "0";
                    case "10":
                        return "10";
                    case "20":
                        return "20";
                    case "30":
                        return "30";
                    case "40":
                        return "40";
                    case "50":
                        return "50";
                    case "60":
                        return "60";
                    case "70":
                        return "70";
                    case "80":
                        return "80";
                    case "90":
                        return "90";
                    default:
                        return e;
                }
            }
        },
        pointer: {
            show: true,
            width: 2,
            // length:"90%"
        },
        itemStyle: {
            normal: {
                color: '#FFCC03'
            }
        },
        detail: { //指针评价
            show: true,
            offsetCenter: [0, 120],
            textStyle: {
                fontSize: 16,
                color: "#333333"
            }
        },
        title: {
            textStyle: {
                fontSize: 15,
                fontStyle: 'normal',
                color: "#999999"
            },
            offsetCenter: [0, -30]
        },
        data: [{
            name: "放行率",
            value: '--'
        }]
    }, {
        name: '2',
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        center: ['50%', '60%'],
        splitNumber: 10, //刻度数量
        min: 0,
        max: 100,
        radius: '110%', //图表尺寸
        axisLine: {
            show: true,
            lineStyle: {
                width: 1,
                shadowBlur: 0,
                color: [
                    [1, '#E5E5E5']

                ]
            }

        },
        axisTick: {
            show: false,
            lineStyle: {
                color: "#C7FBFC",
                width: 0
            },
            length: -5,
            splitNumber: 2
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        pointer: {
            show: false
        },
        data: [{
            name: '',
            value: ''
        }],
        detail: {
            show: false
        },
        title: {
            show: false
        },

    }]
};
myChart.setOption(option, true);

// var option1 = {
// tooltip: {
// trigger: 'axis',
// axisPointer: {
// lineStyle: {
// color: '#52A6FF'
// }
// }
// },
// grid: {
// left: '3%',
// right: '4%',
// bottom: '3%',
// top: '15%',
// containLabel: true
// },
// xAxis: {
// type: 'category',
// boundaryGap: false,
// axisLabel: {
// textStyle: {
// color: '#333333'
// }
// },
// axisLine: {
// lineStyle: {
// color: '#E1E1E1'
// }
// },
// data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
// },
// yAxis: {
// type: 'value',
// axisTick: {
// show: false
// },
// axisLine: {
// lineStyle: {
// color: '#E1E1E1'
// }
// },
// axisLabel: {
// textStyle: {
// color: '#999'
// }
// },
// splitLine: {
// lineStyle: {
// color: ['#E1E1E1'],
// type: 'dashed'
// }
// }
// },
// series: [{
// name: '周放行率',
// type: 'line',
// smooth: true,
// symbol: 'circle',
// symbolSize: 5,
// showSymbol: false,
// lineStyle: {
// normal: {
// width: 1
// }
// },
// areaStyle: {
// normal: {
// color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
// offset: 0,
// color: 'rgba(82, 166, 255, 0.4)'
// }, {
// offset: 1,
// color: 'rgba(82, 166, 255, 0)'
// }], false),
// shadowColor: '#52A6FF',
// shadowBlur: 10
// }
// },
// itemStyle: {
// normal: {
// color: 'rgb(0,136,212)',
// borderColor: 'rgba(0,136,212,0.2)',
// borderWidth: 12
// 
// }
// },
// data: [120, 110, 125, 145, 122, 165, 122]
// }]
// };
// myChart1.setOption(option1, true);
// 
// var dataAxis = ['>30min', '>1h', '1-2h', '2-3h', '3-4h', '>4h'];
// var data = [96.21, 31.3, 118.5, 72.21, 100, 130];
// var yMax = 150;
// var dataShadow = [];
// 
// for (var i = 0; i < data.length; i++) {
// dataShadow.push(yMax);
// }
// 
// var option2 = {
// color: ['#52A6FF'],
// grid: {
// top: 30,
// bottom: 30,
// left: 0,
// right: 0,
// containLabel: true
// },
// xAxis: {
// data: dataAxis,
// axisLabel: {
// inside: false,
// textStyle: {
// color: '#333'
// }
// },
// axisTick: {
// show: false
// },
// axisLine: {
// show: false
// },
// z: 10
// },
// yAxis: {
// position: 'right',
// axisLine: {
// show: false
// },
// axisTick: {
// show: false
// },
// axisLabel: {
// textStyle: {
// color: '#999'
// }
// },
// splitLine: {
// lineStyle: {
// color: ['#E1E1E1'],
// type: 'dashed'
// }
// }
// },
// dataZoom: [
// {
// type: 'inside'
// }
// ],
// series: [
// { // For shadow
// type: 'bar',
// itemStyle: {
// normal: {color: 'rgba(0,0,0,0.05)'}
// },
// barGap: '-100%',
// barCategoryGap: '40%',
// data: dataShadow,
// animation: false
// },
// {
// type: 'bar',
// itemStyle: {
// normal: {
// color: new echarts.graphic.LinearGradient(
// 0, 0, 0, 1,
// [
// {offset: 0, color: '#83bff6'},
// {offset: 0.5, color: '#188df0'},
// {offset: 1, color: '#188df0'}
// ]
// )
// },
// emphasis: {
// color: new echarts.graphic.LinearGradient(
// 0, 0, 0, 1,
// [
// {offset: 0, color: '#2378f7'},
// {offset: 0.7, color: '#2378f7'},
// {offset: 1, color: '#83bff6'}
// ]
// )
// }
// },
// label: {
// normal: {
// show: true,
// position: 'top',
// textStyle: {
// color: '#52A6FF'
// }
// }
// },
// data: data
// }
// ]
// };
// 
// // Enable data zoom when user click bar.
// var zoomSize = 6;
// myChart.on('click', function (params) {
// // console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
// myChart.dispatchAction({
// type: 'dataZoom',
// startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
// endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
// });
// });
// myChart2.setOption(option2, true);

// // 入口测试
// $("#fangxinglv").click(function(){
// var platForm=appcan.locStorage.getVal("platForm");
// if(platForm=="1"){
// appcan.window.open("../duty/duty-problem-finish","../duty/duty-problem-finish.html",2);
// }else{
// appcan.window.open({
// name:'../duty/duty-problem-finish',
// dataType:0,
// data:'../duty/duty-problem-finish.html',
// aniId:0,
// type:1024
// });  
// }
// })

function getFlightChartsData(src, eleId) {
    var json = {
        path: serverPath + src,
        data: {},
        layer: false
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

            createFlightChart(eleId, chartsData)

        } else {
            // 请求失败
            // console.log(data)
        }
    });
};

function createFlightChart(eleId, chartsData) {
    var flightOptions = {
        tooltip: { //提示框组件
            trigger: 'axis', //触发类型 是由坐标轴触发
            axisPointer: { //坐标轴指示器配置项
                lineStyle: {
                    color: 'rgba(0,0,0,0)'
                }
            },
            backgroundColor: '#fff',
            padding: [10],
            textStyle: {
                color: '#131313',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
//      legend: {
//          left: '2%',
//          bottom: 0
//          //       data: ['计划出港航班', '实际出港航班']
//      },
        xAxis: { //x轴
            type: 'category', //类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据
            data: ['00:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00',
                "11:00", '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
                '21:00', '22:00', "23:00"
            ],
            boundaryGap: false,
            //          splitLine: { //坐标轴在grid区域的分隔线
            //              show: true,
            //              interval: 'auto',
            //              lineStyle: {
            //                  color: ['#D4DFF5']
            //                  //                  color: ['#ffcc03']
            //              }
            //          },s
            axisTick: {
                show: true
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: { // 坐标轴文本标签
                interval:3,
                color: '#333333',
                textStyle: {
                    fontSize: 12
                }
            }
        },
        yAxis: {
            type: 'value',
            position: 'left',
            // min: 5,
            // max: 30,
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
                // margin: 5,
                textStyle: {
                    fontSize: 12
                }
            }
        },
        grid: {
            containLabel:true,
            left: '3%',
            right: '3%',
            bottom: '0%',
            top: '3%',
        },
        series: [{
            // name: '计划出港航班',
            type: 'line',
            smooth: false,
            showSymbol: true,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 5,
            data: chartsData.plan,
            //          areaStyle: {
            //              normal: {
            //                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //                      offset: 0,
            //                      color: 'rgba(199, 237, 250,1)'
            //                  }, {
            //                      offset: 0.5,
            //                      color: 'rgba(199, 237, 250,0.6)'
            //                  }, {
            //                      offset: 1,
            //                      color: 'rgba(255, 255, 255,0.1)'
            //                  }], false)
            //              }
            //          },
            itemStyle: {
                normal: {
                    color: '#008FF0'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }, {
            // name: '实际出港航班',
            type: 'line',
            smooth: true,
            showSymbol: true,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 5,
            data: chartsData.actual,
            //          areaStyle: {
            //              normal: {
            //                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //                      offset: 0,
            //                      color: 'rgba(216, 244, 247,1)'
            //                  }, {
            //                      offset: 0.5,
            //                      color: 'rgba(216, 244, 247,0.6)'
            //                  }, {
            //                      offset: 1,
            //                      color: 'rgba(255, 255, 255,0.1)'
            //                  }], false)
            //              }
            //          },
            itemStyle: {
                normal: {
                    color: '#1DBD87',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            itemStyle: {
                normal: {
                    color: '#1DBD87'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            }
        }]
    };

    if(eleId == 'jingang') {
          flightOptions.series[0].name = '计划进港航班';
          flightOptions.series[1].name = '实际进港航班';
        //用两个对象分别渲染两个列表  解决下载、更新、退出登录时只显示一个图表的问题 
        flightChart1.setOption(flightOptions);
    } else if(eleId == 'chugang') {
          flightOptions.series[0].name = '计划出港航班';
          flightOptions.series[1].name = '实际出港航班';
        flightChart2.setOption(flightOptions);
    }
};