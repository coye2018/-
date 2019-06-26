//用户code
var userCode =appcan.locStorage.getVal("userCode");
//用来保存上传失败轨迹点的数据库
var db;
//定义gps弹出框是否打开过，默认为0表示未打开。
var hasOpenGpsConfirm=0;
var nowTime;
//一分钟百度连续定位回调次数。
var locationIndex=0;
//所有在一分钟之内的点数据。
var alllo="";
/**
 * 执行百度地图的初始化工作，如果用户需要上传位置信息，则启动百度地图开始后台上传轨迹，否则就什么也不做
 * 
 * @param 无参数
 * @return 无返回值
 *
 */
 //记录上一次上传到服务器的数据，用于去重
 var lastLocationData;
 var lastLocationTime;
 var interval;
function initUexBaiduMap(){
   
   // alert("enter initUexBaiduMap function");    
    //判断用户是否需要上传位置信息,如果不需要则直接返回
    if(!isNeedUploadLocation()){
        return;
    }else{
        
        //首先先处理用户是否打开GPS的问题
        
        handleGPSSetting();
                
        //打开百度地图并开始连续定位，打开后立即隐藏地图，在后台连续定位即可，中心点坐标随便写的，后续要优化，直接定位到白云机场
        uexBaiduMap.open(0,2, 2, 2,"116.309","39.977", function(){
              uexBaiduMap.startLocation();
              uexBaiduMap.hideMap();
        });
        
        //创建数据库
        creatDatebase();
        //每隔1分钟就检查下数据库，满足一定数量就上传失败轨迹点到百度鹰眼服务器
        setInterval(queryAllFailPoints,60000);
        //每隔1分钟就检查下上传到百度鹰眼服务器上的数据，如果鹰眼返回的数据超过3分钟，则重新启动百度的连续定位。
        setInterval(getComparePositionFromBaidu,60000);
        //每隔1分钟检查GPS是否开启。
        interval=setInterval(handleGPSSetting,60000);
        
    } 
         

     //开启百度地图连续定位后的回调函数
     uexBaiduMap.onReceiveLocation = function(data){
            //如果用户未登录，直接返回,不执行任何操作
            if(!isDefine(userCode)){
                return ;
            }
            
            var ads=JSON.parse(data);
            //增加在轨迹点后面增加一位小数
            // var lo= Math.ceil(Math.random()*100)*0.0000001;
            // var la= Math.ceil(Math.random()*100)*0.0000001;
            // ads.latitude = Number(ads.latitude)+Number(la);
            // ads.longitude= Number(ads.longitude)+Number(lo);
            // alert(data);
            
            locationIndex++;
            //信号强度
            //var acccuracy=ads.acccuracy;
            //精度
            var radius=ads.radius;
                nowTime=new Date().getTime();                    
            var now=new Date().getTime();
            var isRoleCode = appcan.locStorage.getVal("roleCode");
            //如果lastLocationData没有值，说明是第一次进来，如果有登录就上传位置点 则直接上传
            if(!isDefine(lastLocationData)){
                 if(isRoleCode == 'xxyw'){
                     //判断运维角色，存轨迹到数据库
                     ajaxYunweiPosition(ads.longitude,ads.latitude,radius);
                     lastLocationData=ads;                                    
                     lastLocationTime=now;
                 }else{
                    uploadLocToBaidu(ads.longitude,ads.latitude,radius);
                    lastLocationData=ads;                                    
                    lastLocationTime=now;
                 }
             
            }else{//如果lastLocationData有值，说明不是第一次进来， 则判断本次数据是否与上次一样，不一样才上传
                //首先判断本次数据是否与上次一样
               if(lastLocationData.latitude!=ads.latitude&&lastLocationData.longitude!=ads.longitude){
                   //然后判断这个点与上个点的距离和时间，来确定是不是噪点
                   var distance=uexBaiduMap.getDistance(lastLocationData.latitude,lastLocationData.longitude,ads.latitude,ads.longitude);
                   var timeGap=parseInt(now-lastLocationTime/1000);
                   //appcan.window.openToast( "两点之间的速度："+parseInt(distance/timeGap)+"  传感器速度："+nowSpeed,'1000');
                   //就算开车，车速也不可能超过100km/h,也就是30m/s
                   if(parseInt(distance/timeGap)<=30){
                       if(isRoleCode == 'xxyw'){
                         lastLocationData=ads;                                    
                         lastLocationTime=now;
                         //判断运维角色，存轨迹到数据库
                         ajaxYunweiPosition(ads.longitude,ads.latitude,radius);
                       }else{
                           lastLocationData=ads;
                           lastLocationTime=now;
                           uploadLocToBaidu(ads.longitude,ads.latitude,radius); 
                       }                       
                   }  
                }  
            }
            if(isRoleCode == 'xxyw'){
            }else{
                ajaxAllPositionLog(ads.longitude,ads.latitude,ads.radius);
            }    
    
    };
}

/**
 * 判断用户是否需要上传位置信息
 * 
 * @param 无参数
 * @return {boolean} true:需要上传  false:不需要上传
 */
function isNeedUploadLocation(){
    //重新获取帐号，以保证第一次登录时能获取到帐号信息。
    userCode =appcan.locStorage.getVal("userCode");
    //如果用户未登录，直接返回false
    if(!isDefine(userCode)){
        return false;
    }
    //如果是值班账号，则直接返回true
    var isDutyAccount = appcan.locStorage.getVal("isDutyAccount");
    if(isDutyAccount=="1"){ //0:不是值班账号  1：是值班账号
        return true;
    }
    //如果是运维角色，则直接返回true
    var isRoleCode = appcan.locStorage.getVal("roleCode");
    if(isRoleCode=="xxyw"){
        return true;
    }
    //如果有其他情况需要上传的情况，请直接在下面写，格式仿照上面值班账号的格式
    
    return false;
}

/**
 * 判断手机是否已经打开GPS，如果已打开则直接返回，否则则跳转到设置页面，提示用户打开GPS
 * 
 * @param 无参数
 * @return 无返回值
 */
function handleGPSSetting(){
    var isLogin=appcan.locStorage.getVal("isLogin");
    //isLogin为true表示登录中。
    if(isLogin=="true"){
        var gpsParams = {
            setting:"GPS"//位置服务功能
        };
        //调用插件的方法，判断用户是否打开了GPS
        uexDevice.isFunctionEnable(JSON.stringify(gpsParams), function(data) {
           if (data) {
               //说明已经打开了GPS,则什么也不做，直接返回
               return;
           }else{
               //说明没有打开GPS，此时要提醒用户打开
               //设置gps弹出框是否打开过，hasOpenGpsConfirm值为1时是打开过弹出框状态，0为未打开过
               if(hasOpenGpsConfirm==0){
                   //hasOpenGpsConfirm 为1的时候表示弹出框是打开状态。
                   hasOpenGpsConfirm=1;
                   appcan.window.confirm({
                         title:'警告提示',
                         content:'检测到您未打开GPS，请您打开并重新登录，否则会影响到您正常的轨迹上传！',
                         buttons:['确定','取消'],
                         callback:function(err,data,dataType,optId){
                             //用户点击了确定，那么就跳转到手机的GPS设置功能里面，这时候弹出框已经消失则把这个hasOpenGpsConfirm值至为0.
                             hasOpenGpsConfirm=0;
                             if(data==0){                           
                                 uexDevice.openSetting(JSON.stringify(gpsParams));
                             }
                             
                         }
                     });
               }
           }
        });
    }else{
       //clearInterval(interval); 
    }
}


/**
 * 上传单个位置信息到百度鹰眼
 * 
 * @param {Object} lon:纬度
 * @param {Object} lat:经度
 * @param {Object} radius:精度
 * 
 * @return 无返回值
 */
function uploadLocToBaidu(lon,lat,radius){
    //如果经纬度都是0说明用户GPS未打开或者没有对APP放开权限，此时直接返回
    if(lon=="0"||lat=="0"){
        return;
    }else{
        var upTime=parseInt(new Date().getTime()/1000);
       
        appcan.request.ajax({
            url:"http://yingyan.baidu.com/api/v3/track/addpoint",
            type: "POST",
            data: {
                "ak":"b7cObkcgf54RyEXHrz9k2uvkfErRs8Du",
                "service_id":"118934",
                "entity_name":userCode,
                "latitude":lat,
                "longitude":lon,
                "loc_time":upTime,
                "coord_type_input":"bd09ll",
                "radius":radius
            },
            dataType: 'application/json',
            timeout:15000,
            success: function(data) {
                var returnJSON=JSON.parse(data);
                //返回状态为0表示添加成功
                if(returnJSON.status==0){
                    return;
                }
                
            },
            error: function(err, e, errMsg, error) {
                //如果上传失败，那么就将发送失败的点存入到数据库表pointList表中
                var insert="insert into pointList(loc_time,longitude,latitude,radius,coord_type_input,entity_name) values("+upTime+",'"+lon+"','"+lat+"','"+radius+"','bd09ll','"+userCode+"')";
                /*
                uexDataBaseMgr.transactionEx(db,JSON.stringify(insert), function(error) {
                                        alert("transaction result:"+error);
                                });*/
                
                 
                uexDataBaseMgr.sql(db,insert, function(error) {
                                    
                                });
                
            }
        });//end AJAX
       
   }//end else
}

/**
 * 批量上传位置信息到百度鹰眼，每次最多只能传100个
 * 
 * @param {Array} failPoints: 上传失败点的数组
 * 
 * @return 无返回值
 */
function uploadFailLocsToBaidu(failPoints){
    
    //如果没有数据则直接返回
    if(failPoints.length<=0){
        return;
    }else{       
        appcan.request.ajax({
            url:"http://yingyan.baidu.com/api/v3/track/addpoints",
            type: "POST",
            data: {
                "ak":"b7cObkcgf54RyEXHrz9k2uvkfErRs8Du",
                "service_id":"118934",
                "point_list":JSON.stringify(failPoints)               
            },
            dataType: 'application/json',
            timeout:15000,
            success: function(data) {
                
                var returnJSON=JSON.parse(data);
                //返回状态为0表示上传成功，此时要删除数据库里保存的数据
                if(returnJSON.status==0){
                    //console.info("本次成功上传位置信息个数为"+returnJSON.success_num);
                    deletePoints(failPoints);
                }
            },
            error: function(err, e, errMsg, error) {
                //如果上传失败，那么目前什么也不做，直接返回
                return;
                
            }
        });//end AJAX
       
   }//end else
}

/**
 * 创建客户端数据库databasePoints 创建表pointList，字段为鹰眼所需要的字段,用来保存上传失败的轨迹点
 * 字段如下：  loc_time;entity_name;latitude;longitude;coord_type_input;radius
 * 
 * @param 无参数
 * @return 无返回值
 */
function creatDatebase(){
    db = uexDataBaseMgr.open("uexDB");//databasePoints
    //如果打开数据库失败则直接返回
    if(!db){
      return;
    }
    var sql = "CREATE TABLE pointList (loc_time  INTEGER PRIMARY KEY,entity_name TEXT,latitude TEXT,longitude TEXT,coord_type_input TEXT,radius TEXT)";
    uexDataBaseMgr.sql(db,sql, function(error) {
        if (!error) {
            return;
        }else{
            return;
        }
    });
                
}

/**
 * 查出来数据库里保存的所有上传失败的点，每次最多取100个，因为鹰眼一次最多只能添加100个点
 * 
 * @param 无参数
 * @return 无返回值
 */        
function queryAllFailPoints(){
    var selectSql = "SELECT  * FROM pointList ";
    uexDataBaseMgr.select(db,selectSql, function (error,data) {
        if (error) {
            return;
        }else {
            //如果查询不到数据，那么直接返回
            if(data.length<=0){
                return;
            }
            var templist = new Array();
            //百度鹰眼每次最多只能传100个点，所以不管查出来多少点，每次最多只取100个上传
            var loopCount=data.length>100?100:data.length;
          
            for(var i=0; i < loopCount ; i++){
                 templist.push(transferPoint(data[i]));                
            }
            //调用百度鹰眼批量上传位置信息接口上传数据
             uploadFailLocsToBaidu(templist);            
        }
    });
} 

/**
 * 将数据库查出来的数据转化为百度鹰眼需要的点的数据格式
 * 
 * @param {Object} tag:数据库查出来的点的数据
 * @return {Object} point:百度鹰眼需要的JSON数据格式
 */   
function transferPoint(tag){
    var point= new Object();
    point.entity_name = tag.entity_name;
    point.loc_time = Number(tag.loc_time);
    point.latitude = Number(tag.latitude);
    point.longitude = Number(tag.longitude);
    point.coord_type_input = tag.coord_type_input;
    point.radius = Number(tag.radius);
    
    return point;    
}       

/**
 * 删除数据库中已经成功上传的位置信息
 * 
 * @param {Object} tags:成功上传的位置信息数组
 * @return 无返回值
 */ 
function deletePoints(tags){
    for(var i = 0; i < tags.length; i++){
        var deleteSql="delete from pointList where loc_time="+tags[i].loc_time+"";
        uexDataBaseMgr.sql(db,deleteSql, function(error) {
        });
    }
    
}
/**
 * 根据用户的userCode查询他最近的位置,大于3分钟，则在3分钟中之内没有上传轨迹点。重新启动百度连续定位。
 * 
 * @param {String} userCode:要查询的userCode
 */
function getLastestPositionFromBaidu(){
    //userCode="13902261967";
    //纠偏选项，分别为：绑路、抽稀、降噪、交通方式、精度
    var processOption='need_mapmatch=0,need_vacuate=1,need_denoise=1,transport_mode=walking,radius_threshold=100';
    var param="http://yingyan.baidu.com/api/v3/track/getlatestpoint?service_id=118934&"
               +"entity_name="+userCode+"&" 
               +"process_option="+processOption+"&"               
               +"ak=b7cObkcgf54RyEXHrz9k2uvkfErRs8Du&"
               +"coord_type_output=bd09ll";
    appcan.request.ajax({
        url:param,
        type:"get",
        data:{},
        dataType:"json",
        cache:false,
        success:function(data){
             //请求成功   
         if(data.status==0){
                 var dateCopy=data.latest_point;
                 var bdLong = dateCopy.longitude,
                     bdLati = dateCopy.latitude,
                     createTime=dateCopy.loc_time;
                 var nowDate=new Date();
                 var milliSecond=nowDate.getTime();
                 //大于3分钟，则在3分钟中之内没有上传轨迹点。重新启动百度连续定位。
                 if((milliSecond-createTime*1000)>3*60*1000){
                     uexBaiduMap.stopLocation();
                     uexBaiduMap.startLocation();
                 }
         }else{
         } 
       },error:function(){
      }
    });
}
/**
 * 根据用户的定位的最后时间lastLocationTime跟当前时间做比较,大于3分钟，则在3分钟中之内没有上传轨迹点。重新启动百度连续定位。
 * 
 * 
 */
function getComparePositionFromBaidu(){
     var nowDate=new Date();
     var milliSecond=nowDate.getTime();
     if(isDefine(lastLocationTime)){
         //大于3分钟，则在3分钟中之内没有上传轨迹点。重新打开百度地图启动百度连续定位。
         if((milliSecond-nowTime)>3*60*1000){
             //uexBaiduMap.close();
             setTimeout(function(){
                 //打开百度地图并开始连续定位，打开后立即隐藏地图，在后台连续定位即可，中心点坐标随便写的，后续要优化，直接定位到白云机场
                
                /*
                uexBaiduMap.open(0,2, 2, 2,"116.309","39.977", function(){
                                                      uexBaiduMap.startLocation();
                                                      uexBaiduMap.hideMap();
                                                });*/
                
                
             },60000);
             //上传日志到系统中
             ajaxPositionLog(milliSecond);
         }
     }
}
/**
 *  上传日志到系统中，可记录用户于什么时间重启过百度连续定位。
 * @param {Object} milliSecond 最后执行重启百度连续定位时间。
 */
function ajaxPositionLog(milliSecond){
    //这个是获取app的信息，其中有版本号
    var appInfo = uexWidgetOne.getCurrentWidgetInfo();
    var version;
    if(!isDefine(appInfo)){
        version="01.00.0002";
    }else{
        version=appInfo.version;
    }
    //平台Android、iOS
    var platformName=appcan.widgetOne.getPlatformName();
    var platForm;
    if(platformName=="android"){
        platForm=1;
    }else{
        platForm=0;
    }
    var content="用户帐号："+userCode+",用户真实姓名："+ appcan.locStorage.getVal("userName")+"于"+timeStemp(milliSecond,'yyyy-MM-dd HH:mm:ss').date+"重启过百度连续定位";
    var json={
        path:serverPath+'focApplogController.do?focDoAdd',
        data:{
            'type':0,
            'content':content,
            'platform':platForm,
            'version':version
        },
        layer: false,
        layerErr:false
    }
    ajaxRequest(json,function(data,e){
    })
}
/**
 *存储所有轨迹点 
 */
function ajaxAllPositionLog(lo,la,radius){
    //存储所有轨迹点
    userCode =appcan.locStorage.getVal("userCode");
    var content="用户帐号："+userCode+",用户真实姓名："+ appcan.locStorage.getVal("userName");
    var json={
        path:serverPath+'focTrajectoryPointController.do?focDoAdd',
        data:{
            'lo':lo,
            'la':la,
            'radius':radius,
            'content':content,
            'realname':appcan.locStorage.getVal("userName")
        },
        layer: false,
        layerErr:false
    }
    ajaxRequest(json,function(data,e){
    })
}
/**
 *存储运维角色轨迹点 
 */
function ajaxYunweiPosition(lo,la,radius){
    var json={
        path:serverPath+'focOperationController.do?focSaveOperaionPostion',
        data:{
            'longitude':lo,
            'latitude':la,
            'radius':radius
        },
        layer: false,
        layerErr:false
    }
    ajaxRequest(json,function(data,e){
    })
}

