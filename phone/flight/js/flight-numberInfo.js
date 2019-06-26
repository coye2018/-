var platForm = appcan.locStorage.getVal("platForm");
var xTime;
var vm = new Vue({
    el: '#details',
    data: {
        lists: {},
        fishboneData:[],
        isshow:true
    },
    methods: {
		changed:function(){
			// this.$nextTick(function () {
			 //横向鱼骨头进度条
    		//偶数个的标签需要倒置
        	$.each($('.fishbone-arrow'), function(i, n){
        		
		        if(i % 2 == 1){
		            $(this).children().addClass("ub-rev");
		            $(this).children('.fishbone-detail').removeClass("ub-rev");
                    $(this).children('.fishbone-text').removeClass("ub-rev");

		        }
    		});
		    //点击显示弹框
			    $('.fishbone-arrow').click(function(){
			        $(".fishbone-detail").removeClass('show').eq($('.fishbone-arrow').index(this)).addClass("show");
			    })
		    //动态设定容器宽度
		    var arrow = $(".fishbone-arrow");
		    var arrowWid = parseInt(arrow.width()) + parseInt(arrow.css("margin-left")) + parseInt(arrow.css("margin-right"));
		    var arrowLen = arrow.length;
		    $(".fishbone-container").width(arrowWid*arrowLen);
	
		    //定位到当前项
		    var current = $(".done");
		    var curLeft = current.offset().left;
		    var windowW = $(window).width();
		    $(".fishbone").scrollLeft( curLeft - windowW*0.5 + arrowWid*0.5 );
    		// })
    	
		},
        changePic:function(lists) {
            lists.twocharcode="img/gbiac.png";
        }

    },
    created:function(){
        init();
    },
    updated:function(){	
    	this.changed();
    }

});

function init(){
    var fid =appcan.locStorage.getVal('dataId');
    var json={
        path: serverPath + 'focFlightSecondController.do?focGetDetailById',
        data:{
            ffid:fid
            // token :"8a8a8bfa5dcf1734015dcf21e1e30014@*@YKQi2DvQtc0szdTLfBhlg"
        },
         layer: false,
         layerErr: false
    };
    var flightTime = JSON.parse(appcan.locStorage.getVal('flightSearch'));
    ajaxRequest(json, function (result, e){
        if (e == 'success'){
            console.log(result);
               result.obj.forEach(function (val) {
                   // console.log(val)
                   val.twocharcode=serverPath+"upload/flightIcon/"+val.twocharcode+".png";
                   // console.log(val.eat)
               	if(val.gate==""){
                    val.gate="— —"
				}
				if(val.est == null){
                       val.est="- -"
                }
                if(val.craftsite==""){
                    val.craftsite="— —"
                }
                if(val.crafttype==""){
                    val.crafttype="— —"
                }

                if(val.craftno==""){
                    val.craftno="— —"
                }
                if(val.terminal==""){
                    val.terminal="— —"
                }

                if(val.craftsite==""){
                    val.craftsite="— —"
                }
                if(val.set==null){
                    val.set="— —"
                }
                if(val.set2==null){
                    val.set2="— —"
                }
                if(val.sat==null){
                    val.sat="— —"
                }   
                if(val.sst==null){
                    val.sst="- -"
                }
                if(val.eet==null){
                    val.eet="— —"
                }
                if(val.eat==null){
                    val.eat="— —"
                }
                if(val.shareflightno==""){
                    val.shareflightno="— —"
                }
                //判断到达口
                if(val.exits==null){
                    val.exits="— —"
                    $("#xlzp").css("width","40%");
                    $("#ddk").css("width","50%");
                    $("#ddk > span").css("margin-left","10%");
                }else{
                    val.exits=val.exits.toString();
                    var s=val.exits;
                    var str=s.indexOf(",");
                    if(str==-1){
                        $("#xlzp").css("width","40%");
                        $("#ddk").css("width","50%");
                        $("#ddk > span").css("margin-left","10%");
                    }
                }
                if(!isDefine(val.belt)){
                    val.belt="— —"
                }
               	//判断进出港
               	if(val.isoffin=="A"){
                	// console.log(val.isoffin);
					$("#plan").html("进港");
					$("#flightTime").html("航班时刻-本站降落");
                    $("#timeOne").html(val.est);
                    $("#timeTwo").html(val.eet);
                    $("#timeThree").html(val.eat);
				}else if(val.isoffin=="D"){
                    $("#flightTime").html("航班时刻-本站起飞");
                    $("#plan").html("出港");
					$("#timeOne").html(val.sst);
                    $("#timeTwo").html(val.set2);
                    $("#timeThree").html(val.sat);
				}
               	//判断异常
               	if(val.abnormalstate=="延误"){
					$("#deLay").html("延误");
                    $("#deLay").css("color","#ffa603");
				}else if(val.abnormalstate=="取消"){
                    $("#deLay").html("取消");
                    $("#deLay").css("color","#ff7d7e");
				}else{
                    $("#deLay").html("— —");
				}
               	//判断航班日期
                   // var xTime=appcan.locStorage.getVal("xDate");
                   // alert(xTime)
                   // $("#data1").html(xTime);
                   var FId = fid.substr(fid.indexOf("-",fid.indexOf("-")+1) + 1,8)
                   var ydate=FId.substr(0,4);
                   var ymouse=FId.substr(4,2);
                   var yday=FId.substr(6,2);
                   var flightDate =ydate+'-'+ymouse+'-'+yday;
                   $("#data1").html(flightDate);
               	// if(flightTime.num==1){

				// }else{
                 //    $("#data1").html(flightTime.time2);
				// }
                vm.lists=val;
                var fishData=JSON.parse(val.dyndispatch);
                if(!isDefine(fishData)){
                    vm.isshow=false;
                }
             	fishData.forEach(function(val){
             		val.sst=vm.lists.sst;
                    val.est=vm.lists.est;
                    val.eat=vm.lists.eat;
             		if($.trim(val.rstt)==""&&$.trim(val.estt)!==""){
             			val.rstt="--";
             			val.estt=val.estt.substr(11,5);
             		}else if($.trim(val.estt)==""&&$.trim(val.rstt)!==""){
             			val.estt="--";
             			val.rstt=val.rstt.substr(11,5);
             		}else if($.trim(val.rstt)==""&&$.trim(val.estt)==""){
             			val.rstt="--";
             			val.estt="--";
             		}
             		else{
	             		val.rstt=val.rstt.substr(11,5);
	                    val.estt=val.estt.substr(11,5);  
             		}
             	})
             vm.fishboneData=fishData;
            })
        }
    });
}
(function($) {
    appcan.ready(function(){
        document.getElementsByTagName('body')[0].scrollTop = 0;
        // init();
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.window.publish("reloadFlightList", "reloadFlightList");
                appcan.window.close(1);
            }
        };
        var platFormC = appcan.locStorage.getVal("platForm");
        var isSupport = true;
        if (platFormC == "1") {
            isSupport = false;
        }
        var paramClose = {
            isSupport: isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function() {
                appcan.window.publish("reloadFlightList", "reloadFlightList");
                appcan.window.close(1);
            }
    });
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.publish("reloadFlightList", "reloadFlightList");
        appcan.window.close(1);
    });
})($)
