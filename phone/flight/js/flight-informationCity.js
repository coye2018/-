var platForm = appcan.locStorage.getVal("platForm");

var vm = new Vue({
    el: '#inforCity',
    data: {
        lists: [],
        className:'delayColor',
        delay:false,
        pic:true,
        nonet:false,
        cancel:false,
        normal:false,
        none:false,
        nothing:false,
    },
    methods: {
       getDataid:function(dataId){
           appcan.locStorage.setVal('dataId',dataId);
           if(platForm == "1"){
               appcan.window.open('flight-numberInfo', 'flight-numberInfo.html', 2);
           }else{
               appcan.window.open({
                   name:'flight-numberInfo',
                   dataType:0,
                   data:'flight-numberInfo.html',
                   aniId:0,
                   type:1024
               });
           }
       },
        changePic:function(list) {
            list.twocharcode="img/gbiac.png";
        }
    },
    created:function(){
        
    }
});

;(function($) {
    // 上下拉加载
    var mescroll = new MeScroll('mescroll', {
        down: {
            auto: false,
            callback: downCallback
        },
        up: {
            use: true,
            auto: true,
            page: {
                num : 0,
                size : 10
            },
            callback: getData
        }
    });
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(-1);
    });
    appcan.ready(function() {
        appcan.window.publish("retCity",123);
        appcan.window.subscribe('flightSearch', function (msg) {   
           vm.flightNum = JSON.parse(msg).flightNumber;
           vm.Times = JSON.parse(msg).time;  
         })
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        appcan.window.subscribe("reloadFlightList",function(msg){
            vm.lists = [];
            mescroll.resetUpScroll(true);
        })
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                var closeArr = ['flight-informationCity'];
                closeArr.forEach(function(name){
                    appcan.window.evaluateScript({
                        name:name,
                        scriptContent:'appcan.window.close(-1);'
                    });
                });
            }
        };
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            var closeArr = ['flight-information'];
                closeArr.forEach(function(name){
                    appcan.window.evaluateScript({
                        name:name,
                        scriptContent:'appcan.window.close(-1);'
                    });
                });
        };
        //ios300ms延时
        FastClick.attach(document.body);
    });


    /*下拉刷新的回调 */
    var num = 1;
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
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
    var starttime = new Date().format("yyyy-MM-dd hh:mm:ss");
    console.log(starttime);

    function downCallback(){

        var citySer = JSON.parse(appcan.locStorage.getVal('citySearch'));
        var size = 10;
        var json={
            path: serverPath + 'focFlightSecondController.do?focGetflightByStatus',
            data:{
                pageStart: (num - 1) * size,
                pageEnd: size,
                starstationcn:citySer.startCity,
                terminalstationcn:citySer.endCity,
                sst:citySer.time,
                dir: -1,
                currentTime: starttime,
                status:1
                // token :json.data.token
            },
            layer: false,
            layerErr: false
        };
        ajaxRequest(json, function (result, e){
            num++;
            if (e == 'success') {
                console.log(result.obj);
                if(isDefine(result.obj)){
                    vm.nonet = false;
                    var listData = result.obj;
                    listData.forEach(function (val, idx) {
                        val.twocharcode = serverPath + "upload/flightIcon/" + val.twocharcode + ".png";
                        if (val.est == null) {
                            val.est = "— —"
                        }
                        if (val.sst == null) {
                            val.sst = "— —"
                        }
                        if (val.craftsite == "") {
                            val.craftsite = "— —"
                        }
                        if (val.abnormalstate == "延误") {
                            val.flightstate = "延误";
                            val.delay = true;
                        } else if (val.abnormalstate == "取消") {
                            val.flightstate = "取消";
                            val.cancel = true;
                        } else if (val.flightstate == "" && val.abnormalstate == "") {
                            val.flightstate = "— —";
                            val.normal = true;
                        }
                        else {
                            val.normal = true;
                        }
                        // arr.unshift(val);
                    });
                    for(var j=0;j<listData.length;j++){
                        var aa=listData[j]
                        vm.lists.unshift(aa);
                    }
                    if (vm.lists.length==0){
                        vm.nothing = true;
                    }else{
                        vm.nothing = false;
                    }
                    vm.nonet = false;
                    console.log(vm.lists.length)
                    mescroll.endSuccess(listData.length);
                    if (vm.lists.length == 0) {
                        vm.nothing = true;
                    }
                } else {
                    mescroll.endErr();
                }

            }
            else {
                mescroll.endErr();
                vm.nonet=true;
            }
            if (vm.lists.length == 0) {
                vm.nothing = true;
            }
        });
    };

    function getData(page){

        var citySer = JSON.parse(appcan.locStorage.getVal('citySearch'));
        if (page.num == 1) {
            vm.lists = [];
        }
        var json={
            path: serverPath + 'focFlightSecondController.do?focGetflightByStatus',
            data:{
                pageStart: (page.num-1)*page.size,
                pageEnd: page.size,
                starstationcn:citySer.startCity,
                terminalstationcn:citySer.endCity,
                sst:citySer.time,
                dir: 1,
                currentTime: starttime,
                status:1
                // token :json.data.token
            },
            layer: false,
            layerErr: false
        };
        ajaxRequest(json, function (result, e){
            if (e == 'success'){
                var listData = result.obj;
                console.log(listData)
                mescroll.endSuccess(listData.length);
                listData.forEach(function (val, idx) {
                    if(val.est == null){
                        val.est="— —"
                    }
                    if(val.craftsite==""){
                        val.craftsite="— —"
                    }
                    val.twocharcode=serverPath+"upload/flightIcon/"+val.twocharcode+".png";
                    if (val.abnormalstate == "延误") {
                        val.flightstate="延误";
                        val.delay=true;
                    }else if(val.abnormalstate == "取消"){
                        val.flightstate="取消";
                        val.cancel=true;
                    }else if(val.flightstate == "" && val.abnormalstate == ""){
                        val.flightstate="— —";
                        val.normal=true;
                    }else{
                        val.normal=true;
                    }
                });
                vm.lists = vm.lists.concat(listData);
                 if(listData.length==0){
                    vm.nothing=true;
                }
            } else {
                mescroll.endErr();
                    vm.nonet=true;
            }
        });
    };
    
    
})($);
