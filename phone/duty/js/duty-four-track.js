//获取值班表页面传递过来的参数                
var queryParams=JSON.parse(appcan.locStorage.getVal("dutyQueryParams"));
var queryUsercode=queryParams.queryUsercode;
var queryUserName=queryParams.queryUserName;
var queryStartTime=queryParams.queryStartTime;

var dpr = Math.round(window.devicePixelRatio);
var icon_start = 'res://map/start@'+dpr+'x.png',
    icon_point = 'res://map/point@'+dpr+'x.png',
    icon_end = 'res://map/end@'+dpr+'x.png';
var bubble_image='res://map/bubble@'+dpr+'x.png';

//遮罩的打开index
var layerIndex;

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(13);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {
        
        //从百度鹰眼获取轨迹点
        getTrackFromBaidu(queryUsercode,queryUserName,queryStartTime);
        //点击标注的回调
        uexBaiduMap.onMarkerClickListener = function(data){            
            uexBaiduMap.showBubble(data);            
        };
        var scrollbox= $.scrollbox($("body")).on("releaseToReload",
        function() { //After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
        }).on("onReloading",
        function(a) { //如果onReloading状态，拖动将触发该事件
        }).on("dragToReload",
        function() {
            
        }).on("draging",
        function(status) { //on draging, this event will be triggered.
        }).on("release",
        function() { //on draging, this event will be triggered.
        }).on("scrollbottom",
        function() { 
            $("#ScrollContent").trigger("more", this);
        }).hide();
    });
    
})($);

/**
 * 从百度鹰眼获取轨迹数据 
 * @param {Object} userCode 值班人用户code
 * @param {Object} userName 值班人用户名
 * @param {Object} startTime 值班的起始时间
 */
function getTrackFromBaidu(userCode,userName,startTime){
    console.log(userCode);
    
    $("#loading").text("正在从服务器获取轨迹数据，请稍候......");
    //用来保存所有从鹰眼取回来的纠偏过的数据
    var allDataArray=new Array();
    //所有数据的个数
    var allDataLength;
    
    var pageIndex=1;
    //查询轨迹的结束时间
    var nowTime=parseInt(new Date().getTime()/1000);
    //结束时间不能超过当前时间
    var endTime=(startTime+24*60*60)>nowTime?nowTime:(startTime+24*60*60);
    //由于纠偏时请求的数据不能超过20000个一次，所以首先请求一次不纠偏的数据，获取所有位置点的个数            
    //是否进行纠偏，0为不纠偏，则返回所有原始位置点
    var isProcess=0;
    //纠偏选项，分别为：绑路、抽稀、降噪、交通方式、精度
    var processOption='need_mapmatch=0,need_vacuate=1,need_denoise=1,transport_mode=walking,radius_threshold=300';
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
        //console.log("userCode"+userCode+" time"+new Date(startTime*1000));
        //console.log(info);
        if(info.total==0){
            layerToast("对不起，查询不到位置信息，请稍后重试",2);            
        }
 
        //向上取整
        count=Math.ceil(info.total/20000);
        allDataLength=parseInt(info.total);
        //console.log(info);
    });
    if(count==0){
            layerToast("对不起，查询不到位置信息，请稍后重试",2);
            $("#loading").text("对不起，查询不到轨迹信息");
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
    $("#loading").text("已经获取到"+allDataArray.length+"条数据，正在进行纠偏，可能会花费几秒钟时间，请耐心等候......");
    //首先用自己写的算法对轨迹点再进行一遍过滤
    allDataArray=handlePoints(allDataArray);
    //alert(JSON.stringify(allDataArray));
    //alert(222);
    
    //console.info(allDataArray);
    //alert(JSON.stringify(allDataArray));
    //alert(allDataArray.length);
    //地图的宽度，高度
    var t = parseInt($('#Header').height());
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
    uexBaiduMap.open(0, t, w, h-t, CENTER_POINT.longitude, CENTER_POINT.latitude, function(){
           uexBaiduMap.showMap();
           //uexBaiduMap.setBaseIndoorMapEnabled(1);
           //开始画线，由于数据不可能超过10000个，所以直接调用即可
           drawsOverlayMap(allDataArray,1);
          
           //开始添加标注，最多不超过MAX_POINTS_LIMIT个，如果超过则按比例进行稀释
           var MAX_POINTS_LIMIT=50;
           var platForm = appcan.locStorage.getVal('platForm');
           //如果所有点的个数少于最大限制，则全部添加标注
           if(allDataArray.length<MAX_POINTS_LIMIT){
               for(var i=1;i<allDataArray.length-2;i++){
                   if(allDataArray[i].hasOwnProperty("isDelete")){
                       continue;
                   }
                   drawMarker("mark"+i,allDataArray[i].longitude,allDataArray[i].latitude,icon_point,Number(allDataArray[i].loc_time),Math.round(allDataArray[i].radius),bubble_image);
                   //removeMarkId.push("mark"+i);
               }
               
           }else{//如果所有点的个数大于最大限制，则要按比例进行稀释
              //稀释因子
              var markYz=parseInt(allDataArray.length/MAX_POINTS_LIMIT);
               for(var i=1;i<allDataArray.length-1;i=i+markYz){
                   if(allDataArray[i].hasOwnProperty("isDelete")){
                       continue;
                   }
                   drawMarker("mark"+i,allDataArray[i].longitude,allDataArray[i].latitude,icon_point,Number(allDataArray[i].loc_time),Math.round(allDataArray[i].radius),bubble_image);
                   //removeMarkId.push("mark"+i);
               } 
           }
           //单独画起点和终点
          drawMarker("filst1",start_point.longitude,start_point.latitude,icon_start,Number(start_point.loc_time),Math.round(start_point.radius),bubble_image);
          drawMarker("last1",end_point.longitude,end_point.latitude,icon_end,Number(end_point.loc_time),Math.round(end_point.radius),bubble_image);
          
          //使用完之后清除所有的数组
          allDataArray=new Array();
         
    });
}


/**
 * 根据轨迹点调用百度地图插件的方法画折线
 * @param {Array} pointJsonList 包含所有轨迹点信息的数组
 */
function drawsOverlayMap(pointJsonList,d){    
    var polylineInfo = {
        fillColor : '#70B6FF',
        id : "15",
        lineWidth : 12.0,
        property : pointJsonList
    };
    var platForm=appcan.locStorage.getVal("platForm");
    //IOS
    if(platForm=="0"){
        polylineInfo.lineWidth=4.0;
    }
    uexBaiduMap.setZoomLevel(16);    
    var jsonStr = JSON.stringify(polylineInfo);
    //画轨迹折线覆盖物。
    var id=uexBaiduMap.addPolylineOverlay(jsonStr);
    if(!id){
            alert("添加失败");
        }
    //设置放大级别
    
}


/**
 * 调用百度地图插件的方法给轨迹点添加标记
 * 
 * @param {Number} i:第i个标记点，用来做ID
 * @param {Number} lo:经度
 * @param {Number} la:纬度
 * @param {Number} iconUrl: 标记的图标
 * @param {Number} t:每个轨迹点的时间
 * @param {Number} bg:背景图片，android没有，ios有
 */
function drawMarker(i,lo,la,iconUrl,t,rad,bg){
    var platForm = appcan.locStorage.getVal('platForm');
    //平台Android、iOS
    var platformName=appcan.widgetOne.getPlatformName();
    if(platformName=="android"){
        var title=queryUserName+ '\n' +"时间：" + timeStemp(t, 'MM-dd HH:mm').commonDate + '\n' +"精度："+rad +"米"+ '\n';
    }else{
        var title=queryUserName+"  " + timeStemp(t, 'MM-dd HH:mm').commonDate;
    }
    // var title=queryUserName+"  "+ getMyDate(t);
    var param1 = [{
        id : "1000"+i,
        longitude : lo,
        latitude : la,
        icon:iconUrl,
        bubble : {
            title: title,
            bgImage:bg
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
      var arrIndex=new Array();
        for(var i=0;i<allDataArray.length;i++){        
            var isDelete=false;
            //去掉速度超过80km/h的点
            if(allDataArray[i].speed>80){
                //alert(allDataArray[i].create_time);
                //allDataArray.splice(i,1);
                allDataArray[i].isDelete=true;
                
                isDelete=true;
            }
            //第i个点与i+1直接的距离远大于i与i+2之间的距离 
            /*
            if(getDistance(allDataArray[i],allDataArray[i+1])>getDistance(allDataArray[i],allDataArray[i+2])*10){
                            allDataArray[i+1].isDelete=true;
                            //allDataArray.splice(i+1,1);
                            isDelete=true;
                        }*/
            
            if(allDataArray[i].latitude > 23.434632 || allDataArray[i].latitude < 23.361134 || allDataArray[i].longitude > 113.344599 || allDataArray[i].longitude < 113.290269){
                //alert(allDataArray[i].create_time);
                allDataArray[i].isDelete=true;
                isDelete=true;
                //allDataArray.splice(i,1);
            }
            if(isDelete){
                if(i!=0){
                    arrIndex.push(i);
                }
                
            }
            //$("#loading").text("正在对数据进行纠偏，已纠偏"+i+"/"+allDataArray.length+",请耐心等候......");       
         }
         //从后面向前删除数组元素
         for (var i=arrIndex.length-1; i >=0; i--) {
                   allDataArray.splice(arrIndex[i],1);
         };
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
    oMon = oDate.getMonth(),
    oDat = oDate.getDate(), 
    oTime = getmo(oMon) + '-' + getzf(oDat) + ' ' + getzf(oHour) +':'+ getzf(oMin);
    return oTime;
}
function getMyDate1(str){
                              
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
//月份操作
function getmo(num){
   var num1 = parseInt(num)+1;
    if(parseInt(num1) < 10){  
        num1 = '0'+num1;  
    }  
    return num1;
}