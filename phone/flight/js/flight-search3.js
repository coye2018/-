var platForm = appcan.locStorage.getVal("platForm");

var vm = new Vue({
    el: '#infor',
    data: {
        lists: [],
        className: 'delayColor',
        delay: false,
        nonet: false,
        pic: true,
        cancel: false,
        normal: false,
        none: false,
        flightNum: '',
        Times: '',
        nothing: false,
        pho: false
    },
    methods: {
        getDataid: function (dataId) {
            appcan.locStorage.setVal('dataId', dataId);
            if (platForm == "1") {
                appcan.window.open('flight-numberInfo', 'flight-numberInfo.html', 2);
            } else {
                appcan.window.open({
                    name: 'flight-numberInfo',
                    dataType: 0,
                    data: 'flight-numberInfo.html',
                    aniId: 0,
                    type: 1024
                });
            }
        },
        changePic: function (list) {
            list.twocharcode = "img/gbiac.png";
        }
    },
    created: function () {

    }
});

;(function ($) {
    //
    //
    // $('#nav-right').click(function () {
    //     var platForm = appcan.locStorage.getVal("platForm");
    //     var aniId = 0;
    //     //Android
    //     if (platForm == "1") {
    //         appcan.window.open('flight-accurate.html', 'flight-accurate.html', 2);
    //     } else {
    //         appcan.window.open({
    //             name: 'flight-accurate.html',
    //             dataType: 0,
    //             data: 'flight-accurate.html',
    //             aniId: aniId,
    //             type: 1024
    //         });
    //     }
    // })


    // 上下拉加载
    var mescroll = new MeScroll('mescroll', {
        down: {
            auto: false
        },
        up: {
            auto: true,
            page: {
                num: 0,
                size: 10
            },
            callback: getData
        }
    });
    appcan.button("#nav-left", "btn-act", function () {
        appcan.window.close(-1);
    });
    appcan.ready(function () {
        appcan.window.subscribe('flightSearch', function (msg) {
            vm.flightNum = JSON.parse(msg).flightNumber;
            vm.Times = JSON.parse(msg).time;
        })
        appcan.window.subscribe('fontsize', function (msg) {
            quanjuFontsize();
        });
        appcan.window.subscribe("reloadFlightList", function (msg) {
            vm.lists = [];
            mescroll.resetUpScroll(true);
        })
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function (keyCode) {
            if (keyCode == 0) {
                var closeArr = ['flight-search'];
                closeArr.forEach(function (name) {
                    appcan.window.evaluateScript({
                        name: name,
                        scriptContent: 'appcan.window.close(-1);'
                    });
                });
            }
        };
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function () {
            var closeArr = ['flight-search'];
            closeArr.forEach(function (name) {
                appcan.window.evaluateScript({
                    name: name,
                    scriptContent: 'appcan.window.close(-1);'
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
    var ssttime = new Date().format("yyyy-MM-dd");
    appcan.locStorage.setVal('Ssttime',ssttime);
    console.log(ssttime,starttime);

    var flightnum=appcan.locStorage.getVal('flightnum');
    var airLine=appcan.locStorage.getVal('airLine');
    var planeno=appcan.locStorage.getVal('planeno');
    var Model=appcan.locStorage.getVal('Model');
    var gate=appcan.locStorage.getVal('gate');
    var DepartureCity=appcan.locStorage.getVal('DepartureCity');
    var arrivalCity=appcan.locStorage.getVal('arrivalCity');
    console.log(flightnum,airLine,planeno,Model,gate,DepartureCity,arrivalCity);
    var inover = appcan.locStorage.getVal('enout');
    var Num = appcan.locStorage.getVal('number');
    // console.log(inover)

    var flightNum= JSON.parse(appcan.locStorage.getVal('flightSearch'));
    function getData(page) {
        // var flightNum = JSON.parse(appcan.locStorage.getVal('flightSearch'));
        if (page.num == 1) {
            vm.lists = [];
        }
        var json = {
            // path: serverPath + 'focFlightSecondController.do?focGetflightByCondition',
            path: serverPath + 'focFlightSecondController.do?focGetflightByStatus',
            data: {
                flightno:flightnum,
                airlinescn:airLine,
                craftno:planeno,
                craftType:Model,
                gate:gate,
                starstationcn:DepartureCity,
                terminalstationcn:arrivalCity,
                pageStart: (page.num - 1) * page.size,
                pageEnd: page.size,
                sst: flightNum.time,
                dir: 1,
                currentTime: starttime,
                status:1
                // token :"8a8a8bfa5dcf1734015dcf21e1e30014@*@YKQi2DvQtc0szdTLfBhlg"
            },
            layer: false,
            layerErr: false
        };
        //请求获取数据,判断
        ajaxRequest(json, function (result, e) {
            console.log(result.obj);
            if (e == 'success') {
                // console.log(result);
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
                });
                vm.lists = vm.lists.concat(listData);
                console.log(vm.lists.length)
                mescroll.endSuccess(listData.length);
                if (vm.lists.length == 0) {
                    vm.nothing = true;
                }
            } else {
                mescroll.endErr();
                vm.nonet = true;
            }
        });
    };
})($);
