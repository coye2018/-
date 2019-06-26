var dpr = Math.round(window.devicePixelRatio);
var icon_point = 'res://map/point@'+dpr+'x.png';
var bubble_image='res://map/bubble@'+dpr+'x.png';

(function($) {
    
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(13);
    });
    
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {      
        //获取值班表页面传递过来的参数                
        var queryParams=JSON.parse(appcan.locStorage.getVal("dutyQueryParams"));
        var queryUsercode=queryParams.queryUsercode;
        var queryUserName=queryParams.queryUserName;
       //从百度鹰眼获取数据
        getLastestPositionFromBaidu(queryUsercode,queryUserName);
        
        //点击标注的回调
        uexBaiduMap.onMarkerClickListener = function(data){            
            uexBaiduMap.showBubble(data);            
        };
        // uexBaiduMap.onSDKReceiverError = function(data){
            // alert(JSON.stringify(data));
        // }
        //console.log(data);
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
        /*
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
                    appcan.window.close(1); 
                }*/
        
        
        
    });
    
})($);

/**
 * 根据用户的userCode查询他最近的位置
 * 
 * @param {String} userCode:要查询的userCode
 */
function getLastestPositionFromBaidu(userCode,userName){
    //userCode="13902261967";
    //纠偏选项，分别为：绑路、抽稀、降噪、交通方式、精度
    var param="http://yingyan.baidu.com/api/v3/entity/list?service_id=118934&ak=b7cObkcgf54RyEXHrz9k2uvkfErRs8Du&coord_type_output=bd09ll&filter=entity_names:"+userCode;
    //var processOption='need_mapmatch=0,need_vacuate=1,need_denoise=1,transport_mode=walking,radius_threshold=100';
    /*
    var param="http://yingyan.baidu.com/api/v3/track/getlatestpoint?service_id=118934&"
                   +"entity_name="+userCode+"&" 
                   +"process_option="+processOption+"&"               
                   +"ak=b7cObkcgf54RyEXHrz9k2uvkfErRs8Du&"
                   +"coord_type_output=bd09ll";*/
    
    appcan.request.ajax({
        url:param,
        type:"get",
        data:{},
        dataType:"json",
        cache:false,
        success:function(data){
             //请求成功   
             if(data.status==0){
                 var dateCopy=data.entities[0].latest_location;
                 var bdLong = dateCopy.longitude,
                     bdLati = dateCopy.latitude,
                     createTime=dateCopy.loc_time,
                     radius=Math.round(dateCopy.radius);
                
                //如果获取的是（0，0）说明是无效数据，给予用户提示
                if(bdLong==0||bdLati==0){
                    layerToast("对不起，获取到的位置信息无效，请您稍后重试！",2);
                    //uexBaiduMap.showMap(); 
                    return;
                } 
                
                showPositionInBaiduMap(bdLati,bdLong,createTime,userName,radius);                                         
                 
         }else{
             layerToast("对不起，获取定位信息时出错:"+data.message,2);
             return;
         } 
             
       },error:function(){
           layerToast("对不起，获取定位信息时出错:",2);
      }
    });
}

/**
 *打开百度地图，将定位信息展示在地图上 
 * @param {Object} lat：经度
 * @param {Object} lon：纬度
 * @param {Object} createTime：上传时间
 * @param {Object} userName：值班人姓名
 */
function showPositionInBaiduMap(lat,lon,createTime,userName,radius){
    // // 正则表达式匹配文字换行符
    // var textRegN = new RegExp("\\n", "g");
    // var textRegR = new RegExp("\\r", "g");
    // alert(lat+" "+lon+" "+createTime+" "+userName);
    var t = parseInt($('#Header').height());
    var w = parseInt($(window).width());
    var h = parseInt($(window).height());
    uexBaiduMap.open(0, t, w, h-t, 113.310788, 23.392228, function(){
        //设置地图类型
        uexBaiduMap.setMapType(1);
        uexBaiduMap.setTrafficEnabled(1);
        //uexBaiduMap.setBaseIndoorMapEnabled(1);
        //把定位点设置为地图的中心
        uexBaiduMap.setCenter(lon,lat);
        //设置放大级别
        uexBaiduMap.setZoomLevel(17);
        //定位的标注
        var platForm = appcan.locStorage.getVal('platForm');
        //平台Android、iOS
        var platformName=appcan.widgetOne.getPlatformName();
        if(platformName=="android"){
            var title=userName + '\n' +" 时间：" + timeStemp(createTime, 'MM-dd HH:mm').commonDate + '\n' + "精度：" + radius + "米" + '\n';
        }else{
            var title=userName+"  " + timeStemp(createTime, 'MM-dd HH:mm').commonDate;
        }
        
        var paramLast = [{
            id : "66",
            longitude : lon,
            latitude : lat,
            icon:icon_point,
            bubble : {
                title: title,
                bgImage:bubble_image
            }
        }];
        
        var dataLast = JSON.stringify(paramLast);
        uexBaiduMap.addMarkersOverlay(dataLast);
        uexBaiduMap.showBubble("66");
        uexBaiduMap.showMap();  
     });
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
