//获取值班表页面传递过来的参数                
var queryParams=JSON.parse(appcan.locStorage.getVal("duty-4-place"));
var queryUsercode=queryParams.queryUsercode;
var queryUserName=queryParams.queryUserName;
var queryDutyDate=queryParams.dutyDate;
var changeTime=queryParams.changeTime;
var startTime=queryParams.startTime;
var endTime=queryParams.endTime;
var dpr = Math.round(window.devicePixelRatio);
var icon_start = 'res://map/start@'+dpr+'x.png',
    icon_point = 'res://map/point@'+dpr+'x.png',
    icon_end = 'res://map/end@'+dpr+'x.png';

var vm = new Vue({
    el: '#duty_four_place',
    data: {
        mustPlace: {
            startTime: '--:--',
            endTime: '--:--',
            place: '--'
        }
    },
    methods: {
        changeStatus: function(itm){
            itm.isSee = itm.isSee==2?1:2;
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.locStorage.remove('duty-4-place');
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    
    
    appcan.ready(function() {
        //读取duty-four.html传来的数据，首先渲染页面顶部的数据
        var this_plac = appcan.locStorage.getVal('duty-4-place');
        if(isDefine(this_plac)){
            var place=JSON.parse(this_plac);
            place.startTime=place.startTime.split(":")[0]+":"+place.startTime.split(":")[1];
            place.endTime=place.endTime.split(":")[0]+":"+place.endTime.split(":")[1];
            vm.mustPlace = $.extend({}, place);
        }
        
        //点击气泡时的回调函数
        uexBaiduMap.onMarkerClickListener = function(data){
            uexBaiduMap.hideBubble();
            uexBaiduMap.showBubble(data);
        };
        
        //console.info("place"+this_plac);
        /*首先处理查询的起止时间的问题，值班时间的起止日期应该是值班日期从交接班的时间开始，到
         * 第二天的交接班时间，比如值班日期是2017-8-25，交接班时间是8点，那么值班时间就应该是：
         * 2017-8-25 08：00：00-2017-8-26 08：00：00，四个必配置的时间肯定要落入这个范围
         */
         //值班日期的字符串表示：2017-8-25 
         var dutyDateStr= new Date(queryDutyDate*1000).toDateString();
         //四个必的起始时间
         var startTimeSec=parseInt(new Date(dutyDateStr+" "+startTime).getTime()/1000);
         //四个必的截止时间
         var endTimeSec= parseInt(new Date(dutyDateStr+" "+endTime).getTime()/1000);        
         //值班日期的起始时间
         var dutyStartTime=parseInt(queryDutyDate)+parseInt(changeTime)*60*60; 
         //console.info(startTimeStr+"***"+endTimeStr+"///"+dutyStartTime);
         //如果查询的起始时间比值班的开始时间还要早，说明是跨天了，肯定是第二天的凌晨，此时要加上24小时 
         if(startTimeSec>dutyStartTime){
             startTimeSec=startTimeSec+24*60*60;
         }
         
         getTrackFromBaidu(queryUsercode,queryUserName,startTimeSec,endTimeSec); 
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
             appcan.locStorage.remove('duty-4-place');
             appcan.window.close(1);
        }
    });
    
})($);


/**
 * 从百度鹰眼获取轨迹数据 
 * @param {Object} userCode 值班人用户code
 * @param {Object} userName 值班人用户名
 * @param {Object} startTime 查询的起始时间
 * @param {Object} endTime 查询的起始时间
 */
function getTrackFromBaidu(userCode,userName,startTime,endTime){
    //$("#loading").text("正在从服务器获取轨迹数据，请稍候......");
    //用来保存所有从鹰眼取回来的纠偏过的数据
    var allDataArray=new Array();
    //所有数据的个数
    var allDataLength;
    
    var pageIndex=1;
    //查询轨迹的结束时间
    //var nowTime=parseInt(new Date().getTime()/1000);
    //结束时间不能超过当前时间
    //var endTime=(startTime+24*60*60)>nowTime?nowTime:(startTime+24*60*60);
    
    //由于纠偏时请求的数据不能超过20000个一次，所以首先请求一次不纠偏的数据，获取所有位置点的个数            
    //是否进行纠偏，0为不纠偏，则返回所有原始位置点
    var isProcess=0;
    //纠偏选项，分别为：绑路、抽稀、降噪、交通方式、精度
    var processOption='need_mapmatch=0,need_vacuate=1,need_denoise=1,transport_mode=walking,radius_threshold=100';
    var param="http://yingyan.baidu.com/api/v3/track/gettrack?service_id=118934&"
               +"entity_name="+userCode+"&"
               //+ "start_time="+startTime+"&"
               //+"end_time="+endTime+"&"
               //+"is_processed="+isProcess+"&"
               +"process_option="+processOption+"&"
               +"supplement_mode=walking&"
               +"sort_type=asc&"
               +"ak=b7cObkcgf54RyEXHrz9k2uvkfErRs8Du&"
               +"page_size=5000";
    
    //不缓存数据
    $.ajaxSettings.cache = false;
    //同步请求  
    $.ajaxSettings.async = false;  
    
    //用来标记需要请求几次纠偏数据，不超过20000个原始点则只需要一次，目前来看基本上不会超过两万个一天
    var count=0;   
    
    ///layerIndex=layerLoading();
    $.getJSON(param+"&page_index="+pageIndex+"&start_time="+startTime+"&end_time="+endTime+"&is_processed=0",function(info){
        //如果查询不到数据，则直接返回
        if(info.total==0){
            layerToast("对不起，查询不到位置信息，请稍后重试",2);            
            return;
        }
        //向上取整
        count=Math.ceil(info.total/20000);
        allDataLength=parseInt(info.total);
        //console.log(info);
    });
    
    if(count==0){        
        $("#mapDIV").text("对不起，查询不到该时间段的轨迹信息");
        return;
     }
    
    //由于画线的时候不能超过1万条，所以这里限制最多请求两次，也就是10000个数据，根据实际效果来看一般都不会超过这个数字
    if(count>2){
        layerToast("对不起，您上传的数据太多已经超过40000条，我们将进行稀释",2);
        count=2;
    }
    
    //下面开始请求纠偏数据      
    //每次循环增加的时间差
    var timeGap=parseInt((endTime-startTime)/count);
    var queryStartTime=startTime;
    var queryEndTime=startTime+timeGap;
    
    isProcess=1;
             
    for(var i=1;i<=count;i++){
        $.getJSON(param+"&page_index="+pageIndex+"&start_time="+queryStartTime+"&end_time="+queryEndTime+"&is_processed=1",function(info){
            
            //将每次请求到的数据进行合并
            allDataArray=allDataArray.concat(info.points);
        });
        //重设下次查询的时间改
        queryStartTime=queryEndTime;
        queryEndTime=queryStartTime+timeGap;
    }
    //console.info(allDataArray.length);
    //下面调用百度地图插件开始绘制轨迹
    beginDrawMap(allDataArray);
}

/**
 *开始 画轨迹 
 * @param  {Array} allDataArray:用来保存所有位置点的数组
 * @return 无返回值
 */
function beginDrawMap(allDataArray){
    //$("#loading").text("已经获取到"+allDataArray.length+"条数据，正在进行纠偏，可能会花费几秒钟时间，请耐心等候......");
    //首先用自己写的算法对轨迹点再进行一遍过滤
    //allDataArray=handlePoints(allDataArray);
    
    //console.info(allDataArray);
    //地图的宽度，高度
    var platForm = appcan.locStorage.getVal("platForm");
    var offsetPf = platForm==1?0:16;
    var mapDivHeight = parseInt($("#mapDIV").height()) - offsetPf;
    var w = parseInt($(window).width());
    var h = parseInt($(window).height());
    //获取起点和终点
    var start_point= allDataArray[0];
    var end_point= allDataArray[allDataArray.length-1];
    
    //固定中心点,中心点为最后一个点
    var CENTER_POINT={
            "longitude":end_point.longitude,
            "latitude":end_point.latitude
        };
     $("#loading").hide();   
    //var zoomLevel="15";    
    //打开百度地图，中心点设为固定中心点，固定级别
    uexBaiduMap.open(0, h-mapDivHeight, w, mapDivHeight, CENTER_POINT.longitude, CENTER_POINT.latitude, function(){
           //alert("WTF");   
           //uexBaiduMap.showMap();
           //开始画线，由于数据不可能超过10000个，所以直接调用即可
           drawsOverlayMap(allDataArray,1);
          
           //开始添加标注，最多不超过MAX_POINTS_LIMIT个，如果超过则按比例进行稀释
           var MAX_POINTS_LIMIT=50;
           //如果所有点的个数少于最大限制，则全部添加标注
           if(allDataArray.length<MAX_POINTS_LIMIT){
               for(var i=1;i<allDataArray.length-2;i++){
                   drawMarker("mark"+i,allDataArray[i].longitude,allDataArray[i].latitude,icon_point,Number(allDataArray[i].loc_time));
                   //removeMarkId.push("mark"+i);
               }
               
           }else{//如果所有点的个数大于最大限制，则要按比例进行稀释
              //稀释因子
              var markYz=parseInt(allDataArray.length/MAX_POINTS_LIMIT);
               for(var i=1;i<allDataArray.length-1;i=i+markYz){
                   drawMarker("mark"+i,allDataArray[i].longitude,allDataArray[i].latitude,icon_point,Number(allDataArray[i].loc_time));
                   //removeMarkId.push("mark"+i);
               } 
           }
           //单独画起点和终点
          drawMarker("filst1",start_point.longitude,start_point.latitude,icon_start,Number(start_point.loc_time));
          drawMarker("last1",end_point.longitude,end_point.latitude,icon_end,Number(end_point.loc_time));
          
          //使用完之后清除所有的数组
          allDataArray=new Array();
         
    });
}


/**
 * 根据轨迹点调用百度地图插件的方法画折线
 * @param {Array} pointJsonList 包含所有轨迹点信息的数组
 */
function drawsOverlayMap(pointJsonList){    
    var polylineInfo = {
        fillColor : '#70B6FF',
        id : "15",
        lineWidth : "12.0",
        property : pointJsonList
    };
    
    //iOS上把线宽调小
    var platForm=appcan.locStorage.getVal("platForm");
    //0表示是iOS
    if(platForm=="0"){
        polylineInfo.lineWidth="4.0";
    }
    var jsonStr = JSON.stringify(polylineInfo);
    //画轨迹折线覆盖物。
    uexBaiduMap.addPolylineOverlay(jsonStr);
    //设置放大级别
    uexBaiduMap.setZoomLevel(16);    
}


/**
 * 调用百度地图插件的方法给轨迹点添加标记
 * 
 * @param {Number} i:第i个标记点，用来做ID
 * @param {Number} lo:经度
 * @param {Number} la:纬度
 * @param {Number} iconUrl: 标记的图标
 * @param {Number} t:每个轨迹点的时间
 * 
 */
function drawMarker(i,lo,la,iconUrl,t){
    var param1 = [{
        id : "1000"+i,
        longitude : lo,
        latitude : la,
        icon:iconUrl,
        bubble : {
            title: queryUserName+"\n时间："+ getMyDate(t)
        }
    }];
    
    var data1 = JSON.stringify(param1);
    uexBaiduMap.addMarkersOverlay(data1);
};


/**
 * 对所有点进行过滤，去掉速度超过80km/h的点以及漂移点
 * 漂移点的判断方法是：第i个点与i+1直接的距离远大于i与i+2之间的距离 
 * 
 * @param  {Array} allDataArray:用来保存所有位置点的数组
 * @return {Array}  返回经过处理的数组
 */
function handlePoints(allDataArray){
    
    for(var i=0;i<allDataArray.length-3;i++){        
        var isDelete=false;
        //去掉速度超过80km/h的点
        if(allDataArray[i].speed>80){
            allDataArray.splice(i,1);
            isDelete=true;
        }
        //第i个点与i+1直接的距离远大于i与i+2之间的距离 
        if(getDistance(allDataArray[i],allDataArray[i+1])>getDistance(allDataArray[i],allDataArray[i+2])*10){
            allDataArray.splice(i+1,1);
        }
        //$("#loading").text("正在对数据进行纠偏，已纠偏"+i+"/"+allDataArray.length+",请耐心等候......");       
    }
    return allDataArray;
}


/**
 *  根据两个点的经纬度计算两点之间的距离，使用的是百度地图的算法
 * @param {Object} point1 第一个点
 * @param {Object} point2 第二个点
 * @return {Number} 返回两个点之间的距离
 */
function getDistance(point1,point2){
    
    return uexBaiduMap.getDistance(point1.latitude,point1.longitude,point2.latitude,point2.longitude);
}

/**
 * 把百度地图返回的时间格式调整为只显示时和分，格式为：10：08 
 * @param {Object} str
 */
function getMyDate(str){
                              
    var oDate = new Date(str*1000),  
    oHour = oDate.getHours(),  
    oMin = oDate.getMinutes(),  
    oTime = getzf(oHour) +':'+ getzf(oMin);
    return oTime;
}

 //补0操作  
function getzf(num){  
    if(parseInt(num) < 10){  
        num = '0'+num;  
    }  
    return num;
}