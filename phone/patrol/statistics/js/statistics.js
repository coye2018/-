/**
 * Created by issuser on 2017/12/28 0028.
 */
(function($) {
    appcan.button("#nav-left", "btn-act",
        function() {});
    appcan.button("#nav-right", "btn-act",
        function() {});

    appcan.ready(function() {

    });
    var mySwiper = new Swiper ('.swiper-container', {
        //loop: true,
        direction: 'horizontal',
        paginationClickable: true,
        // 分页器
        pagination: '.swiper-pagination'
    });

    var myChart = echarts.init(document.getElementById('inspectNum'));
    var myChart1 = echarts.init(document.getElementById('safeNum'));
    var option = {

        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        xAxis : [
            {
                show:true,
                type : 'category',
                axisLabel:{
                    textStyle:{
                        color:"#333333",//设置字体颜色
                        fontSize:12,//设置字体大小
                    }
                },
                axisTick:{show:false},//坐标轴刻度不显示
                data : ['一月','二月','三月']
            }
        ],
        yAxis : [
            {
                show:true,
                type : 'value',
                position:'right',
                //splitArea : {show : true},//分隔区域
                mix:0,
                max:14,
                interval:2,
                boundaryGap: false,
                //offset:-18,//坐标轴向左移动
                axisLine:{show:false},//坐标轴线不显示
                axisTick:{//坐标轴刻度
                    show:true,
                    length:16,
                    lineStyle:{
                        color:'#e1e1e1',
                        width:1
                    }
                },
                axisLabel:{
                    show:true,
                    //rotate:45,
                    textStyle:{
                        color:'#999',
                        fontSize:10,
                        padding:[0,0,10,-6],
                    }
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        type:'dashed',
                        color: '#e1e1e1',
                        width:1
                    }
                },
            }
        ],
        //animation:false,
        color:['#52a5fe','#9cccfe', '#a6e1fd'],
        series : [
            {
                name:'服务类',
                type:'bar',
                stack: '服务',
                //barWidth:20,
                data:[9, 12, 7]
            },
            {
                name:'安全类',
                type:'bar',
                stack: '安全',
                data:[3, 8, 2]
            },
            {
                name:'设施类',
                type:'bar',
                stack: '设施',
                data:[11, 10, 8]
            },
            {
                //背景颜色
                name:'服务类',
                type:'bar',
                stack: '服务',
                //颜色需要有透明度
                itemStyle: {normal: {color:'rgba(0, 0, 0,0.04)'}},
                data:[100,100,100]
            },
            {
                //背景颜色
                name:'安全类',
                type:'bar',
                stack: '安全',
                //颜色需要有透明度
                itemStyle: {normal: {color:'rgba(0, 0, 0,0.04)'}},
                data:[100,100,100]
            },
            {
                //背景颜色
                name:'设施类',
                type:'bar',
                stack: '设施',
                //颜色需要有透明度
                itemStyle: {normal: {color:'rgba(0, 0, 0,0.04)'}},
                data:[100,100,100]
            },
        ],
        label:{
            normal:{
                show:true,
                position:'top',
                textStyle:{
                    fontSize:20
                }
            }
        }
    };
    myChart.setOption(option);
    var option1 = {
        grid: {
            left: '0%',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                show:true,
                type : 'category',
                axisLabel:{
                    textStyle:{
                        color:"#333333",//设置字体颜色
                        fontSize:12,//设置字体大小
                    }
                },
                axisTick:{show:false},//坐标轴刻度不显示
                data : ['一月','二月','三月','四月','五月','六月']
            }
        ],
        yAxis : [
            {
                show:true,
                type : 'value',
                position:'right',
                //splitArea : {show : true},//分隔区域
                mix:0,
                max:14,
                interval:2,
                boundaryGap: false,
                //offset:-12,//坐标轴向左移动
                axisLine:{show:false},//坐标轴线不显示
                axisTick:{//坐标轴刻度
                    show:true,
                    length:16,
                    lineStyle:{
                        color:'#e1e1e1',
                        width:1
                    }
                },
                axisLabel:{
                    show:true,
                    //rotate:45,
                    textStyle:{
                        color:'#999',
                        fontSize:10,
                        padding:[0,0,10,-6],
                    }
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        type:'dashed',
                        color: '#e1e1e1',
                        width:1
                    }
                },
            }
        ],
        //animation:false,
        color:['#52a5fe','#9cccfe', '#a6e1fd'],
        series : [
            {
                name:'服务类',
                type:'bar',
                stack: '服务',
                //barWidth:20,
                data:[9, 12, 7, 6, 5, 2]
            },
            {
                name:'安全类',
                type:'bar',
                stack: '安全',
                data:[3, 8, 10, 6, 3, 9]
            },
            {
                name:'设施类',
                type:'bar',
                stack: '设施',
                data:[11, 10, 8, 3, 6, 1]
            },
            {
                //背景颜色
                name:'服务类',
                type:'bar',
                stack: '服务',
                //颜色需要有透明度
                itemStyle: {normal: {color:'rgba(0, 0, 0,0.04)'}},
                data:[100,100,100,100,100,100]
            },
            {
                //背景颜色
                name:'安全类',
                type:'bar',
                stack: '安全',
                //颜色需要有透明度
                itemStyle: {normal: {color:'rgba(0, 0, 0,0.04)'}},
                data:[100,100,100,100,100,100]
            },
            {
                //背景颜色
                name:'设施类',
                type:'bar',
                stack: '设施',
                //颜色需要有透明度
                itemStyle: {normal: {color:'rgba(0, 0, 0,0.04)'}},
                data:[100,100,100,100,100,100]
            },
        ],
        label:{
            normal:{
                show:true,
                position:'top',
                textStyle:{
                    fontSize:20
                }
            }
        }
    };
    myChart1.setOption(option1);
    //myChart.showLoading({
    //    text: '正在努力的读取数据中...'
    //});//显示动画
    //myChart.hideLoading();//停止动画
})($);