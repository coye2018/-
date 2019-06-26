 var platForm = appcan.locStorage.getVal("platForm");
 var arr1=[];
 var arr2=[];
 var vm = new Vue({
    el: '#searchFlight',
    data: {
        list:[],
        listCity:[],
        lists:'',
        inputValue:'',
        deadline: {
            time:''
        },
        cityData:{
            cityName1:'广州',
            cityName2:'北京'
        }
    },
    methods: {
       //起始地         
       startCT:function(){
	       	appcan.locStorage.setVal("status",1);
            if(platForm == "1"){
                appcan.window.open('plane_city', 'plane_city.html', 2);
            }else{
                appcan.window.open({
                    name:'plane_city',
                    dataType:0,
                    data:'plane_city.html',
                    aniId:0,
                    type:1024
                });  
            }
            
            
           //国内城市
             appcan.window.subscribe('planceCitySearchWord', function (city) {
             	if(JSON.parse(city).status==1){
             		vm.cityData.cityName1 = JSON.parse(city).cityName;
             	}   
                
             });
            //国外城市
            appcan.window.subscribe('planceCitySearchWord1', function (city) { 
            	if(JSON.parse(city).status==1){  
                	vm.cityData.cityName1= JSON.parse(city).cityName;
               }
             });    
            
        },
        //目的地         
        endCT:function(){
        	appcan.locStorage.setVal("status",2);
            if(platForm == "1"){
                appcan.window.open('plane_city', 'plane_city.html', 2);
            }else{
                appcan.window.open({
                    name:'plane_city',
                    dataType:0,
                    data:'plane_city.html',
                    aniId:0,
                    type:1024
                });  
            }
             //国内
            appcan.window.subscribe('planceCitySearchWord', function (city) { 
            	if(JSON.parse(city).status==2){
             		vm.cityData.cityName2 = JSON.parse(city).cityName;
             	}    
                 })
            //国外
            appcan.window.subscribe('planceCitySearchWord1', function (city) {   
                    if(JSON.parse(city).status==2){
             		vm.cityData.cityName2 = JSON.parse(city).cityName;
             	}   
                 })
                },
        pickTime:function () {
            var platForm = appcan.locStorage.getVal("platForm");
            if(platForm == "1"){
                appcan.window.open('flight-date', 'flight-date.html', 2);
            }else{
                appcan.window.open({
                    name:'flight-date',
                    dataType:0,
                    data:'flight-date.html',
                    aniId:0,
                    type:1024
                });
            }


        },
        //航班查询
        newFlight_search:function(){

            var search_value=$("#flightNum").val();
            var len=5
            if(search_value==""){
                layerToast('航班号不能为空',2);
                return false;
            }else{
                if (vm.list.length!==0){
                    if(vm.list.length<len){
                        var d =JSON.parse(appcan.locStorage.getVal('arr'));
                        for (var i=0;i<d.length;i++){
                            if (d[i]==search_value){
                                d.splice(i,1)
                                // d.unshift(search_value)
                                appcan.locStorage.setVal('arr',d);
                                vm.list=d
                            }
                        }
                        d.unshift(search_value);
                        appcan.locStorage.setVal('arr',d);
                        vm.list=d
                    }else{
                        var dd =JSON.parse(appcan.locStorage.getVal('arr'));
                        for (var i=0;i<dd.length;i++){
                            if (dd[i]==search_value){
                                vm.lists=0;
                                dd.splice(i,1)
                                appcan.locStorage.setVal('arr',dd);
                                vm.list=dd
                            }
                        }
                        dd.unshift(search_value);
                        if (vm.lists !== 0){
                            dd.pop();
                        }
                        appcan.locStorage.setVal('arr',dd);
                        vm.list=dd
                    }
                }else {
                    arr1.unshift(search_value);
                    appcan.locStorage.setVal('arr',arr1);
                    vm.list=arr1
                }
            }

            // this.inputValue='';
            var flightNum=$("#flightNum").val();
            var startTime=vm.deadline.time;

            if(appcan.trim(flightNum)==""){
            layerToast('航班号不能为空',2);
            return false;
            }
            if(appcan.trim(startTime)==""){
            layerToast('日期不能为空',2);
            return false;
            }
            noClick($('li'));
            appcan.locStorage.setVal('flightSearch', JSON.stringify({
                    "flightNumber":flightNum,
                    "time":startTime,
                    "num":1
                }));
            //打开航班信息
            if(platForm == "1"){
                appcan.window.open('flight-information', 'flight-information.html', 2);
            }else{
                appcan.window.open({
                    name:'flight-information',
                    dataType:0,
                    data:'flight-information.html',
                    aniId:0,
                    type:1024
                });  
            }  
           },
        //城市查询            
        newCity_search:function(){
            // var flightNum=$("#flightNum").val();
            var startTime=vm.deadline.time;
            appcan.locStorage.setVal('flightSearch', JSON.stringify({
                "time2":startTime,
                "num":2
            }));
            //获取城市             
            var startAddress=vm.cityData.cityName1;
            var endAddress=vm.cityData.cityName2;
            var sTime=vm.deadline.time;

            var search_city=(startAddress+'----'+endAddress);
            // alert(search_value)
            var len=5;
                if (vm.listCity.length!==0){
                    if(vm.listCity.length<len){
                        var dc =JSON.parse(appcan.locStorage.getVal('arrCity'));
                        for (var i=0;i<dc.length;i++){
                            if (dc[i]==search_city){
                                dc.splice(i,1)
                                // d.unshift(search_value)
                                appcan.locStorage.setVal('arrCity',dc);
                                vm.listCity=dc
                            }
                        }
                        dc.unshift(search_city);
                        appcan.locStorage.setVal('arrCity',dc);
                        vm.listCity=dc
                    }else{
                        var ddc =JSON.parse(appcan.locStorage.getVal('arrCity'));
                        for (var i=0;i<ddc.length;i++){
                            if (ddc[i]==search_city){
                                vm.lists=0;
                                ddc.splice(i,1)
                                appcan.locStorage.setVal('arrCity',ddc);
                                vm.listCity=ddc
                            }
                        }
                        ddc.unshift(search_city);
                        if (vm.lists !== 0){
                            ddc.pop();
                        }
                        appcan.locStorage.setVal('arrCity',ddc);
                        vm.listCity=ddc
                    }
                }else {
                    arr2.unshift(search_city);
                    appcan.locStorage.setVal('arrCity',arr2);
                    vm.listCity=arr2
                }


            if(appcan.trim(startAddress)==""&&appcan.trim(endAddress)==""){
            layerToast('地址不能为空', '2000');
            return false;
            };
            if(startAddress==endAddress){
            layerToast('起始地与目的地相同',2);
            return false;
            };
            if(appcan.trim(sTime)==""){
            layerToast('日期不能为空',2);
            return false;
            };
            
             appcan.locStorage.setVal('citySearch', JSON.stringify({
                    "startCity":startAddress,
                    "endCity":endAddress,
                    "time":sTime
                }));
            //打开航班信息
            if(platForm == "1"){
                appcan.window.open('flight-informationCity', 'flight-informationCity.html', 2);
            }else{
                appcan.window.open({
                    name:'flight-informationCity',
                    dataType:0,
                    data:'flight-informationCity.html',
                    aniId:0,
                    type:1024
                });  
            }
        },
        changeCity:function () {
            var startAddress=vm.cityData.cityName1;
            var endAddress=vm.cityData.cityName2;
            vm.cityData.cityName2=startAddress;
            vm.cityData.cityName1=endAddress;
        }
    }
});


 (function($) {
     //航班号查询
     var b =JSON.parse(appcan.locStorage.getVal('arr'));
     // console.log(b)
     if (isDefine(b)){
         vm.list=b;
     }
     //城市查询
     var bc =JSON.parse(appcan.locStorage.getVal('arrCity'));
     if (isDefine(bc)){
         vm.listCity=bc;
     }
        appcan.ready(function(){
            //航班号查询
            var i;
            var li=$(".search-history-list li");
            for(i=0;i<li.length;i++){
                li[i].onclick = function(){
                    var value=this.innerHTML;
                    $("#flightNum").val(value);
                }
            }
            //城市查询
            var j;
            var lic=$("#city-search li");
            for(j=0;j<lic.length;j++){
                lic[j].onclick = function(){
                    var valC=this.innerHTML;
                    // alert(valC.split("-",1));
                    var CITY=valC.split("----");
                    var city1 = CITY[0];
                    var city2 = CITY[1];
                    vm.cityData.cityName1=city1;
                    vm.cityData.cityName2 =city2;
                    $("#cityNum1").html(vm.cityData.cityName1);
                    $("#cityNum2").html(vm.cityData.cityName2);
                }
            }

            appcan.window.publish("option-click","option-click");

            appcan.window.subscribe('retNum',function (msg) {
                window.location.reload();
            });
            appcan.window.subscribe('retCity',function (msg) {
                window.location.reload();
            });
            appcan.window.subscribe('dada',function (msg) {
                // alert(msg)
                var dataTime=msg;
                vm.deadline.time=dataTime;
            })

        });
	 	appcan.button("#nav-left", "btn-act",
	    function() {
	        appcan.window.close(0);
	    });
	    appcan.button("#nav-right", "btn-act",
	    function() {});
     $('.tab-pill-box').on('click', '.tab-pill-text', function(e){
            var that = $(this),
                idx = that.index(),       
                clsa = 'actives'; 
            that.addClass(clsa).siblings().removeClass(clsa);     
            $(".items").hide().eq(idx).show();
        });
//选择时间         
        pickTime();
     // console.log(appcan.locStorage.getVal("dada"))
     var now = new Date();
     if(parseInt(now.getDate())<10){
         var getDate='0'+now.getDate();
     }else{
         var getDate=now.getDate();
     }
     var nowTime=now.getFullYear()+'-'+parseInt(now.getMonth()+1)+'-'+getDate;
     vm.deadline.time=nowTime;


})($)
function shuaxin() {
    window.location.reload();
}
function pickTime(){
     //时间
     var now = new Date();
    if(parseInt(now.getDate())<10){
       var getDate='0'+now.getDate();
    }else{
         var getDate=now.getDate();
    }
    var nowTime=now.getFullYear()+'-'+parseInt(now.getMonth()+1)+'-'+getDate;

    //
    //
    //  var instance = mobiscroll.date('#picktime', {
    //     lang: 'zh',
    //     theme:'ios',
    //     display: 'bottom',
    //     headerText: '日期选择',
    //     minWidth: 130,
    //     dateFormat: 'yy-mm-dd',
    //     showLabel: true,
    //     onInit: function (evtObj, obj) {
    //     },
    //     onBeforeShow: function (evtObj, obj) {
    //     },
    //     onSet: function (evtObj, obj) {
    //         vm.deadline = {
    //             time: evtObj.valueText
    //         };
    //     }
    // });
    // var instance = mobiscroll.date('#picktime2', {
    //     lang: 'zh',
    //     theme:'ios',
    //     display: 'bottom',
    //     minWidth: 130,
    //     dateFormat: 'yy-mm-dd',
    //     showLabel: true,
    //     onInit: function (evtObj, obj) {
    //     },
    //     onBeforeShow: function (evtObj, obj) {
    //     },
    //     onSet: function (evtObj, obj) {
    //         vm.deadline = {
    //             time: evtObj.valueText
    //         };
    //     }
    // });
}
 //打开日期页面

    // $("#picktime").click(function () {
    //     var platForm = appcan.locStorage.getVal("platForm");
    //     if(platForm == "1"){
    //         appcan.window.open('flight-date', 'flight-date.html', 2);
    //     }else{
    //         appcan.window.open({
    //             name:'flight-date',
    //             dataType:0,
    //             data:'flight-date.html',
    //             aniId:0,
    //             type:1024
    //         });
    //     }
    // })



