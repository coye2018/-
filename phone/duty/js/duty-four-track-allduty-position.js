var dpr = window.devicePixelRatio;
var  layIndex=layerLoading();       
// 百度地图API功能
var mp = new BMap.Map("allmap");
mp.centerAndZoom(new BMap.Point(113.310788,23.392228), 19);
//mp.enableScrollWheelZoom();
//mp.highResolutionEnabled();
//mp.enableDoubleClickZoom();
//mp.enablePinchToZoom();
//mp.enableDragging();
// 复杂的自定义覆盖物
function SquareOverlay(point, text, mouseoverText){
    this._point = point;
    this._text = text;
    this._overText = mouseoverText;
}
SquareOverlay.prototype = new BMap.Overlay();
SquareOverlay.prototype.initialize = function(map){
    this._map = map;
    var div = this._div = document.createElement("div");
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    //div.style.backgroundColor = "#EE5D5B";
    //div.style.border = "1px solid #BC3B3A";
    div.style.color = "white";
    //div.style.width = "3em";
    //div.style.height = "3em";
    div.style.width = "2.6667em";
    div.style.height = "4em";
    div.style.backgroundImage = "url(../wgtRes/location.png)";
    div.style.backgroundSize = "100%";
    //div.style.borderRadius = "3em";
    //div.style.padding = "0 0.5em";
    //div.style.lineHeight = "3em";
    div.style.lineHeight = "2.3333em";
    div.style.textAlign = "center";
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "1em";
    var span = this._span = document.createElement("span");
    span.style.fontSize = "0.75em";
    div.appendChild(span);
    span.appendChild(document.createTextNode(this._text));      
    var that = this;
    
    // var arrow = this._arrow = document.createElement("div");
    // arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
    // arrow.style.position = "absolute";
    // arrow.style.width = "11px";
    // arrow.style.height = "10px";
    // arrow.style.top = "33px";
    // arrow.style.left = "12px";
    // arrow.style.overflow = "hidden";
    // div.appendChild(arrow);
    
    /*
    div.onmouseover = function(){
            //this.style.backgroundColor = "#6BADCA";
            //this.style.borderColor = "#0000ff";
            this.getElementsByTagName("span")[0].innerHTML = that._overText;
            //arrow.style.backgroundPosition = "0px -20px";
            this.style.backgroundPosition = "0 -4em";
        }
        div.onmouseout = function(){
            //this.style.backgroundColor = "#EE5D5B";
            //this.style.borderColor = "#BC3B3A";
            this.getElementsByTagName("span")[0].innerHTML = that._text;
            //arrow.style.backgroundPosition = "0px 0px";
            this.style.backgroundPosition = "0 0";
        }*/
    
     
    mp.getPanes().labelPane.appendChild(div);
    
    return div;
}
SquareOverlay.prototype.draw = function(){
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    //this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    //this._div.style.top  = pixel.y - 30 + "px";
    this._div.style.left = pixel.x - parseInt(this._div.style.width)*0.5 + "px";
    this._div.style.top  = pixel.y - parseInt(this._div.style.height) + "px";
}

var today=new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
var i=0;
var allOneDutyArray=new Array();
(function($) {
    
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(13);
    });
    
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {      
         openMap();
        
    });
    
})($);
function openMap() {
    var divTop = document.getElementById("Header").offsetHeight;
    var w = screen.availWidth - 20;
    var h = screen.availHeight;
    /*
    var myCompOverlay = new SquareOverlay(new BMap.Point(113.310788,23.392228), "ddsdsds", "dssss");
           mp.addOverlay(myCompOverlay); 
            myCompOverlay = new SquareOverlay(new BMap.Point(113.311788,23.392228), "ddsdsds", "dssss");
           mp.addOverlay(myCompOverlay); 
            myCompOverlay = new SquareOverlay(new BMap.Point(113.312788,23.392228), "ddsdsds", "dssss");
           mp.addOverlay(myCompOverlay); 
            myCompOverlay = new SquareOverlay(new BMap.Point(113.313788,23.392228), "ddsdsds", "dssss");
           mp.addOverlay(myCompOverlay); */
     //appcan.locStorage.setVal("ondutyPhone",JSON.stringify(ondutyPhone1));
       loadPositionLastPoint();
    //loadPositionLastPoint();
    /*
    uexBaiduMap.open(10, divTop, w, h, 113.310788, 23.392228,function(){
        isSetLoc = 1;
        uexBaiduMap.showMap();
    });*/
}

function loadPositionLastPoint(){
    //从缓存中取出所有单位的信息以便查看所有人地理位置所使用。
    
    var ondutyPhone=JSON.parse(appcan.locStorage.getVal("ondutyPhone"));
    
    console.log(ondutyPhone);
    var dutyNameAll="";
    for(var i=0;i<ondutyPhone.length;i++){
        dutyNameAll=dutyNameAll+ondutyPhone[i].dutyNum+",";
    }
    
        dutyNameAll=dutyNameAll.substring(0,dutyNameAll.length-1);
        var url="http://yingyan.baidu.com/api/v3/entity/list?service_id=118934&ak=b7cObkcgf54RyEXHrz9k2uvkfErRs8Du&coord_type_output=bd09ll&filter=entity_names:"+dutyNameAll;
        
        //$.ajaxSettings.async = false;
        //$.ajaxSettings.cache = false; 
    appcan.request.ajax({
        url:url,
        type:"get",
        data:{},
        dataType:"json",
        cache:false,
        success:function(data){
            console.log(data);
            if(data.status==0){
                for (var i=0; i < data.entities.length; i++) {
                     for(var j=0;j<ondutyPhone.length;j++){
                            if(ondutyPhone[j].dutyNum==data.entities[i].entity_name){
                                 var dutyNameShort=ondutyPhone[j].dutyNameShort;
                                 console.log(dutyNameShort);
                                 var myCompOverlay = new SquareOverlay(new BMap.Point(data.entities[i].latest_location.longitude,data.entities[i].latest_location.latitude), dutyNameShort, dutyNameShort);
                                 mp.addOverlay(myCompOverlay);
                                 break;
                            }
                        }
                };
                 
            }
        }    
        });
        layerRemove(layIndex);
        //removeMask();
    
}
 
 
